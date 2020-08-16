import { request } from "../util/request"
import { memorize } from "../util/handlers"
import { sandbox } from "../sandbox/sandbox"
import { RE_LABEL_BODY_CONTENT, RE_LABEL_HEAD_CONTENT } from "./regex"
export async function parseHtml(url: string, appName: string): Promise<[string, Array<string>]> {
    let div = document.createElement('div'),
        scriptsArray: Array<string> = [],
        result: string = '',
        originHtml: string = await request(url),
        periodHead = RE_LABEL_HEAD_CONTENT.exec(originHtml),
        periodBody = RE_LABEL_BODY_CONTENT.exec(originHtml);
    if (periodHead && periodBody) {
        result += periodHead[1].toString();
        result += periodBody[1].toString();
    }
    else { throw Error('There was an error parsing the head tag or body tag from the app named ' + appName) };
    div.innerHTML = result;
    const [scriptUrls, scripts, elements] = parseScript(div);
    scriptUrls.forEach(async item => { scriptsArray.push(await request(item as string)) });
    scripts.forEach(async item => { scriptsArray.push(item as string) });
    return [elements, scriptsArray];
}

export async function loadHtml(ct: string, url: string, appName: string) {
    let getData = memorize(parseHtml),
        [result, scriptsArray] = await getData(url, appName),
        container = document.getElementById(ct);
    if (!container) { throw Error('the div tag with id ' + appName + ' does not exist!') } else {
        container.innerHTML = result;
        scriptsArray.map((item: string) => { sandbox(item, appName); })
    }
}

export function parseScript(root: Element): [Array<string>, Array<string>, string] {
    let scriptUrls: Array<string> = [],
        scripts: Array<string> = [],
        elements: string;
    (function dfs(element: Element) {
        let children = element.children,
            parent = element.parentNode;
        if (element.localName === "script") {
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

// function iframeReady(iframe: HTMLIFrameElement, iframeName: string): Promise<Document> {
//     return new Promise(function (resolve, reject) {
//         window.frames[iframeName].addEventListener('DOMContentLoaded', () => {
//             let html = iframe.contentDocument || (iframe.contentWindow as Window).document;
//             resolve(html);
//         });
//     });
// }





