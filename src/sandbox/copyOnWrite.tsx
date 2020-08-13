// 跳过target身上已有的属性
export function copy(target: any, source: any) {
    if (Array.isArray(target)) {
        for (let i = 0; i < source.length; i++) {
            // 跳过在更深层已经被改过的属性
            if (!(i in target)) {
                target[i] = source[i];
            }
        }
    }
    else {
        //Reflect.ownKeys 返回对象所有属性名
        Reflect.ownKeys(source).forEach(key => {
            const desc = Object.getOwnPropertyDescriptor(source, key);
            // 跳过已有属性
            if (!(key in target)) {
                Object.defineProperty(target, key, desc as PropertyDescriptor);
            }
        });
    }
}

export function copyOnWrite(draftState: any) {
    const { originalValue, draftValue, mutated, onWrite } = draftState;
    if (!mutated) {
        draftState.mutated = true;
        // 下一层有修改时才往父级 draftValue 上挂
        if (onWrite) {
            onWrite(draftValue);
        }
        // 第一次写时复制
        copy(draftValue, originalValue);
    }
}