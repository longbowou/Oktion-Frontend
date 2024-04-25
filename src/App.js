import './App.css';
import './App.scss';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import {ErrorsPage} from "./components/errors/ErrorsPage";
import {Logout} from "./components/auth/Logout";
import {AuthRoutes} from "./components/auth/AuthRoutes";
import {SellerRoutes} from "./components/seller/SellerRoutes";
import {MasterApp} from "./_metronic/layout/MasterApp";
import {ComingSoon} from "./components/ComingSoon";
import {CustomerRoutes} from "./components/customer/CustomerRoutes";
import {useAuth} from "./components/auth/AuthProvider";

function App() {
    const {currentUser} = useAuth();

    function isSeller() {
        return currentUser.roles.find((r) => r.role === "SELLER") != null
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MasterApp/>}>
                    <Route path='error/*' element={<ErrorsPage/>}/>
                    <Route path='logout' element={<Logout/>}/>
                    <Route path='coming-soon' element={<ComingSoon/>}/>
                    {currentUser ? (
                            (isSeller() ?
                                    <>
                                        <Route path='/*' element={<SellerRoutes/>}/>
                                        <Route index element={<Navigate to='/dashboard'/>}/>
                                    </> :
                                    <>
                                        <Route path='/*' element={<CustomerRoutes/>}/>
                                        <Route index element={<Navigate to='/dashboard'/>}/>
                                    </>
                            )) :
                        (
                            <>
                                <Route path='auth/*' element={<AuthRoutes/>}/>
                                <Route path='*' element={<Navigate to='/auth'/>}/>
                            </>
                        )}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
