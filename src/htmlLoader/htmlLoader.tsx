import { RE_LABEL_STYLE, RE_LABEL_SCRIPT, RE_LABEL_LINK, RE_LABEL_META, RE_LABEL_BODY, RE_LABEL_HEAD } from "./regex"
import { request } from "../util/request"

//loadHtml 载入html到app定义的容器中
export async function loadHtml(url: string, ct: string) {
    let html = await request(url),
        body = RE_LABEL_BODY.exec(html),
        head = RE_LABEL_HEAD.exec(html),
        container = document.getElementById(ct),
        period,
        result: string = '';
    if (head) {
        while ((period = RE_LABEL_LINK.exec(head.toString())) != null) {
            result += period;
        }
        while ((period = RE_LABEL_META.exec(head.toString())) != null) {
            result += period;
        }
        while ((period = RE_LABEL_STYLE.exec(head.toString())) != null) {
            result += period;
        }
        while ((period = RE_LABEL_SCRIPT.exec(head.toString())) != null) {
            result += period;
        }
    }
    if (!container) { throw Error('the div tag with id' + ct + 'does not exist!') } else {
        container.innerHTML = result;
        if (body) { container.innerHTML += body.toString() }
    }

}

