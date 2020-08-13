export const RE_LABEL_STYLE = new RegExp(/<\s*style([\s\S]+)>([^>]*)<\s*\/style>/g);
export const RE_LABEL_SCRIPT_CONTENT = new RegExp(/(?<=<script[\s\S]*>)([\s\S]+)(?=<\/script>)/g);
export const RE_LABEL_LINK = new RegExp(/<\s*link([\s\S]+)>/g);
export const RE_LABEL_META = new RegExp(/<\s*meta([\s\S]+)>/g);
export const RE_LABEL_BODY = new RegExp(/(?<=<body[\s\S]*>)([\s\S]+)(?=<\/body>)/g);
export const RE_LABEL_SCRIPT_URL = new RegExp(/(?<=<script.*src=("|'))(.+)(?=("|')>([\s\S]*)<\/script>)/g);
export const RE_LABEL_SCRIPT = new RegExp(/<\s*script([\s\S]+)>([^>]*)<\s*\/script>/g);

