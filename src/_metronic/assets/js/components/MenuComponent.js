import {createPopper} from '@popperjs/core'
import {
    DataUtil,
    DOMEventHandlerUtil,
    ElementStyleUtil,
    EventHandlerUtil,
    getAttributeValueByBreakpoint,
    getElementChild,
    getElementParents,
    getHighestZindex,
    getUniqueIdWithPrefix,
    insertAfterElement,
    slideDown,
    slideUp,
    throttle,
} from '../_utils/index'


const defaultMenuOptions = {
    dropdown: {
        hoverTimeout: 200,
        zindex: 105,
    },
    accordion: {
        slideSpeed: 250,
        expand: false,
    },
}

class MenuComponent {
    element
    options
    instanceUid
    triggerElement = null

    constructor(_element, options) {
        this.element = _element
        this.options = Object.assign(defaultMenuOptions, options)
        this.instanceUid = getUniqueIdWithPrefix('menu')
        // this.element.setAttribute('data-kt-menu', 'true')
        this._setTriggerElement()
        this._update()
        DataUtil.set(this.element, 'menu', this)
        return this
    }

    // Set external trigger element
    _setTriggerElement = () => {
        const target = document.querySelector(
            `[data-kt-menu-target="#${this.element.getAttribute('id')}"`
        )

        if (target) {
            this.triggerElement = target
        } else if (this.element.closest('[data-kt-menu-trigger]')) {
            this.triggerElement = this.element.closest('[data-kt-menu-trigger]')
        } else if (
            this.element.parentNode &&
            getElementChild(this.element.parentNode, '[data-kt-menu-trigger]')
        ) {
            const child = getElementChild(
                this.element.parentNode,
                '[data-kt-menu-trigger]'
            )
            if (child) {
                this.triggerElement = child
            }
        }

        if (this.triggerElement) {
            DataUtil.set(this.triggerElement, 'menu', this)
        }
    }

    // Test if menu has external trigger element
    _isTriggerElement = (item) => {
        return this.triggerElement === item
    }

    // Get item option(through html attributes)
    _getItemOption = (item, name) => {
        let value = null
        if (item && item.hasAttribute('data-kt-menu-' + name)) {
            const attr = item.getAttribute('data-kt-menu-' + name) || ''
            value = getAttributeValueByBreakpoint(attr)
            if (value !== null && String(value) === 'true') {
                value = true
            } else if (value !== null && String(value) === 'false') {
                value = false
            }
        }
        return value
    }

    // Get item element
    _getItemElement = (_element) => {
        // Element is the external trigger element
        if (this._isTriggerElement(_element)) {
            return _element
        }

        // Element has item toggler attribute
        if (_element.hasAttribute('data-kt-menu-trigger')) {
            return _element
        }

        // Element has item DOM reference in it's data storage
        const itemElement = DataUtil.get(_element, 'item')
        if (itemElement) {
            return itemElement
        }

        // Item is parent of element
        const item = _element.closest('.menu-item[data-kt-menu-trigger]')
        if (item) {
            return item
        }

        // Element's parent has item DOM reference in it's data storage
        const sub = _element.closest('.menu-sub')
        if (sub) {
            const subItem = DataUtil.get(sub, 'item')
            if (subItem) {
                return subItem
            }
        }
    }

    // Get item parent element
    _getItemParentElement = (item) => {
        const sub = item.closest('.menu-sub')
        if (!sub) {
            return null
        }

        const subItem = DataUtil.get(sub, 'item')
        if (subItem) {
            return subItem
        }

        const parentItem = sub.closest('.menu-item[data-kt-menu-trigger]')
        if (sub && parentItem) {
            return parentItem
        }

        return null
    }

    // Get item parent elements
    _getItemParentElements = (item) => {
        const parents = []
        let parent
        let i = 0
        let buffer = item

        do {
            parent = this._getItemParentElement(buffer)
            if (parent) {
                parents.push(parent)
                buffer = parent
            }

            i++
        } while (parent !== null && i < 20)

        if (this.triggerElement) {
            parents.unshift(this.triggerElement)
        }

        return parents
    }

