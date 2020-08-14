import {
    RE_LABEL_STYLE, RE_LABEL_SCRIPT, RE_LABEL_SCRIPT_CONTENT,
    RE_LABEL_SCRIPT_URL, RE_LABEL_LINK, RE_LABEL_META, RE_LABEL_BODY
} from "./regex"
import { request } from "../util/request"
import { memorize } from "../util/handlers"
import { sandbox } from "../sandbox/sandbox"
export async function reHtml(url: string): Promise<[string, Array<string>]> {
    let html = await request(url),
        period,
        head: string = '',
        body: string = '',
        result: string = '',
        scriptsArray: Array<string> = [];
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
        urlArray.forEach(async item => {
            scriptsArray.push(await requestScript(item));
        })
    }
    while ((period = RE_LABEL_SCRIPT_CONTENT.exec(html)) != null) {
        scriptsArray.push(period[1].trim());
    }
    html = html.replace(RE_LABEL_SCRIPT, `<!-- this script is replaced and run in sandbox-->`);
    body = (RE_LABEL_BODY.exec(html) as RegExpExecArray).toString();
    result = head + body;
    return [result, scriptsArray];
}
export async function requestScript(url: string): Promise<string> {
    return await request(url);
}
export async function loadHtml(ct: string, url: string, appName: string) {
    let getHtml = memorize(reHtml),
        [result, scriptsArray] = await getHtml(url),
        container = document.getElementById(ct);
    if (!container) { throw Error('the div tag with id ' + appName + ' does not exist!') } else {
        container.innerHTML = result;
        scriptsArray.map((item: string) => { sandbox(item, appName); })
    }
}

