const RE_LABEL_STYLE = new RegExp(/<\s*style([\s\S]+)>([^>]*)<\s*\/style>/g);
const RE_LABEL_SCRIPT_CONTENT = new RegExp(/(?<=<script[\s\S]*>)([\s\S]+)(?=<\/script>)/g);
const RE_LABEL_LINK = new RegExp(/<\s*link([\s\S]+)>/g);
const RE_LABEL_META = new RegExp(/<\s*meta([\s\S]+)>/g);
const RE_LABEL_BODY = new RegExp(/(?<=<body[\s\S]*>)([\s\S]+)(?=<\/body>)/g);
const RE_LABEL_SCRIPT_URL = new RegExp(/(?<=<script.*src=("|'))(.+)(?=("|')>([\s\S]*)<\/script>)/g);
const RE_LABEL_SCRIPT = new RegExp(/<\s*script([\s\S]+)>([^>]*)<\s*\/script>/g);

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
        window.dispatchEvent(e);
        return event.apply(this, arguments);
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

async function reHtml(url) {
    let html = await request(url), period, head = '', body = '', result = '', scriptsArray = [];
    while ((period = RE_LABEL_LINK.exec(html)) != null) {
        head += period[1].trim();
    }
    while ((period = RE_LABEL_META.exec(html)) != null) {
        head += period[1].trim();
    }
    while ((period = RE_LABEL_STYLE.exec(html)) != null) {
        head += period[1].trim();
    }
    while ((period = RE_LABEL_SCRIPT_URL.exec(html)) != null) {
        let urlArray = [];
        urlArray.push(period[1].trim() + window.location.origin);
        urlArray.forEach(async (item) => {
            scriptsArray.push(await requestScript(item));
        });
    }
    while ((period = RE_LABEL_SCRIPT_CONTENT.exec(html)) != null) {
        scriptsArray.push(period[1].trim());
    }
    html = html.replace(RE_LABEL_SCRIPT, `<!-- this script is replaced and run in sandbox-->`);
    body = RE_LABEL_BODY.exec(html).toString();
    result = head + body;
    return [result, scriptsArray];
}
async function requestScript(url) {
    return await request(url);
}
async function loadHtml(ct, url, appName) {
    let getHtml = memorize(reHtml), [result, scriptsArray] = await getHtml(url), container = document.getElementById(ct);
    if (!container) {
        throw Error('the div tag with id ' + appName + ' does not exist!');
    }
    else {
        container.innerHTML = result;
        scriptsArray.map((item) => { sandbox(item, appName); });
    }
}

function routerChange() {
    console.log("调用了");
    window.appList.forEach(item => {
        if (item.matchRouter === window.location.hash) {
            loadHtml(item.container, item.entry, item.name);
        }
    });
}

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
        console.log(window.location.href);
        window.onhashchange = routerChange; //开启路由侦测
        window.addEventListener("cosmos_pushState", routerChange);
        window.addEventListener("cosmos_replaceState", routerChange);
        window.appList.forEach(item => { !item.matchRouter ? loadHtml(item.container, item.entry, item.name) : console.log('not direct load app'); }); //需要直接载入的app就直接load
    }
}

export { directLoad, register, start };
//# sourceMappingURL=microcosmos.js.map
