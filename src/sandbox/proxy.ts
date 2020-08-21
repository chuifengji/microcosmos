import { isObject, isArray, getCleanCopy } from "../util/handlers"
import { copyOnWrite, copyProp } from "./copyOnWrite"

function proxyProp(propValue, propKey, hostDraftState) {
    const { originalValue, draftValue, onWrite } = hostDraftState;
    return createProxy(propValue, (value) => {
        if (!draftValue.mutated) {
            hostDraftState.mutated = true;
            // 拷贝host所有属性
            copyProp(draftValue, originalValue);
        }
        draftValue[propKey] = value;
        if (onWrite) {
            onWrite(draftValue);
        }
    });
}

export function createProxy(proxyTarget: { [key: string]: any }, onWrite: any, appName?: string) {
    const draftValue = isArray(proxyTarget) ? [] : getCleanCopy(proxyTarget)
    let proxiedKeyMap = Object.create(null)
    let draftState = {
        originalValue: proxyTarget,
        draftValue,
        onWrite,
        mutated: false,
    }
    return new Proxy(proxyTarget, {
        get(
            target: { [key: string]: any }, propKey: string, receiver
        ) {
            if (propKey === 'RUNIN_MICROCOSMOS_SANDBOX') return true
            if (propKey in proxiedKeyMap) return proxiedKeyMap[propKey]
            if (isObject(proxyTarget[propKey]) || isArray(proxyTarget[propKey])) {
                proxiedKeyMap[propKey] = proxyProp(proxyTarget[propKey], propKey, draftState);
                return proxiedKeyMap[propKey]
            }
            else if (typeof draftValue[propKey] === 'function') {
                return draftValue[propKey].bind(proxyTarget)
            } else if (typeof target[propKey] === 'function') {
                return target[propKey].bind(proxyTarget)
            }
            else {
                // if (draftState.mutated) {
                //     return draftValue[propKey];
                // }
                // return Reflect.get(target, propKey, receiver);
                return draftValue[propKey] || target[propKey]
            }
        },
        set(target, propKey: string, value) {
            if (isObject(proxyTarget[propKey]) || isArray(proxyTarget[propKey])) {
                proxiedKeyMap[propKey] = proxyProp(value, propKey, draftState);
            }
            copyOnWrite(draftState);
            draftValue[propKey] = value
            return true
        }
    })
}