import React, {createContext, useContext, useEffect, useState} from 'react'
import {ThemeModeComponent} from '../../../assets/js/layout'
import {toAbsoluteUrl} from '../../../helpers'

export const themeModelSKey = 'kt_theme_mode_value'
export const themeMenuModeLSKey = 'kt_theme_mode_menu'

const systemMode = ThemeModeComponent.getSystemMode()


const themeModeSwitchHelper = (_mode) => {
    // change background image url
    const mode = _mode !== 'system' ? _mode : systemMode
    const imageUrl = '/media/patterns/header-bg' + (mode === 'light' ? '.jpg' : '-dark.png')
    document.body.style.backgroundImage = `url("${toAbsoluteUrl(imageUrl)}")`
}

const getThemeModeFromLocalStorage = (lsKey) => {
    if (!localStorage) {
        return 'light'
    }

    const data = localStorage.getItem(lsKey)
    if (data === 'dark' || data === 'light' || data === 'system') {
        return data
    }

    if (document.documentElement.hasAttribute('data-bs-theme')) {
        const dataTheme = document.documentElement.getAttribute('data-bs-theme')
        if (dataTheme && (dataTheme === 'dark' || dataTheme === 'light' || dataTheme === 'system')) {
            return dataTheme
        }
    }

    return 'system'
}

const defaultThemeMode = {
    mode: getThemeModeFromLocalStorage(themeModelSKey),
    menuMode: getThemeModeFromLocalStorage(themeMenuModeLSKey),
    updateMode: (_mode) => {
    },
    updateMenuMode: (_menuMode) => {
    },
}

const ThemeModeContext = createContext({
    mode: defaultThemeMode.mode,
    menuMode: defaultThemeMode.menuMode,
    updateMode: (_mode) => {
    },
    updateMenuMode: (_menuMode) => {
    },
})

const useThemeMode = () => useContext(ThemeModeContext)

const ThemeModeProvider = ({children}) => {
    const [mode, setMode] = useState(defaultThemeMode.mode)
    const [menuMode, setMenuMode] = useState(defaultThemeMode.menuMode)

    const updateMode = (_mode, saveInLocalStorage = true) => {
        setMode(_mode)
        // themeModeSwitchHelper(updatedMode)
        if (saveInLocalStorage && localStorage) {
            localStorage.setItem(themeModelSKey, _mode)
        }

        if (saveInLocalStorage) {
            const updatedMode = _mode === 'system' ? systemMode : _mode
            document.documentElement.setAttribute('data-bs-theme', updatedMode)
        }
        ThemeModeComponent.init()
    }

    const updateMenuMode = (_menuMode, saveInLocalStorage = true) => {
        setMenuMode(_menuMode)
        if (saveInLocalStorage && localStorage) {
            localStorage.setItem(themeMenuModeLSKey, _menuMode)
        }
    }

    useEffect(() => {
        updateMode(mode, false)
        updateMenuMode(menuMode, false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <ThemeModeContext.Provider value={{mode, menuMode, updateMode, updateMenuMode}}>
            {children}
        </ThemeModeContext.Provider>
    )
}

export {ThemeModeProvider, useThemeMode, systemMode, themeModeSwitchHelper}
