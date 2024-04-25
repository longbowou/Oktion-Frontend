import React from 'react'
import SVG from 'react-inlinesvg'
import {toAbsoluteUrl} from '../AssetHelpers'

const KTSVG = ({className = '', path, svgClassName = 'mh-50px'}) => {
    return (
        <span className={`svg-icon ${className}`}>
      <SVG src={toAbsoluteUrl(path)} className={svgClassName}/>
    </span>
    )
}

export {KTSVG}
