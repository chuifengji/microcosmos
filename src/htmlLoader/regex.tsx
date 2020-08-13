//const RE_STYLE_CONTENT = `/(?<=<style.*>)([\s\S]+)(?=<\/style>)/g`;/匹配<style></style>之间的内容.
export const RE_LABEL_STYLE = new RegExp(/<\s*style([\s\S]+)>([^>]*)<\s*\/style>/g);
export const RE_LABEL_SCRIPT_CONTENT = new RegExp(/<\s*script([\s\S]+)>([^>]*)<\s*\/script>/g);
export const RE_LABEL_LINK = new RegExp(/<\s*link([\s\S]+)>/g);
export const RE_LABEL_META = new RegExp(/<\s*meta([\s\S]+)>/g);
export const RE_LABEL_BODY = new RegExp(/<\s*body([\s\S]+)>([^>]*)<\s*\/body>/g);
export const RE_LABEL_HEAD = new RegExp(/<\s*head([\s\S]+)>([^>]*)<\s*\/head>/g);
export const RE_LABEL_SCRIPT_URL = new RegExp(/<\s*script([\s\S]+)>([^>]*)<\s*\/script>/g);
export const RE_LABEL_SCRIPT = new RegExp(/<\s*script([\s\S]+)>([^>]*)<\s*\/script>/g);

