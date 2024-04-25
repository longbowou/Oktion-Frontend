import {useEffect, useRef} from 'react'
import {Tab} from 'bootstrap'
import {MenuComponent, ScrollTopComponent, StickyComponent, ToggleComponent,} from '../assets/js/components'
import {ThemeModeComponent} from '../assets/js/layout'

import {useLayout} from './core'

export function MasterInit() {
    const {config} = useLayout()
    const isFirstRun = useRef(true)
    const pluginsInitialization = () => {
        isFirstRun.current = false
        ThemeModeComponent.init()
        setTimeout(() => {
            ToggleComponent.bootstrap()
            ScrollTopComponent.bootstrap()
            StickyComponent.bootstrap()
            MenuComponent.bootstrap()
            document.querySelectorAll('[data-bs-toggle="tab"]').forEach((tab) => {
                Tab.getOrCreateInstance(tab)
            })
        }, 500)
    }

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false
            pluginsInitialization()
        }
    }, [config])

    return <></>
}
