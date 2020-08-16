import { request } from "../util/request"
import { memorize } from "../util/handlers"
import { sandbox } from "../sandbox/sandbox"
export async function parseHtml(url: string): Promise<[string, Array<string>]> {
    let iframe = document.createElement('iframe');
    iframe.setAttribute('src', url);
    let div = document.createElement('div');
    div.style.display = 'none'
    div.appendChild(iframe);
    document.body.appendChild(div);
    let scriptsArray: Array<string> = [],
        result: string,
        root = await iframeReady(iframe),
        [scriptUrls, scripts] = parseScript(root.documentElement);
    scriptUrls.forEach(async item => { scriptsArray.push(await request(item as string)) });
    scripts.forEach(async item => { scriptsArray.push(item as string) });
    result = root.head.outerHTML + root.body.outerHTML;
    return [result, scriptsArray];
}

export async function loadHtml(ct: string, url: string, appName: string) {
    let getData = memorize(parseHtml),
        [result, scriptsArray] = await getData(url),
        container = document.getElementById(ct);
    if (!container) { throw Error('the div tag with id ' + appName + ' does not exist!') } else {
        container.innerHTML = result;
        scriptsArray.map((item: string) => { sandbox(item, appName); })
    }
}


export function parseScript(element: Element) {
    let scriptUrls = [],
        scripts = [];
    (function dfs(elements: Element) {
        for (let i = 0; i <= elements.children.length; i++) {
            let element = elements.children[i];
            let parent = element.parentNode;
            if (element.children && element.nodeType == 1) {
                dfs(element);
            }
            if (element.nodeName === "script" && element.getAttribute("src") === null) {
                if (element.getAttribute("src") == null) {
                    let script = element.outerHTML;
                    scripts.push(script);
                } else {
                    scriptUrls.push(element.getAttribute("src"))
                }
                let comment = document.createComment('this script is replaced by microcosmos and run in sandbox')
                parent?.replaceChild(comment, element)
            }
        }
    })(element)
    return [scriptUrls, scripts]
}

function iframeReady(iframe: HTMLIFrameElement): Promise<Document> {
    return new Promise(function (resolve, reject) {
        (function isiframeReady() {
            if (iframe.contentDocument || (iframe.contentWindow as Window).document) {
                resolve(iframe.contentDocument || (iframe.contentWindow as Window).document)
            } else {
                setInterval(isiframeReady, 10)
            }
        })()
    })
}





