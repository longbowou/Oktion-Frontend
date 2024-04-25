export class DataUtil {
    static store = new Map()

    static set(instance, key, data) {
        if (!instance) {
            return
        }

        const instanceData = DataUtil.store.get(instance)
        if (!instanceData) {
            const newMap = new Map().set(key, data)
            DataUtil.store.set(instance, newMap)
            return
        }

        instanceData.set(key, data)
    }

    static get(instance, key) {
        const instanceData = DataUtil.store.get(instance)
        if (!instanceData) {
            return
        }

        return instanceData.get(key)
    }

    static remove(instance, key) {
        const instanceData = DataUtil.store.get(instance)
        if (!instanceData) {
            return
        }

        instanceData.delete(key)
    }

    static removeOne(instance, key, eventId) {
        const instanceData = DataUtil.store.get(instance)
        if (!instanceData) {
            return
        }

        const eventsIds = instanceData.get(key)
        if (!eventsIds) {
            return
        }

        const updateEventsIds = (eventsIds).filter((f) => f !== eventId)
        DataUtil.set(instance, key, updateEventsIds)
    }

    static has(instance, key) {
        const instanceData = DataUtil.store.get(instance)
        if (instanceData) {
            return instanceData.has(key)
        }

        return false
    }

    static getAllInstancesByKey(key) {
        const result = []
        DataUtil.store.forEach((val) => {
            val.forEach((v, k) => {
                if (k === key) {
                    result.push(v)
                }
            })
        })
        return result
    }
}
