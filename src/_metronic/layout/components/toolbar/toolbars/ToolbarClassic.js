/* eslint-disable jsx-a11y/anchor-is-valid */
import {useAuth} from "../../../../../components/auth/AuthProvider";
import clsx from "clsx";

const ToolbarClassic = () => {
    const {currentUser} = useAuth()

    return (
        <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <span
                className={clsx('badge badge-lg fw-bolder fs-3 mt-2', currentUser.roles[0].role === "SELLER" ? "badge-light-success" : "badge-light-info")}>
                You are a {currentUser.roles[0].role.toLowerCase()}
            </span>
        </div>
    )
}

export {ToolbarClassic}
