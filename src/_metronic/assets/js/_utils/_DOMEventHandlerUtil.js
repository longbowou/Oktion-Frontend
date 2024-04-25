import {getUniqueIdWithPrefix} from './_TypesHelpers'

export class DOMEventHandlerUtil {
    static store = new Map()

    static on(
        element,
        selector,
        eventName,
        callBack
    ) {
        const eventId = getUniqueIdWithPrefix('DOMEvent')
        DOMEventHandlerUtil.store.set(eventId, (e) => {
            const targets = element.querySelectorAll(selector)
            let target = e.target
            while (target && target !== element) {
                for (let i = 0; i < targets.length; i++) {
                    if (target === targets[i]) {
                        callBack(target, e)
                    }
                }

                if (target.parentElement) {
                    target = target.parentElement
                } else {
                    target = null
                }
            }
        })
        element.addEventListener(eventName, DOMEventHandlerUtil.store.get(eventId))
        return eventId
    }

    static off(element, eventName, eventId) {
        const funcFromStore = DOMEventHandlerUtil.store.get(eventId)
        if (!funcFromStore) {
            return
        }

        element.removeEventListener(eventName, funcFromStore)
        DOMEventHandlerUtil.store.delete(eventId)
    }

    static one(element, eventName, callBack) {
        element.addEventListener(eventName, function calee(e) {
            // remove event
            if (e.target && e.target.removeEventListener) {
                e.target.removeEventListener(e.type, calee)
            }

            if (element && e && e.currentTarget) {
                // if (element && element.removeEventListener && e && e.currentTarget) {
                e.currentTarget.removeEventListener(e.type, calee)
            }

            // call hander
            return callBack(e)
        })
    }
}
