export const RE_LABEL_STYLE = new RegExp(/<\s*style([\s\S]+)>([^>]*)<\s*\/style>/g);
export const RE_LABEL_SCRIPT_CONTENT = new RegExp(/(?<=<script[\s\S]*>)([\s\S]+)(?=<\/script>)/g);
export const RE_LABEL_LINK = new RegExp(/<\s*link([\s\S]+)>/g);
export const RE_LABEL_META = new RegExp(/<\s*meta([\s\S]+)>/g);
export const RE_LABEL_BODY = new RegExp(/(?<=<body[\s\S]*>)([\s\S]+)(?=<\/body>)/g);
export const RE_LABEL_SCRIPT_URL = new RegExp(/(?<=<script[^>]*src=['\"]?)[^'\"> ]*/g);
export const RE_LABEL_SCRIPT = new RegExp(/<script.*?>[\s\S.]*?<\/script>/g);
export const RE_LABEL_HEAD_CONTENT = new RegExp(/(?<=<head[\s\S]*>)([\s\S]+)(?=<\/head>)/g);
export const RE_SCRIPT_URL_OUTER = new RegExp(/\/\//)

//还需要去掉注释
//htmlLoader如果用正则处理，会有很多问题，如果把它加载到dom环境中去用dom api获取就很完美了。只是我们这里完全不需要这样去做
//SPA的特性使得我们要处理的内容少了很多，但是微前端难度只支持SPA应用吗？