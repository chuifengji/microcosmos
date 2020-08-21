import { lifecycle } from "../lifecycle/lifecycle"
import { isChangeApp } from "../util/handlers"
export function routerChange() {
    isChangeApp() ? lifecycle() : false
}