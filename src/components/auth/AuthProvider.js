import {createContext, useContext, useEffect, useRef, useState,} from 'react'
import * as authHelper from './AuthHelpers'
import {LayoutSplashScreen} from "../../_metronic/layout/core";

const initAuthContextPropsState = {
    auth: authHelper.getAuth(),
    saveAuth: () => {
    },
    currentUser: undefined,
    setCurrentUser: () => {
    },
    logout: () => {
    },
}

const AuthContext = createContext(initAuthContextPropsState)

const useAuth = () => {
    return useContext(AuthContext)
}

export function useSuccessMessage() {
    return useContext(AuthContext);
}

const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState(authHelper.getAuth())
    const [currentUser, setCurrentUser] = useState()
    const [messageSuccess, setSuccessMessage] = useState(null);

    const saveAuth = (auth) => {
        setAuth(auth)
        if (auth) {
            authHelper.setAuth(auth)
        } else {
            authHelper.removeAuth()
        }
    }

    const logout = () => {
        saveAuth(undefined)
        setCurrentUser(undefined)
    }

    return (
        <AuthContext.Provider value={{auth, saveAuth, currentUser, setCurrentUser, logout, messageSuccess, setSuccessMessage}}>
            {children}
        </AuthContext.Provider>
    )
}

const AuthInit = ({children}) => {
    const {auth, logout, setCurrentUser} = useAuth()
    const didRequest = useRef(false)
    const [showSplashScreen, setShowSplashScreen] = useState(true)
    // We should request user by authToken (IN OUR EXAMPLE IT'S API_TOKEN) before rendering the application
    useEffect(() => {
        const requestUser = async (apiToken) => {
            try {
                if (auth) {
                    setCurrentUser(auth)
                }
            } catch (error) {
                console.error(error)
                logout()
            } finally {
                setShowSplashScreen(false)
            }

            return () => (didRequest.current = true)
        }

        if (auth && auth.accessToken) {
            requestUser(auth.accessToken)
        } else {
            logout()
            setShowSplashScreen(false)
        }
        // eslint-disable-next-line
    }, [])

    return showSplashScreen ? <LayoutSplashScreen/> : <>{children}</>
}

export {AuthProvider, AuthInit, useAuth}
