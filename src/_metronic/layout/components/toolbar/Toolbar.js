import {useEffect} from 'react'
import {useLayout} from '../../core'
import {ToolbarClassic} from './toolbars'

const Toolbar = () => {
    const {config} = useLayout()
    useEffect(() => {
        updateDOM(config)
        document.body.setAttribute('data-kt-app-toolbar-enabled', 'true')
    }, [config])

    return <ToolbarClassic/>
}

const updateDOM = (config) => {
    let appToolbarSwapAttributes = {}
    const appToolbarSwapEnabled = config.app?.toolbar?.swap?.enabled
    if (appToolbarSwapEnabled) {
        appToolbarSwapAttributes = config.app?.toolbar?.swap?.attributes
    }

    let appToolbarStickyAttributes = {}
    const appToolbarStickyEnabled = config.app?.toolbar?.sticky?.enabled
    if (appToolbarStickyEnabled) {
        appToolbarStickyAttributes = config.app?.toolbar?.sticky?.attributes

        let appToolbarMinimizeAttributes = {}
        const appToolbarMinimizeEnabled = config.app?.toolbar?.minimize?.enabled
        if (appToolbarMinimizeEnabled) {
            appToolbarMinimizeAttributes = config.app?.toolbar?.minimize?.attributes
        }

        if (config.app?.toolbar?.fixed?.desktop) {
            document.body.setAttribute('data-kt-app-toolbar-fixed', 'true')
        }

        if (config.app?.toolbar?.fixed?.mobile) {
            document.body.setAttribute('data-kt-app-toolbar-fixed-mobile', 'true')
        }

        setTimeout(() => {
            const toolbarElement = document.getElementById('kt_app_toolbar')
            // toolbar
            if (toolbarElement) {
                const toolbarAttributes = toolbarElement
                    .getAttributeNames()
                    .filter((t) => t.indexOf('data-') > -1)
                toolbarAttributes.forEach((attr) => toolbarElement.removeAttribute(attr))

                if (appToolbarSwapEnabled) {
                    for (const key in appToolbarSwapAttributes) {
                        if (appToolbarSwapAttributes.hasOwnProperty(key)) {
                            toolbarElement.setAttribute(key, appToolbarSwapAttributes[key])
                        }
                    }
                }

                if (appToolbarStickyEnabled) {
                    for (const key in appToolbarStickyAttributes) {
                        if (appToolbarStickyAttributes.hasOwnProperty(key)) {
                            toolbarElement.setAttribute(key, appToolbarStickyAttributes[key])
                        }
                    }
                }

                if (appToolbarMinimizeEnabled) {
                    for (const key in appToolbarMinimizeAttributes) {
                        if (appToolbarMinimizeAttributes.hasOwnProperty(key)) {
                            toolbarElement.setAttribute(key, appToolbarMinimizeAttributes[key])
                        }
                    }
                }
            }
        }, 0)
    }
}

export {Toolbar}
