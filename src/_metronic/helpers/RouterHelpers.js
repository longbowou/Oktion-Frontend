export function getCurrentUrl(pathname) {
    return pathname.split(/[?#]/)[0]
}

export function checkIsActive(pathname, url) {
    const current = getCurrentUrl(pathname)
    if (!current || !url) {
        return false
    }

    if (current === url) {
        return true
    }

    if (current.indexOf(url) > -1) {
        return true
    }

    return false
}
