import { isObject, isArray, getCleanCopy } from "../util/handlers"
import { copyOnWrite, copy } from "./copyOnWrite"
function proxyProp(propValue: Object | Array<any>, propKey: string, draftState: any) {
    const { originalValue, draftValue, onWrite } = draftState;
    return createProxy(propValue, (value: any) => {
        if (!draftValue.mutated) {
            draftState.mutated = true;
            // 拷贝所有属性
            copy(draftValue, originalValue);
        }
        draftValue[propKey] = value;
        if (onWrite) {
            onWrite(draftValue);
        }
    });
}

function getTarget(draftState: any) {
    return draftState.mutated ? draftState.draftValue : draftState.originalValue;
}

export const createProxy = (proxyTarget: { [key: string]: any }, onWrite: Function) => {
    const draftValue = isArray(proxyTarget) ? [] : getCleanCopy(proxyTarget);
    let draftState = {
        originalValue: proxyTarget,
        draftValue,
        mutated: false,
        onWrite
    };
    let proxiedKeyMap = Object.create(null);
    return new Proxy(proxyTarget, {
        get(target: { [key: string]: any }, propKey: string) {
            // 建立proxy到draft值的关联
            if (propKey === 'INTERNAL_STATE_KEY') {//返回原值
                return draftState;//TODO：不是返回 proxyTarget吗
            }
            // 优先走已创建的代理
            if (propKey in proxiedKeyMap) {
                return proxiedKeyMap[propKey];
            }

            // 代理属性访问
            if (isArray(target[propKey]) || isObject(target[propKey])) {
                // 不为基本值类型的现有属性，创建下一层代理
                proxiedKeyMap[propKey] = proxyProp(proxyTarget[propKey], propKey, draftState);
                return proxiedKeyMap[propKey];
            }
            else {
                // 改过直接从draft取最新状态
                if (draftState.mutated) {
                    return draftValue[propKey];
                }

                // 不存在的，或者值为基本值的现有属性，代理到原值
                return Reflect.get(target, propKey);
            }
        },
        set(target, propKey: string, value: any): boolean {
            // 监听修改，用新值重写原值
            // 如果新值不为基本值类型，创建下一层代理
            if (isArray(value) || isObject(value)) {
                proxiedKeyMap[propKey] = proxyProp(value, propKey, draftState);
            }
            // 第一次写时复制
            copyOnWrite(draftState);
            // 复制过了，直接写
            draftValue[propKey] = value;
            return true;
        },
        // 代理其它读方法
        has(_, ...args) {
            return Reflect.has(getTarget(draftState), ...args);
        },
        ownKeys(_, ...args) {
            return Reflect.ownKeys(getTarget(draftState), ...args);
        },
        getOwnPropertyDescriptor(_, ...args) {
            return Reflect.getOwnPropertyDescriptor(getTarget(draftState), ...args);
        },
        getPrototypeOf(_, ...args) {
            return Reflect.getPrototypeOf(proxyTarget, ...args);
        },
        // 代理其它写方法
        deleteProperty(_, ...args) {
            copyOnWrite(draftState);
            return Reflect.deleteProperty(draftValue, ...args);
        },
        defineProperty(_, ...args) {
            copyOnWrite(draftState);
            return Reflect.defineProperty(draftValue, ...args);
        },
        setPrototypeOf(_, ...args) {
            copyOnWrite(draftState);
            return Reflect.setPrototypeOf(draftValue, ...args);
        }
    })
}
