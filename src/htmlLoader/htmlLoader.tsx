import { RE_LABEL_STYLE, RE_LABEL_SCRIPT, RE_LABEL_LINK, RE_LABEL_META, RE_LABEL_BODY, RE_LABEL_HEAD } from "./regex"
import { request } from "../util/request"
import { memorize } from "../util/memorize"
//loadHtml 载入html到app定义的容器中
export async function reHtml(url: string): Promise<string> {
    let html = await request(url),
        body = RE_LABEL_BODY.exec(html),
        head = RE_LABEL_HEAD.exec(html),
        period,
        result: string = '';
    while ((period = RE_LABEL_LINK.exec((head as RegExpExecArray).toString())) != null) {
        result += period;
    }
    while ((period = RE_LABEL_META.exec((head as RegExpExecArray).toString())) != null) {
        result += period;
    }
    while ((period = RE_LABEL_STYLE.exec((head as RegExpExecArray).toString())) != null) {
        result += period;
    }
    while ((period = RE_LABEL_SCRIPT.exec((head as RegExpExecArray).toString())) != null) {
        result += period;
    }
    result += (body as RegExpExecArray).toString();
    return result;
}
//事实上，因为微前端的子应用都是SPA，我们可以直接将scriptfetch下来，反正后面提取钩子函数也需要。head标签中的内容就正则提取再append吧。
export async function loadHtml(ct: string, url: string) {
    let getHtml = memorize(reHtml),
        result = await getHtml(url),
        container = document.getElementById(ct);
    if (!container) { throw Error('the div tag with id' + ct + 'does not exist!') } else {
        container.innerHTML = result;
    }
}

