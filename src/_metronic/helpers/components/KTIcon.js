import React from 'react'
import icons from '../icons-config/icons'
import {getLayoutFromLocalStorage} from '../../layout/core'

const KTIcon = ({className = '', iconType, iconName}) => {
    if (!iconType) {
        iconType = getLayoutFromLocalStorage().main?.iconType
    }

    return (
        <i className={`ki-${iconType} ki-${iconName}${className && ' ' + className}`}>
            {iconType === 'duotone' &&
                [...Array(icons[iconName])].map((e, i) => {
                    return (
                        <span
                            key={`${iconType}-${iconName}-${className}-path-${i + 1}`}
                            className={`path${i + 1}`}
                        ></span>
                    )
                })}
        </i>
    )
}

export {KTIcon}
