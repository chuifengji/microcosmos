const global = this;
(function () {
    let outterVariable = 'outter';
    const createSandbox = () => {
        const context = Object.create(global);
        const proxy = new Proxy(context, {
            set: (obj, prop, value) => {
                obj[prop] = value;
            },
            get: (obj, prop) => {
                return obj[prop];
            },
            has: () => {
                return true;
            }
        });
        return code => {
            Function(
                'proxy',
                `
                with(proxy) {
                    ;${code};
                }
            `
            )(proxy);
        };
    };
    const sandbox = createSandbox();
    sandbox(`
        var a = 1;
        var b = 2;
        console.log(a, b);
        outterVariable = 'sandbox';
        console.log(outterVariable);
    `);
    try {
        console.log(a, 'fail');
    } catch (e) {
        console.log('success');
    }
    try {
        console.log(b, 'fail');
    } catch (b) {
        console.log('success');
    }
    console.log(outterVariable);
})();
console.log('outterVariable' in global);
