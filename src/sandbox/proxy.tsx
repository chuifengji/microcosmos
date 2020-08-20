import { isObject, isArray, getCleanCopy } from "../util/handlers"
import { copyOnWrite, copy } from "./copyOnWrite"

function getTarget(draftState: any) {
    return draftState.mutated ? draftState.draftValue : draftState.originalValue;
}

export function createProxy(proxyTarget: { [key: string]: any }, onWrite: any, appName?: string) {
    const draftValue = isArray(proxyTarget) ? [] : getCleanCopy(proxyTarget)
    let proxiedKeyMap = Object.create(null)
    let draftState = {
        proxyTarget,
        draftValue,
        onWrite,
    }
    return new Proxy(proxyTarget, {
        get(
            target: { [key: string]: any }, propKey: string
        ) {
            if (propKey === 'RUNIN_MICROCOSMOS_SANDBOX') return true
            if (propKey in proxiedKeyMap) return proxiedKeyMap[propKey]
            if (isObject(proxyTarget[propKey]) || isArray(proxyTarget[propKey])) {
                proxiedKeyMap[propKey] = createProxy(
                    proxyTarget[propKey],
                    (obj: Record<string, unknown>) => (draftValue[propKey] = obj)
                )
                return proxiedKeyMap[propKey]
            } else {
                return draftValue[propKey] || target[propKey]
            }
        },
        set(target, propKey: string, value) {
            if (isObject(proxyTarget[propKey]) || isArray(proxyTarget[propKey])) {
                proxiedKeyMap[propKey] = createProxy(
                    value,
                    (obj: Record<string, unknown>) => (draftValue[propKey] = obj)
                )
            }
            onWrite && onWrite(draftState.onWrite)
            draftValue[propKey] = value
            return true
        }
    })
}