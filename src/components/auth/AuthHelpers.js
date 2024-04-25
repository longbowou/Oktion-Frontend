const AUTH_LOCAL_STORAGE_KEY = 'oktion-auth'
const getAuth = () => {
    if (!localStorage) {
        return
    }

    const lsValue = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY)
    if (!lsValue) {
        return
    }

    try {
        const auth = JSON.parse(lsValue)
        if (auth) {
            // You can easily check auth_token expiration also
            return auth
        }
    } catch (error) {
        console.error('AUTH LOCAL STORAGE PARSE ERROR', error)
    }
}

const setAuth = (auth) => {
    if (!localStorage) {
        return
    }

    try {
        const lsValue = JSON.stringify(auth)
        localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, lsValue)
    } catch (error) {
        console.error('AUTH LOCAL STORAGE SAVE ERROR', error)
    }
}

const removeAuth = () => {
    if (!localStorage) {
        return
    }

    try {
        localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY)
    } catch (error) {
        console.error('AUTH LOCAL STORAGE REMOVE ERROR', error)
    }
}

export function setupAxios(axios) {
    axios.defaults.headers.Accept = 'application/json'
    axios.interceptors.request.use(
        (config) => {
            const auth = getAuth()
            if (auth && auth.accessToken) {
                config.headers.Authorization = `Bearer ${auth.accessToken}`
            }

            return config
        },
        (err) => Promise.reject(err)
    )
}

export {getAuth, setAuth, removeAuth, AUTH_LOCAL_STORAGE_KEY}
export const setTitle = (title) => {
    document.title = `${title} - Oktion`;
}
export const initPasswordShowHide = () => {
    const elements = document.querySelectorAll("[data-kt-password-meter]");
    for (const element of elements) {
        let inputElement = element.querySelector("input[type]")
        let visibilityElement = element.querySelector('[data-kt-password-meter-control="visibility"]')

        if (visibilityElement) {
            visibilityElement.addEventListener('click', (ev) => {
                if (visibilityElement && inputElement) {
                    const visibleIcon = visibilityElement.querySelector('i:not(.d-none)')

                    const hiddenIcon = visibilityElement.querySelector('i.d-none')

                    const typeAttr = inputElement.getAttribute('type') || ''
                    console.log(typeAttr)
                    if (typeAttr === 'password') {
                        inputElement.setAttribute('type', 'text')
                    } else {
                        inputElement.setAttribute('type', 'password')
                    }

                    visibleIcon?.classList.add('d-none')
                    hiddenIcon?.classList.remove('d-none')

                    inputElement.focus()
                }
            })
        }
    }
}