    // Prepare popper config for dropdown(see: https://popper.js.org/docs/v2/)
    _getDropdownPopperConfig = (item) => {
        // Placement
        const placementOption = this._getItemOption(item, 'placement')
        let placement = 'right'
        if (placementOption) {
            placement = placementOption
        }

        // Flip
        // const flipValue = this._getItemOption(item, 'flip')
        // const flip = flipValue ? flipValue.toString().split(',') : []

        // Offset
        const offsetValue = this._getItemOption(item, 'offset')
        const offset = offsetValue ? offsetValue.toString().split(',') : []

        // Strategy
        const strategy =
            this._getItemOption(item, 'overflow') === true ? 'absolute' : 'fixed'

        return {
            placement: placement,
            strategy: strategy,
            modifiers: [
                {
                    name: 'offset',
                    options: {
                        offset: offset,
                    },
                },
                {
                    name: 'preventOverflow',
                },
                {
                    name: 'flip',
                    options: {
                        // altBoundary: true,
                        // fallbackPlacements: flip,
                        flipVariations: false,
                    },
                },
            ],
        }
    }

    // Get item child element
    _getItemChildElement = (item) => {
        let selector = item

        const subItem = DataUtil.get(item, 'sub')
        if (subItem) {
            selector = subItem
        }

        if (selector) {
            //element = selector.querySelector('.show.menu-item[data-kt-menu-trigger]');
            const element = selector.querySelector('.menu-item[data-kt-menu-trigger]')
            if (element) {
                return element
            }
        }
        return null
    }

    // Get item child elements
    _getItemChildElements = (item) => {
        const children = []
        let child
        let i = 0
        let buffer = item
        do {
            child = this._getItemChildElement(buffer)
            if (child) {
                children.push(child)
                buffer = child
            }

            i++
        } while (child !== null && i < 20)

        return children
    }

    // Get item sub element
    _getItemSubElement = (item) => {
        if (!item) {
            return null
        }

        if (this._isTriggerElement(item)) {
            return this.element
        }

        if (item.classList.contains('menu-sub')) {
            return item
        } else if (DataUtil.has(item, 'sub')) {
            const itemSub = DataUtil.get(item, 'sub')
            return itemSub ? (itemSub) : null
        } else {
            return getElementChild(item, '.menu-sub')
        }
    }

