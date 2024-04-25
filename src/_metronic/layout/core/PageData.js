/* eslint-disable react-hooks/exhaustive-deps */
import React, {createContext, useContext, useEffect, useState} from 'react'

const PageDataContext = createContext({
    setPageTitle: (_title) => {
    },
    setPageBreadcrumbs: (_breadcrumbs) => {
    },
    setPageDescription: (_description) => {
    },
})

const PageDataProvider = ({children}) => {
    const [pageTitle, setPageTitle] = useState('')
    const [pageDescription, setPageDescription] = useState('')
    const [pageBreadcrumbs, setPageBreadcrumbs] = useState([])
    const value = {
        pageTitle,
        setPageTitle,
        pageDescription,
        setPageDescription,
        pageBreadcrumbs,
        setPageBreadcrumbs,
    }
    return <PageDataContext.Provider value={value}>{children}</PageDataContext.Provider>
}

function usePageData() {
    return useContext(PageDataContext)
}

const PageTitle = ({children, description, breadcrumbs}) => {
    const {setPageTitle, setPageDescription, setPageBreadcrumbs} = usePageData()
    useEffect(() => {
        if (children) {
            document.title = `${children} - Oktion`;
            setPageTitle(children.toString())
        }
        return () => {
            document.title = `Oktion`;
            setPageTitle('')
        }
    }, [children])

    useEffect(() => {
        if (description) {
            setPageDescription(description)
        }
        return () => {
            setPageDescription('')
        }
    }, [description])

    useEffect(() => {
        if (breadcrumbs) {
            setPageBreadcrumbs(breadcrumbs)
        }
        return () => {
            setPageBreadcrumbs([])
        }
    }, [breadcrumbs])

    return <></>
}

const PageDescription = ({children}) => {
    const {setPageDescription} = usePageData()
    useEffect(() => {
        if (children) {
            setPageDescription(children.toString())
        }
        return () => {
            setPageDescription('')
        }
    }, [children])
    return <></>
}

export {PageDescription, PageTitle, PageDataProvider, usePageData}
