import {DataUtil, EventHandlerUtil, getUniqueIdWithPrefix} from '../_utils/index'
// Helpers
import {CookieComponent} from './_CookieComponent'


const defaultToggleOptions = {
    saveState: false,
}

class ToggleComponent {
    element
    instanceUid
    options
    state = ''
    mode = ''
    target = null
    attribute = ''

    constructor(_element, options) {
        this.options = Object.assign(defaultToggleOptions, options)
        this.instanceUid = getUniqueIdWithPrefix('toggle')
        this.element = _element

        const elementTargetAttr = this.element.getAttribute('data-kt-toggle-target')
        if (elementTargetAttr) {
            this.target = document.querySelector(elementTargetAttr)
        }
        const elementToggleAttr = this.element.getAttribute('data-kt-toggle-state')
        this.state = elementToggleAttr || ''
        const elementModeAttr = this.element.getAttribute('data-kt-toggle-mode')
        this.mode = elementModeAttr || ''
        this.attribute = 'data-kt-' + this.element.getAttribute('data-kt-toggle-name')

        // Event Handlers
        this._handlers()

        // Update Instance
        // Bind Instance
        DataUtil.set(this.element, 'toggle', this)
    }

    _handlers = () => {
        this.element.addEventListener('click', (e) => {
            e.preventDefault()

            if (this.mode === '') {
                this._toggle()
                return
            }

            if (this.mode === 'off' && !this._isEnabled()) {
                this._toggle()
            } else if (this.mode === 'on' && this._isEnabled()) {
                this._toggle()
            }
        })
    }

    // Event handlers
    _toggle = () => {
        // Trigger "after.toggle" event
        EventHandlerUtil.trigger(this.element, 'kt.toggle.change')

        if (this._isEnabled()) {
            this._disable()
        } else {
            this._enable()
        }

        // Trigger "before.toggle" event
        EventHandlerUtil.trigger(this.element, 'kt.toggle.changed')
        return this
    }

    _enable = () => {
        if (this._isEnabled()) {
            return
        }

        EventHandlerUtil.trigger(this.element, 'kt.toggle.enable')
        this.target?.setAttribute(this.attribute, 'on')
        if (this.state.length > 0) {
            this.element.classList.add(this.state)
        }

        if (this.options.saveState) {
            CookieComponent.set(this.attribute, 'on', {})
        }

        EventHandlerUtil.trigger(this.element, 'kt.toggle.enabled')
        return this
    }

    _disable = () => {
        if (!this._isEnabled()) {
            return false
        }

        EventHandlerUtil.trigger(this.element, 'kt.toggle.disable')
        this.target?.removeAttribute(this.attribute)

        if (this.state.length > 0) {
            this.element.classList.remove(this.state)
        }

        if (this.options.saveState) {
            CookieComponent.delete(this.attribute)
        }

        EventHandlerUtil.trigger(this.element, 'kt.toggle.disabled')
        return this
    }

    _isEnabled = () => {
        if (!this.target) {
            return false
        }

        return String(this.target.getAttribute(this.attribute)).toLowerCase() === 'on'
    }

    ///////////////////////
    // ** Public API  ** //
    ///////////////////////

    // Plugin API
    // Plugin API
    toggle = () => {
        return this._toggle()
    }

    enable = () => {
        return this._enable()
    }

    disable = () => {
        return this._disable()
    }

    isEnabled = () => {
        return this._isEnabled()
    }

    goElement = () => {
        return this.element
    }

    // Event API
    on = (name, handler) => {
        return EventHandlerUtil.on(this.element, name, handler)
    }

    one = (name, handler) => {
        return EventHandlerUtil.one(this.element, name, handler)
    }

    off = (name, handlerId) => {
        return EventHandlerUtil.off(this.element, name, handlerId)
    }

    trigger = (name, event) => {
        return EventHandlerUtil.trigger(this.element, name, event)
    }

    // Static methods
    static getInstance = (el) => {
        const toggleElement = DataUtil.get(el, 'toggle')
        if (toggleElement) {
            return toggleElement
        }

        return null
    }

    static createInstances = (selector) => {
        const elements = document.body.querySelectorAll(selector)
        elements.forEach((el) => {
            let toggle = ToggleComponent.getInstance(el)
            if (!toggle) {
                toggle = new ToggleComponent(el, defaultToggleOptions)
            }
        })
    }

    static reinitialization = () => {
        ToggleComponent.createInstances('[data-kt-toggle]')
    }

    static bootstrap = () => {
        ToggleComponent.createInstances('[data-kt-toggle]')
    }
}

export {ToggleComponent, defaultToggleOptions}
