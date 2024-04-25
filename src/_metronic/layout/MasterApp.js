import {Outlet} from 'react-router-dom'
import {MasterInit} from "./MasterInit";
import {ThemeModeProvider} from "../partials";
import {AuthInit} from "../../components/auth/AuthProvider";
import {Suspense} from "react";
import {LayoutProvider, LayoutSplashScreen} from "./core";

const MasterApp = () => {
    return (
        <Suspense fallback={<LayoutSplashScreen/>}>
            <LayoutProvider>
                <ThemeModeProvider>
                    <AuthInit>
                        <Outlet/>
                        <MasterInit/>
                    </AuthInit>
                </ThemeModeProvider>
            </LayoutProvider>
        </Suspense>
    )
}

export {MasterApp}