    _getCss = (el, styleProp) => {
        const defaultView = (el.ownerDocument || document).defaultView
        if (!defaultView) {
            return ''
        }

        // sanitize property name to css notation
        // (hyphen separated words eg. font-Size)
        styleProp = styleProp.replace(/([A-Z])/g, '-$1').toLowerCase()

        return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp)
    }

    // Get item sub type
    _getItemSubType = (element) => {
        const sub = this._getItemSubElement(element)
        if (sub && parseInt(this._getCss(sub, 'z-index')) > 0) {
            return 'dropdown'
        } else {
            return 'accordion'
        }
    }

    // Test if item's sub is shown
    _isItemSubShown = (item) => {
        let sub = this._getItemSubElement(item)
        if (sub) {
            if (this._getItemSubType(item) === 'dropdown') {
                const subHTMLElement = sub
                return (
                    subHTMLElement.classList.contains('show') &&
                    subHTMLElement.hasAttribute('data-popper-placement')
                )
            } else {
                return item.classList.contains('show')
            }
        }

        return false
    }

    // Test if item dropdown is permanent
    _isItemDropdownPermanent = (item) => {
        return this._getItemOption(item, 'permanent') === true
    }

    // Test if item's parent is shown
    _isItemParentShown = (item) => {
        return getElementParents(item, '.menu-item.show').length > 0
    }

    // Test of it is item sub element
    _isItemSubElement = (item) => {
        return item.classList.contains('menu-sub')
    }

    // Test if item has sub
    _hasItemSub = (item) => {
        return item.classList.contains('menu-item') && item.hasAttribute('data-kt-menu-trigger')
    }

    // Get link element
    _getItemLinkElement = (item) => {
        return getElementChild(item, '.menu-link')
    }

    // Get toggle element
    _getItemToggleElement = (item) => {
        if (this.triggerElement) {
            return this.triggerElement
        }

        return this._getItemLinkElement(item)
    }

    // Show item dropdown
    _showDropdown = (item) => {
        if (EventHandlerUtil.trigger(this.element, 'kt.menu.dropdown.show') === false) {
            return
        }

        // Hide all currently shown dropdowns except current one
        MenuComponent.hideDropdowns(item)

        // const toggle = this._isTriggerElement(item) ? item : this._getItemLinkElement(item);
        const sub = this._getItemSubElement(item)
        const width = this._getItemOption(item, 'width')
        const height = this._getItemOption(item, 'height')

        let zindex = this.options.dropdown.zindex
        const parentZindex = getHighestZindex(item) // update
        // Apply a new z-index if dropdown's toggle element or it's parent has greater z-index // update
        if (parentZindex !== null && parentZindex >= zindex) {
            zindex = parentZindex + 1
        }

        if (zindex && sub) {
            ElementStyleUtil.set(sub, 'z-index', zindex)
        }

        if (width && sub) {
            ElementStyleUtil.set(sub, 'width', width)
        }

        if (height && sub) {
            ElementStyleUtil.set(sub, 'height', height)
        }

        this.initDropdownPopper(item, sub)

        item.classList.add('show')
        item.classList.add('menu-dropdown')
        sub?.classList.add('show')

        // Append the sub the the root of the menu
        if (this._getItemOption(item, 'overflow') === true) {
            if (sub) {
                document.body.appendChild(sub)
                DataUtil.set(item, 'sub', sub)
                DataUtil.set(sub, 'item', item)
                DataUtil.set(sub, 'menu', this)
            }
        } else {
            if (sub) {
                DataUtil.set(sub, 'item', item)
            }
        }

        EventHandlerUtil.trigger(this.element, 'kt.menu.dropdown.shown')
    }

    // Init dropdown popper(new)
    initDropdownPopper = (item, sub) => {
        // Setup popper instance
        let reference
        const attach = this._getItemOption(item, 'attach')

        if (attach) {
            if (attach === 'parent') {
                reference = item.parentNode
            } else {
                reference = document.querySelector(attach)
            }
        } else {
            reference = item
        }

        if (reference) {
            const popper = createPopper(
                reference,
                sub,
                this._getDropdownPopperConfig(item)
            )
            DataUtil.set(item, 'popper', popper)
        }
    }

    // Hide item dropdown
    _hideDropdown = (item) => {
        if (EventHandlerUtil.trigger(this.element, 'kt.menu.dropdown.hide') === false) {
            return
        }

        const sub = this._getItemSubElement(item)
        if (sub) {
            ElementStyleUtil.set(sub, 'z-index', '')
            ElementStyleUtil.set(sub, 'width', '')
            ElementStyleUtil.set(sub, 'height', '')
        }

        item.classList.remove('show')
        item.classList.remove('menu-dropdown')
        if (sub) {
            sub.classList.remove('show')
        }

        // Append the sub back to it's parent
        if (this._getItemOption(item, 'overflow') === true) {
            if (item.classList.contains('menu-item')) {
                if (sub) {
                    item.appendChild(sub)
                }
            } else {
                insertAfterElement(this.element, item)
            }

            if (sub) {
                DataUtil.remove(item, 'sub')
                DataUtil.remove(sub, 'item')
                DataUtil.remove(sub, 'menu')
            }
        }

        if (DataUtil.has(item, 'popper') === true) {
            // @ts-ignore
            DataUtil.get(item, 'popper').destroy()
            DataUtil.remove(item, 'popper')
        }

        // Destroy popper(new)
        this.destroyDropdownPopper(item)
        EventHandlerUtil.trigger(this.element, 'kt.menu.dropdown.hidden')
    }

    // Destroy dropdown popper(new)
    destroyDropdownPopper = (item) => {
        if (DataUtil.has(item, 'popper') === true) {
            // @ts-ignore
            DataUtil.get(item, 'popper').destroy()
            DataUtil.remove(item, 'popper')
        }

        EventHandlerUtil.trigger(this.element, 'kt.menu.dropdown.hidden')
    }

    _showAccordion = (item) => {
        if (EventHandlerUtil.trigger(this.element, 'kt.menu.accordion.show') === false) {
            return
        }

        if (this.options.accordion.expand === false) {
            this._hideAccordions(item)
        }

        if (DataUtil.has(item, 'popper') === true) {
            this._hideDropdown(item)
        }

        item.classList.add('hover') // updateWW
        item.classList.add('showing')

        const subElement = this._getItemSubElement(item)
        if (subElement) {
            const sub = subElement
            slideDown(sub, this.options.accordion.slideSpeed, () => {
                item.classList.remove('showing')
                item.classList.add('show')
                sub.classList.add('show')
                EventHandlerUtil.trigger(this.element, 'kt.menu.accordion.shown')
            })
        }
    }

    _hideAccordion = (item) => {
        if (EventHandlerUtil.trigger(this.element, 'kt.menu.accordion.hide') === false) {
            return
        }

        const sub = this._getItemSubElement(item)
        item.classList.add('hiding')

        if (sub) {
            slideUp(sub, this.options.accordion.slideSpeed, () => {
                item.classList.remove('hiding')
                item.classList.remove('show')
                sub.classList.remove('show')
                item.classList.remove('hover') // update
                EventHandlerUtil.trigger(this.element, 'kt.menu.accordion.hidden')
            })
        }
    }

    // Hide all shown accordions of item
    _hideAccordions = (item) => {
        const itemsToHide = this.element.querySelectorAll('.show[data-kt-menu-trigger]')
        if (itemsToHide && itemsToHide.length > 0) {
            for (var i = 0, len = itemsToHide.length; i < len; i++) {
                const itemToHide = itemsToHide[i]

                if (
                    this._getItemSubType(itemToHide) === 'accordion' &&
                    itemToHide !== item &&
                    item.contains(itemToHide) === false &&
                    itemToHide.contains(item) === false
                ) {
                    this._hideAccordion(itemToHide)
                }
            }
        }
    }

    // Event Handlers
    // Reset item state classes if item sub type changed
    _reset = (item) => {
        if (this._hasItemSub(item) === false) {
            return
        }

        const sub = this._getItemSubElement(item)

        // Reset sub state if sub type is changed during the window resize
        if (DataUtil.has(item, 'type') && DataUtil.get(item, 'type') !== this._getItemSubType(item)) {
            // updated
            item.classList.remove('hover')
            item.classList.remove('show')
            item.classList.remove('show')
            if (sub) {
                sub.classList.remove('show')
            }
        } // updated
    }

    // TODO: not done
    _destroy = () => {
    }

    // Update all item state classes if item sub type changed
    _update = () => {
        const items = this.element.querySelectorAll('.menu-item[data-kt-menu-trigger]')
        items.forEach((el) => this._reset(el))
    }

    // Hide item sub
    _hide = (item) => {
        if (!item) {
            return
        }

        if (this._isItemSubShown(item) === false) {
            return
        }

        if (this._getItemSubType(item) === 'dropdown') {
            this._hideDropdown(item)
        } else if (this._getItemSubType(item) === 'accordion') {
            this._hideAccordion(item)
        }
    }

    // Show item sub
    _show = (item) => {
        if (!item) {
            return
        }

        if (this._isItemSubShown(item) === true) {
            return
        }

        if (this._getItemSubType(item) === 'dropdown') {
            this._showDropdown(item) // // show current dropdown
        } else if (this._getItemSubType(item) === 'accordion') {
            this._showAccordion(item)
        }

        // Remember last submenu type

        DataUtil.set(item, 'type', this._getItemSubType(item)) // updated
    }

    // Toggle item sub
    _toggle = (item) => {
        if (!item) {
            return
        }

        if (this._isItemSubShown(item) === true) {
            this._hide(item)
        } else {
            this._show(item)
        }
    }

    // Mouseout handle
    _mouseout = (element, e) => {
        const item = this._getItemElement(element)
        if (!item) {
            return
        }

        if (this._getItemOption(item, 'trigger') !== 'hover') {
            return
        }

        const timeout = setTimeout(() => {
            if (DataUtil.get(item, 'hover') === '1') {
                this._hide(item)
            }
        }, this.options.dropdown.hoverTimeout)

        DataUtil.set(item, 'hover', '1')
        DataUtil.set(item, 'timeout', timeout)
    }

    // Mouseover handle
    _mouseover = (element, e) => {
        const item = this._getItemElement(element)
        if (!item) {
            return
        }

        if (this._getItemOption(item, 'trigger') !== 'hover') {
            return
        }

        if (DataUtil.get(item, 'hover') === '1') {
            const timeout = DataUtil.get(item, 'timeout')
            if (timeout) {
                clearTimeout(timeout)
            }
            DataUtil.remove(item, 'hover')
            DataUtil.remove(item, 'timeout')
        }

        this._show(item)
    }

    // Dismiss handler
    _dismiss = (element, e) => {
        const item = this._getItemElement(element)
        if (!item) {
            return
        }
        const items = this._getItemChildElements(item)
        //if ( item !== null && _getItemOption(item, 'trigger') === 'click' &&  _getItemSubType(item) === 'dropdown' ) {
        const itemSubType = this._getItemSubType(item)
        if (item !== null && itemSubType === 'dropdown') {
            this._hide(item) // hide items dropdown

            // Hide all child elements as well
            if (items.length > 0) {
                for (let i = 0, len = items.length; i < len; i++) {
                    //if ( _getItemOption(item, 'trigger') === 'click' &&  _getItemSubType(item) === 'dropdown' ) {
                    if (items[i] !== null && this._getItemSubType(items[i]) === 'dropdown') {
                        this._hide(items[i])
                    }
                }
            }
        }
    }

    // Link handler
    _link = (element, e) => {
        if (EventHandlerUtil.trigger(this.element, 'kt.menu.link.click') === false) {
            return
        }

        // Dismiss all shown dropdowns
        MenuComponent.hideDropdowns(undefined)
        EventHandlerUtil.trigger(this.element, 'kt.menu.link.clicked')
    }

    _click = (element, e) => {
        e.preventDefault()
        const item = this._getItemElement(element)
        if (item) {
            if (this._getItemOption(item, 'trigger') !== 'click') {
                return
            }

            if (this._getItemOption(item, 'toggle') === false) {
                this._show(item)
            } else {
                this._toggle(item)
            }
        }
    }

    ///////////////////////
    // ** Public API  ** //
    ///////////////////////
    click = (element, e) => {
        return this._click(element, e)
    }

    link = (element, e) => {
        return this._link(element, e)
    }

    dismiss = (element, e) => {
        return this._dismiss(element, e)
    }

    mouseover = (element, e) => {
        return this._mouseover(element, e)
    }

    mouseout = (element, e) => {
        return this._mouseout(element, e)
    }

    // General Methods
    getItemTriggerType = (item) => {
        return this._getItemOption(item, 'trigger')
    }

    getItemSubType = (element) => {
        return this._getItemSubType(element)
    }

    show = (item) => {
        return this._show(item)
    }

    hide = (item) => {
        return this._hide(item)
    }

    reset = (item) => {
        return this._reset(item)
    }

    update = () => {
        return this._update()
    }

    getElement = () => {
        return this.element
    }

    getItemLinkElement = (item) => {
        return this._getItemLinkElement(item)
    }

    getItemToggleElement = (item) => {
        return this._getItemToggleElement(item)
    }

    getItemSubElement = (item) => {
        return this._getItemSubElement(item)
    }

    getItemParentElements = (item) => {
        return this._getItemParentElements(item)
    }

    isItemSubShown = (item) => {
        return this._isItemSubShown(item)
    }

    isItemParentShown = (item) => {
        return this._isItemParentShown(item)
    }

    getTriggerElement = () => {
        return this.triggerElement
    }

    isItemDropdownPermanent = (item) => {
        return this._isItemDropdownPermanent(item)
    }

    // Accordion Mode Methods
    hideAccordions = (item) => {
        return this._hideAccordions(item)
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

    //  static methods
    // Get KTMenu instance by element
    static getInstance = (element) => {
        // Element has menu DOM reference in it's DATA storage
        const elementMenu = DataUtil.get(element, 'menu')
        if (elementMenu) {
            return elementMenu
        }

        // Element has .menu parent
        const menu = element.closest('.menu')
        if (menu) {
            const menuData = DataUtil.get(menu, 'menu')
            if (menuData) {
                return menuData
            }
        }

        // Element has a parent with DOM reference to .menu in it's DATA storage
        if (element.classList.contains('menu-link')) {
            const sub = element.closest('.menu-sub')
            if (sub) {
                const subMenu = DataUtil.get(sub, 'menu')
                if (subMenu) {
                    return subMenu
                }
            }
        }

        return null
    }

    // Hide all dropdowns and skip one if provided
    static hideDropdowns = (skip) => {
        const items = document.querySelectorAll(
            '.show.menu-dropdown[data-kt-menu-trigger]'
        )

        if (items && items.length > 0) {
            for (let i = 0, len = items.length; i < len; i++) {
                const item = items[i]
                const menu = MenuComponent.getInstance(item)

                if (menu && menu.getItemSubType(item) === 'dropdown') {
                    if (skip) {
                        if (
                            // @ts-ignore
                            menu.getItemSubElement(item).contains(skip) === false &&
                            item.contains(skip) === false &&
                            item !== skip
                        ) {
                            menu.hide(item)
                        }
                    } else {
                        menu.hide(item)
                    }
                }
            }
        }
    }

    static updateDropdowns = () => {
        const items = document.querySelectorAll('.show.menu-dropdown[data-kt-menu-trigger]')
        if (items && items.length > 0) {
            for (var i = 0, len = items.length; i < len; i++) {
                var item = items[i]

                if (DataUtil.has(item, 'popper')) {
                    // @ts-ignore
                    DataUtil.get(item, 'popper').forceUpdate()
                }
            }
        }
    }

    // Global handlers
    static createInstances = (selector) => {
        // Initialize menus
        document.querySelectorAll(selector).forEach((el) => {
            const menuItem = el
            let menuInstance = MenuComponent.getInstance(menuItem)
            if (!menuInstance) {
                menuInstance = new MenuComponent(el, defaultMenuOptions)
            }
        })
    }

    static initGlobalHandlers = () => {
        // Dropdown handler
        document.addEventListener('click', (e) => {
            var menuItems = document.querySelectorAll(
                '.show.menu-dropdown[data-kt-menu-trigger]:not([data-kt-menu-static="true"])'
            )
            if (menuItems && menuItems.length > 0) {
                for (let i = 0; i < menuItems.length; i++) {
                    const item = menuItems[i]
                    const menuObj = MenuComponent.getInstance(item)
                    if (menuObj && menuObj.getItemSubType(item) === 'dropdown') {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const menu = menuObj.getElement()
                        const sub = menuObj.getItemSubElement(item)
                        if (item === e.target || item.contains(e.target)) {
                            continue
                        }

                        if (sub && (sub === e.target || sub.contains(e.target))) {
                            continue
                        }
                        menuObj.hide(item)
                    }
                }
            }
        })

        // Sub toggle handler
        DOMEventHandlerUtil.on(
            document.body,
            '.menu-item[data-kt-menu-trigger] > .menu-link, [data-kt-menu-trigger]:not(.menu-item):not([data-kt-menu-trigger="auto"])',
            'click',
            function (target, e) {
                const menu = MenuComponent.getInstance(target)
                if (menu) {
                    return menu.click(target, e)
                }
            }
        )

        // // Link handler
        DOMEventHandlerUtil.on(
            document.body,
            '.menu-item:not([data-kt-menu-trigger]) > .menu-link',
            'click',
            function (target, e) {
                e.stopPropagation()
                const menu = MenuComponent.getInstance(target)
                if (menu && menu.link) {
                    return menu.link(target, e)
                }
            }
        )

        // Dismiss handler
        DOMEventHandlerUtil.on(
            document.body,
            '[data-kt-menu-dismiss="true"]',
            'click',
            function (target, e) {
                const menu = MenuComponent.getInstance(target)
                if (menu) {
                    return menu.dismiss(target, e)
                }
            }
        )

        // Mouseover handler
        DOMEventHandlerUtil.on(
            document.body,
            '[data-kt-menu-trigger], .menu-sub',
            'mouseover',
            function (target, e) {
                const menu = MenuComponent.getInstance(target)
                if (menu && menu.getItemSubType(target) === 'dropdown') {
                    return menu.mouseover(target, e)
                }
            }
        )

        // Mouseout handler
        DOMEventHandlerUtil.on(
            document.body,
            '[data-kt-menu-trigger], .menu-sub',
            'mouseout',
            function (target, e) {
                const menu = MenuComponent.getInstance(target)
                if (menu && menu.getItemSubType(target) === 'dropdown') {
                    return menu.mouseout(target, e)
                }
            }
        )

        // Resize handler
        window.addEventListener('resize', () => {
            let timer
            throttle(
                timer,
                () => {
                    // Locate and update Drawer instances on window resize
                    const elements = document.querySelectorAll('[data-kt-menu="true"]')
                    elements.forEach((el) => {
                        const menu = MenuComponent.getInstance(el)
                        if (menu) {
                            menu.update()
                        }
                    })
                },
                200
            )
        })
    }

    static bootstrap = () => {
        MenuComponent.initGlobalHandlers()
        MenuComponent.createInstances('[data-kt-menu="true"]')
    }

    static reinitialization = () => {
        MenuComponent.createInstances('[data-kt-menu="true"]')
    }

    static createInstance = (
        selector,
        options = defaultMenuOptions
    ) => {
        const element = document.body.querySelector(selector)
        if (!element) {
            return
        }
        const item = element
        let menu = MenuComponent.getInstance(item)
        if (!menu) {
            menu = new MenuComponent(item, options)
        }
        return menu
    }
}

export {MenuComponent, defaultMenuOptions}
