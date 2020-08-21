function getOwnPropertyDescriptors(target: any) {
    const res: any = {}
    Reflect.ownKeys(target).forEach(key => {
        res[key] = Object.getOwnPropertyDescriptor(target, key)
    })
    return res
}

export function copyProp(target: any, source: any) {
    if (Array.isArray(target)) {
        for (let i = 0; i < source.length; i++) {
            if (!(i in target)) {
                target[i] = source[i];
            }
        }
    }
    else {
        const descriptors = getOwnPropertyDescriptors(source)
        //delete descriptors[DRAFT_STATE as any]
        let keys = Reflect.ownKeys(descriptors)
        for (let i = 0; i < keys.length; i++) {
            const key: any = keys[i]
            const desc = descriptors[key]
            if (desc.writable === false) {
                desc.writable = true
                desc.configurable = true
            }
            if (desc.get || desc.set)
                descriptors[key] = {
                    configurable: true,
                    writable: true, // could live with !!desc.set as well here...
                    enumerable: desc.enumerable,
                    value: source[key]
                }
        }
        target = Object.create(Object.getPrototypeOf(source), descriptors)
        console.log(target)
    }
}

export function copyOnWrite(draftState: {
    originalValue: {
        [key: string]: any;
    };
    draftValue: any;
    onWrite: any;
    mutated: boolean;
}) {
    const { originalValue, draftValue, mutated, onWrite } = draftState;
    if (!mutated) {
        draftState.mutated = true;
        if (onWrite) {
            onWrite(draftValue);
        }
        copyProp(draftValue, originalValue);
    }
}
