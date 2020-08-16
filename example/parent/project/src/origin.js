function request(url, options) {
    if (!window.fetch) {
        throw Error("It looks like that your browser doesn't support fetch. Polyfill is needed before you use it.");
    }
    return fetch(url, Object.assign({ mode: 'cors' }, options)).then((res) => res.text());
}

//memorize: 函数缓存
function memorize(fn) {
    const cache = {};
    return function ([...args]) {
        const _args = JSON.stringify(args);
        return cache[_args] || (cache[_args] = fn.apply(fn, args));
    };
}
//判断对象属于哪种内置类型
function checkType(value) {
    return Object.prototype.toString.call(value);
}
function isObject(value) {
    return checkType(value) === "[object Object]";
}
function isArray(value) {
    return checkType(value) === '[object Array]';
}
function getCleanCopy(obj) {
    return Object.create(Object.getPrototypeOf(obj));
}
//patchEventListener 改变全局事件状态
function patchEventListener(event, ListerName) {
    return function () {
        const e = new Event(ListerName);
        event.apply(this, arguments);
        window.dispatchEvent(e);
    };
}

// 跳过target身上已有的属性
function copy(target, source) {
    if (Array.isArray(target)) {
        for (let i = 0; i < source.length; i++) {
            // 跳过在更深层已经被改过的属性
            if (!(i in target)) {
                target[i] = source[i];
            }
        }
    }
    else {
        //Reflect.ownKeys 返回对象所有属性名
        Reflect.ownKeys(source).forEach(key => {
            const desc = Object.getOwnPropertyDescriptor(source, key);
            // 跳过已有属性
            if (!(key in target)) {
                Object.defineProperty(target, key, desc);
            }
        });
    }
}
function copyOnWrite(draftState) {
    const { originalValue, draftValue, mutated, onWrite } = draftState;
    if (!mutated) {
        draftState.mutated = true;
        // 下一层有修改时才往父级 draftValue 上挂
        if (onWrite) {
            onWrite(draftValue);
        }
        // 第一次写时复制
        copy(draftValue, originalValue);
    }
}

function proxyProp(propValue, propKey, draftState) {
    const { originalValue, draftValue, onWrite } = draftState;
    return createProxy(propValue, (value) => {
        if (!draftValue.mutated) {
            draftState.mutated = true;
            // 拷贝所有属性
            copy(draftValue, originalValue);
        }
        draftValue[propKey] = value;
        if (onWrite) {
            onWrite(draftValue);
        }
    });
}
function getTarget(draftState) {
    return draftState.mutated ? draftState.draftValue : draftState.originalValue;
}
function createProxy(proxyTarget, onWrite, appName) {
    const draftValue = isArray(proxyTarget) ? [] : getCleanCopy(proxyTarget);
    let draftState = {
        originalValue: proxyTarget,
        draftValue,
        mutated: false,
        onWrite
    };
    let proxiedKeyMap = Object.create(null);
    return new Proxy(proxyTarget, {
        get(target, propKey) {
            // 建立proxy到draft值的关联
            if (propKey === 'INTERNAL_STATE_KEY') { //返回原值
                return draftState; //TODO：不是返回 proxyTarget吗
            }
            // 优先走已创建的代理
            if (propKey in proxiedKeyMap) {
                return proxiedKeyMap[propKey];
            }
            // 代理属性访问
            if (isArray(target[propKey]) || isObject(target[propKey])) {
                // 不为基本值类型的现有属性，创建下一层代理
                proxiedKeyMap[propKey] = proxyProp(proxyTarget[propKey], propKey, draftState);
                return proxiedKeyMap[propKey];
            }
            else {
                // 改过直接从draft取最新状态
                if (draftState.mutated) {
                    return draftValue[propKey];
                }
                // 不存在的，或者值为基本值的现有属性，代理到原值
                return Reflect.get(target, propKey);
            }
        },
        set(target, propKey, value) {
            // 监听修改，用新值重写原值
            // 如果新值不为基本值类型，创建下一层代理
            if (isArray(value) || isObject(value)) {
                proxiedKeyMap[propKey] = proxyProp(value, propKey, draftState);
            }
            // 第一次写时复制
            copyOnWrite(draftState);
            // 复制过了，直接写
            draftValue[propKey] = value;
            return true;
        },
        // 代理其它读方法
        has(_, ...args) {
            return Reflect.has(getTarget(draftState), ...args);
        },
        ownKeys(_, ...args) {
            return Reflect.ownKeys(getTarget(draftState), ...args);
        },
        getOwnPropertyDescriptor(_, ...args) {
            return Reflect.getOwnPropertyDescriptor(getTarget(draftState), ...args);
        },
        getPrototypeOf(_, ...args) {
            return Reflect.getPrototypeOf(proxyTarget, ...args);
        },
        // 代理其它写方法
        deleteProperty(_, ...args) {
            copyOnWrite(draftState);
            return Reflect.deleteProperty(draftValue, ...args);
        },
        defineProperty(_, ...args) {
            copyOnWrite(draftState);
            return Reflect.defineProperty(draftValue, ...args);
        },
        setPrototypeOf(_, ...args) {
            copyOnWrite(draftState);
            return Reflect.setPrototypeOf(draftValue, ...args);
        }
    });
}

