//const RE_STYLE_CONTENT = `/(?<=<style.*>)([\s\S]+)(?=<\/style>)/g`;/匹配<style></style>之间的内容.
export const RE_LABEL_STYLE = /<\s*style([\s\S]+)>([^>]*)<\s*\/style>/g;
export const RE_LABEL_SCRIPT = /<\s*script([\s\S]+)>([^>]*)<\s*\/script>/g;
export const RE_LABEL_LINK = /<\s*link([\s\S]+)>/g;
export const RE_LABEL_META = /<\s*meta([\s\S]+)>/g;
export const RE_LABEL_BODY = /<\s*body([\s\S]+)>([^>]*)<\s*\/body>/g;
export const RE_LABEL_HEAD = /<\s*head([\s\S]+)>([^>]*)<\s*\/head>/g;

