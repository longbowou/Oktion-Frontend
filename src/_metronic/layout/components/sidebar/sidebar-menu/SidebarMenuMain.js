/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import {SidebarMenuItem} from './SidebarMenuItem'

const SidebarMenuMain = () => {
    return (
        <>
            <SidebarMenuItem
                to='/dashboard'
                icon='element-11'
                title="Dashboard"
            />
            <SidebarMenuItem to='/products' icon='crown' title='Products'/>
        </>
    )
}

export {SidebarMenuMain}
