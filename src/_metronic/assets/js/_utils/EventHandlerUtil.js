import {DataUtil} from './_DataUtil'
import {getUniqueIdWithPrefix} from './_TypesHelpers'


export class EventHandlerUtil {
    static store = {}

    static setEventMetasByName(
        name,
        handlers
    ) {
        EventHandlerUtil.store[name] = handlers
    }

    static getEventMetaByName(name) {
        return EventHandlerUtil.store[name]
    }

    static setEventMetaByNameAndHandlerId(
        name,
        handlerId,
        meta
    ) {
        if (EventHandlerUtil.store[name]) {
            EventHandlerUtil.store[name][handlerId] = meta
            return
        }
        EventHandlerUtil.store[name] = {}
        EventHandlerUtil.store[name][handlerId] = meta
    }

    static getEventMetaByHandlerId(name, handlerId) {
        const handlersIds = EventHandlerUtil.store[name]
        if (!handlersIds) {
            return
        }
        return handlersIds[handlerId]
    }

    static setFiredByNameAndHandlerId(name, handerId, fired) {
        const meta = EventHandlerUtil.getEventMetaByHandlerId(name, handerId)
        if (!meta) {
            return
        }

        meta.fired = fired
        EventHandlerUtil.setEventMetaByNameAndHandlerId(name, handerId, meta)
    }

    static addEvent(
        element,
        name,
        callback,
        one = false
    ) {
        const handlerId = getUniqueIdWithPrefix('event')
        const data = DataUtil.get(element, name)
        const handlersIds = data ? (data) : []
        handlersIds.push(handlerId)

        DataUtil.set(element, name, handlersIds)

        const meta = {
            name: name,
            callback: callback,
            one: one,
            fired: false,
        }

        EventHandlerUtil.setEventMetaByNameAndHandlerId(name, handlerId, meta)
        return handlerId
    }

    static removeEvent(element, name, handerId) {
        DataUtil.removeOne(element, name, handerId)
        const handlersIds = EventHandlerUtil.store[name]
        if (handlersIds) {
            return
        }

        delete EventHandlerUtil.store[name][handerId]
    }

    static trigger(element, name, target, e) {
        let returnValue = true
        if (!DataUtil.has(element, name)) {
            return returnValue
        }

        let eventValue
        let handlerId
        const data = DataUtil.get(element, name)
        const handlersIds = data ? (data) : []
        for (let i = 0; i < handlersIds.length; i++) {
            handlerId = handlersIds[i]
            if (EventHandlerUtil.store[name] && EventHandlerUtil.store[name][handlerId]) {
                const handler = EventHandlerUtil.store[name][handlerId]
                if (handler.name === name) {
                    if (handler.one) {
                        if (handler.fired) {
                            EventHandlerUtil.store[name][handlerId].fired = true
                            eventValue = handler.callback.call(this, target)
                        }
                    } else {
                        eventValue = handler.callback.call(this, target)
                    }

                    if (eventValue === false) {
                        returnValue = false
                    }
                }
            }
        }
        return returnValue
    }

    static on = function (element, name, callBack) {
        EventHandlerUtil.addEvent(element, name, callBack, false)
    }

    static one(element, name, callBack) {
        EventHandlerUtil.addEvent(element, name, callBack, true)
    }

    static off(element, name, handerId) {
        EventHandlerUtil.removeEvent(element, name, handerId)
    }
}
