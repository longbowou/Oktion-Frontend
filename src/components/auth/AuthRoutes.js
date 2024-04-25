import {Route, Routes} from 'react-router-dom'
import {Registration} from './Registration'
import {Login} from './Login'
import {AuthLayout} from './AuthLayout'

const AuthRoutes = () => (
    <Routes>
        <Route element={<AuthLayout/>}>
            <Route path='login' element={<Login/>}/>
            <Route path='registration' element={<Registration/>}/>
            <Route index element={<Login/>}/>
        </Route>
    </Routes>
)

export {AuthRoutes}
