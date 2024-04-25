import {DefaultConfig} from './_LayoutConfig'

const LAYOUT_CONFIG_KEY = process.env.REACT_APP_BASE_LAYOUT_CONFIG_KEY || 'LayoutConfig'

const getLayoutFromLocalStorage = () => {
    const ls = localStorage.getItem(LAYOUT_CONFIG_KEY)
    if (ls) {
        try {
            return JSON.parse(ls)
        } catch (er) {
            console.error(er)
        }
    }
    return DefaultConfig
}

const setLayoutIntoLocalStorage = (config) => {
    try {
        localStorage.setItem(LAYOUT_CONFIG_KEY, JSON.stringify(config))
    } catch (er) {
        console.error(er)
    }
}

const getEmptyCssClasses = () => {
    return {
        header: [],
        headerContainer: [],
        headerMobile: [],
        headerMenu: [],
        aside: [],
        asideMenu: [],
        asideToggle: [],
        toolbar: [],
        toolbarContainer: [],
        content: [],
        contentContainer: [],
        footerContainer: [],
        sidebar: [],
        pageTitle: [],
        pageContainer: [],
    }
}

const getEmptyHTMLAttributes = () => {
    return {
        asideMenu: new Map(),
        headerMobile: new Map(),
        headerMenu: new Map(),
        headerContainer: new Map(),
        pageTitle: new Map(),
    }
}

const getEmptyCSSVariables = () => {
    return {
        body: new Map(),
    }
}

class LayoutSetup {
    static isLoaded = false
    static config = getLayoutFromLocalStorage()
    static classesCSSClasses = getEmptyCssClasses()
    static attributesHTMLAttributes = getEmptyHTMLAttributes()
    static cssVariablesCSSVariables = getEmptyCSSVariables()

    static initCSSClasses() {
        LayoutSetup.classes = getEmptyCssClasses()
    }

    static initHTMLAttributes() {
        LayoutSetup.attributes = Object.assign({}, getEmptyHTMLAttributes())
    }

    static initCSSVariables() {
        LayoutSetup.cssVariables = getEmptyCSSVariables()
    }

    static initConfig(config) {
        let updatedConfig = LayoutSetup.initLayoutSettings(config)
        updatedConfig = LayoutSetup.initToolbarSetting(updatedConfig)
        return LayoutSetup.initWidthSettings(updatedConfig)
    }

    static initLayoutSettings(config) {
        const updatedConfig = {...config}
        // clear body classes
        document.body.className = ''
        // clear body attributes
        const bodyAttributes = document.body.getAttributeNames().filter((t) => t.indexOf('data-') > -1)
        bodyAttributes.forEach((attr) => document.body.removeAttribute(attr))
        document.body.setAttribute('style', '')
        document.body.setAttribute('id', 'kt_app_body')
        document.body.setAttribute('data-kt-app-layout', updatedConfig.layoutType)
        document.body.classList.add('app-default')

        const pageWidth = updatedConfig.app?.general?.pageWidth
        if (updatedConfig.layoutType === 'light-header' || updatedConfig.layoutType === 'dark-header') {
            if (pageWidth === 'default') {
                const header = updatedConfig.app?.header
                if (header && header.default && header.default.container) {
                    header.default.container = 'fixed'
                }

                const toolbar = updatedConfig.app?.toolbar
                if (toolbar) {
                    toolbar.container = 'fixed'
                }

                const content = updatedConfig.app?.content
                if (content) {
                    content.container = 'fixed'
                }

                const footer = updatedConfig.app?.footer
                if (footer) {
                    footer.container = 'fixed'
                }

                const updatedApp = {
                    ...updatedConfig.app,
                    ...header,
                    ...toolbar,
                    ...content,
                    ...footer,
                }
                return {...updatedConfig, app: updatedApp}
            }
        }
        return updatedConfig
    }

    static initToolbarSetting(config) {
        const updatedConfig = {...config}
        const appHeaderDefaultContent = updatedConfig.app?.header?.default?.content
        if (appHeaderDefaultContent === 'page-title') {
            const toolbar = updatedConfig.app?.toolbar
            if (toolbar) {
                toolbar.display = false
                const updatedApp = {...updatedConfig.app, ...toolbar}
                return {...updatedConfig, app: updatedApp}
            }
            return updatedConfig
        }

        const pageTitle = updatedConfig.app?.pageTitle
        if (pageTitle) {
            pageTitle.description = false
            pageTitle.breadCrumb = true
            const updatedApp = {...updatedConfig.app, ...pageTitle}
            return {...updatedConfig, app: updatedApp}
        }

        return updatedConfig
    }

    static initWidthSettings(config) {
        const updatedConfig = {...config}
        const pageWidth = updatedConfig.app?.general?.pageWidth
        if (!pageWidth || pageWidth === 'default') {
            return config
        }

        const header = updatedConfig.app?.header
        if (header && header.default) {
            header.default.container = pageWidth
        }
        const toolbar = updatedConfig.app?.toolbar
        if (toolbar) {
            toolbar.container = pageWidth
        }
        const content = updatedConfig.app?.content
        if (content) {
            content.container = pageWidth
        }
        const footer = updatedConfig.app?.footer
        if (footer) {
            footer.container = pageWidth
        }
        const updatedApp = {
            ...updatedConfig.app,
            ...header,
            ...toolbar,
            ...content,
            ...footer,
        }
        return {...updatedConfig, app: updatedApp}
    }

    static updatePartialConfig(fieldsToUpdate) {
        const config = LayoutSetup.config
        const updatedConfig = {...config, ...fieldsToUpdate}
        LayoutSetup.initCSSClasses()
        LayoutSetup.initCSSVariables()
        LayoutSetup.initHTMLAttributes()
        LayoutSetup.isLoaded = false
        LayoutSetup.config = LayoutSetup.initConfig(Object.assign({}, updatedConfig))
        LayoutSetup.isLoaded = true // remove loading there
        return updatedConfig
    }

    static setConfig(config) {
        setLayoutIntoLocalStorage(config)
    }

    static bootstrap = (() => {
        LayoutSetup.updatePartialConfig(LayoutSetup.config)
    })()
}

export {
    LayoutSetup,
    getLayoutFromLocalStorage,
    setLayoutIntoLocalStorage,
    getEmptyCssClasses,
    getEmptyCSSVariables,
    getEmptyHTMLAttributes,
}
