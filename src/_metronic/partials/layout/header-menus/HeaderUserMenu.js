/* eslint-disable jsx-a11y/anchor-is-valid */
import {Link} from 'react-router-dom'
import {Languages} from './Languages'
import {useAuth} from "../../../../components/auth/AuthProvider";
import clsx from "clsx";

const HeaderUserMenu = () => {
    const {currentUser, logout} = useAuth()
    return (
        <div
            className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px'
            data-kt-menu='true'
        >
            <div className='menu-item px-3'>
                <div className='menu-content d-flex align-items-center px-3'>
                    <div className='symbol symbol-circle symbol-50px me-5'>
                        <span
                            className={clsx("symbol-label text-inverse-warning fw-bold", currentUser.roles[0].role === "SELLER" ? "bg-success" : "bg-info")}>
                            {currentUser?.name[0]}
                        </span>
                    </div>

                    <div className='d-flex flex-column'>
                        <div className='fw-bolder d-flex align-items-center fs-5'>
                            {currentUser?.name} <br/>
                        </div>
                        <a href='#' className='fw-bold text-muted text-hover-primary fs-7'>
                            {currentUser?.email}
                        </a>
                        <div>
                            <span
                                className={clsx('badge badge-lg fw-bolder fs-6 mt-2', currentUser.roles[0].role === "SELLER" ? "badge-light-success" : "badge-light-info")}>
                                {currentUser.roles[0].role.toLowerCase()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className='separator my-2'></div>

            <div className='menu-item px-5'>
                <Link to={'/coming-soon'} className='menu-link px-5'>
                    My Profile
                </Link>
            </div>

            <div className='separator my-2'></div>

            <Languages/>

            <div className='menu-item px-5 my-1'>
                <Link to='/coming-soon' className='menu-link px-5'>
                    Account Settings
                </Link>
            </div>

            <div className='menu-item px-5'>
                <a onClick={logout} className='menu-link px-5'>
                    Sign Out
                </a>
            </div>
        </div>
    )
}

export {HeaderUserMenu}