function runScript(script, appName, proxyEnvir) {
    const execscript = `with(proxyEnvir.INTERNAL_STATE_KEY){${script} 
         return proxyEnvir['${appName}']}`;
    const performer = new Function('proxyEnvir', execscript);
    try {
        performer.call(proxyEnvir, proxyEnvir);
    }
    catch (err) {
        console.error(`error occurred while executing the code in the sandbox`);
        throw err;
    }
}
function sandbox(script, appName) {
    let createSandbox = memorize(createProxy), proxyEnvir = createSandbox(window, null, appName);
    runScript(script, appName, proxyEnvir);
}

async function parseHtml(url, appName) {
    let iframe = document.createElement('iframe');
    iframe.setAttribute('src', url);
    iframe.setAttribute('name', appName);
    let div = document.createElement('div');
    div.style.display = 'none';
    div.appendChild(iframe);
    document.body.appendChild(div);
    let scriptsArray = [], result, root = await iframeReady(iframe, appName), [scriptUrls, scripts] = parseScript(root.documentElement);
    console.log(root, 's')
    scriptUrls.forEach(async (item) => { scriptsArray.push(await request(item)); });
    scripts.forEach(async (item) => { scriptsArray.push(item); });
    result = root.head.outerHTML + root.body.outerHTML;
    console.log(result, scriptsArray)
    return [result, scriptsArray];
}
async function loadHtml(ct, url, appName) {
    let [result, scriptsArray] = await parseHtml(url, appName), container = document.getElementById(ct);
    if (!container) {
        throw Error('the div tag with id ' + appName + ' does not exist!');
    }
    else {
        container.innerHTML = result;
        scriptsArray.map((item) => { sandbox(item, appName); });
    }
}
function parseScript(root) {
    let scriptUrls = [], scripts = [];
    function dfs(element) {
        let children = element.children, parent = element.parentNode;
        if (element.localName === "script") {
            const src = element.getAttribute('src');
            if (!src) {
                let script = element.outerHTML;
                scripts.push(script);
            }
            else {
                scriptUrls.push(src);
            }
            let comment = document.createComment('this script is replaced by microcosmos and run in sandbox');
            parent === null || parent === void 0 ? void 0 : parent.replaceChild(comment, element);
        }
        for (let i = 0; i < children.length; i++) {
            dfs(children[i]);
        }
    }
    dfs(root);
    return [scriptUrls, scripts];
}
function iframeReady(iframe, iframeName) {
    return new Promise(function (resolve, reject) {
        window.frames[iframeName].addEventListener('DOMContentLoaded', () => {
            let html = iframe.contentDocument || iframe.contentWindow.document;
            console.log('ojbk')
            resolve(html);
        });
    });
}

function routerChange() {
    window.appList.forEach(item => {
        if (item.matchRouter === window.history.state) {
            console.log('loadHtml ' + window.history.state);
            loadHtml(item.container, item.entry, item.name);
        }
    });
}
//TODO:我重写了全局的window.history方法，并进行监听，会不会对用户开放造成影响？这种路由管理方式如何嵌入子应用路由？如何缓存子应用的路由状态？

window.appList = [];
window.history.pushState = patchEventListener(window.history.pushState, "cosmos_pushState");
window.history.replaceState = patchEventListener(window.history.replaceState, "cosmos_replaceState");
function register(apps) {
    apps.forEach(item => window.appList.push(item));
}
function directLoad(apps) {
    apps.forEach(item => window.appList.push(item));
}
function start() {
    if (!window.appList) {
        throw Error('are you sure you have successfully imported apps?');
    }
    else {
        window.onhashchange = routerChange; //开启路由侦测
        window.addEventListener("cosmos_pushState", routerChange);
        window.addEventListener("cosmos_replaceState", routerChange);
        window.appList.forEach(item => { !item.matchRouter ? loadHtml(item.container, item.entry, item.name) : console.log('not direct load app'); }); //需要直接载入的app就直接load
    }
}

export { directLoad, register, start };
//# sourceMappingURL=microcosmos.js.map
