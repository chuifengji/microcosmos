import { request } from "../util/request"
import { sandbox } from "../sandbox/sandbox"
import { findApp } from "../util/handlers"
import { RE_LABEL_BODY_CONTENT, RE_LABEL_HEAD_CONTENT } from "./regex"
import { _app } from "src/util/types"
export let parseHtml = (async function () {
    let cache: any = {};
    return async function (url: string, appName: string): Promise<[string, Array<string>]> {
        const _arg = Array.prototype.join.call(arguments, ',')
        if (cache[_arg]) { return cache[_arg] }
        let div = document.createElement('div'),
            scriptsArray: Array<string> = [],
            result: string = '',
            originHtml: string = await request(url),
            periodHead = originHtml.match(RE_LABEL_HEAD_CONTENT),
            periodBody = originHtml.match(RE_LABEL_BODY_CONTENT);
        if (periodHead && periodBody) {
            result += periodHead[0];
            result += periodBody[0];
        }
        else { throw Error('There was an error parsing the head tag or body tag from the app named ' + appName) };
        div.innerHTML = result;
        const [scriptUrls, scripts, elements] = parseScript(div);
        const fetchedScript = await Promise.all(scriptUrls.map(url => request(url)))
        scriptsArray = scripts.concat(fetchedScript);
        cache[_arg] = [elements, scriptsArray];
        return [elements, scriptsArray]
    }
})()
export async function loadHtml(ct: string, url: string, appName: string): Promise<_app> {
    return new Promise(async (resolve, reject) => {
        let [result, scriptsArray] = await (await parseHtml)(url, appName),
            container = document.getElementById(ct);
        if (!container) { throw Error('the div tag with id ' + appName + ' does not exist!') } else {
            container.innerHTML = result;
            scriptsArray.map((item: string) => { sandbox(item, appName); })
        }
        resolve(findApp(appName))
    })
}

export function parseScript(root: Element): [Array<string>, Array<string>, string] {
    let scriptUrls: Array<string> = [],
        scripts: Array<string> = [],
        elements: string;
    (function dfs(element: Element) {
        let children = element.children,
            parent = element.parentNode;
        if (element.nodeName === "SCRIPT") {
            const src = element.getAttribute('src')
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
    })(root)
    elements = root.outerHTML
    return [scriptUrls, scripts, elements]
}
//TODO:link标签也会有js，script标签获取不完整




