import {useEffect} from 'react'
import {Link, Outlet} from 'react-router-dom'
import {toAbsoluteUrl} from "../../_metronic/helpers";

const AuthLayout = () => {
    useEffect(() => {
        const root = document.getElementById('root')
        if (root) {
            root.style.height = '100%'
        }
        return () => {
            if (root) {
                root.style.height = 'auto'
            }
        }
    }, [])

    return (
        <div className='d-flex flex-column flex-lg-row flex-column-fluid '>
            {/* begin::Body */}
            <div className='d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1'>
                {/* begin::Form */}
                <div className='d-flex flex-center flex-column flex-lg-row-fluid'>
                    {/* begin::Wrapper */}
                    <div className='w-lg-500px p-10'>
                        <Outlet/>
                    </div>
                    {/* end::Wrapper */}
                </div>
                {/* end::Form */}

                {/* begin::Footer */}
                <div className='d-flex flex-center flex-wrap px-5'>
                    {/* begin::Links */}
                    <div className='d-flex fw-semibold text-primary fs-base'>
                        <span className='px-5' target='_blank'>
                            <a href="https://gitlab.com/longbowou">Oktion</a>
                        </span>
                    </div>
                    {/* end::Links */}
                </div>
                {/* end::Footer */}
            </div>
            {/* end::Body */}

            {/* begin::Aside */}
            <div
                className='d-flex flex-lg-row-fluid w-lg-50 bgi-size-cover bgi-position-center order-1 order-lg-2'
                style={{backgroundImage: `url(${toAbsoluteUrl('/media/auth-bg.png')})`}}
            >
                {/* begin::Content */}
                <div className='d-flex flex-column flex-center py-15 px-5 px-md-15 w-100'>
                    {/* begin::Logo */}
                    <Link to='/' className='mb-12'>
                        <img alt='Logo' src={toAbsoluteUrl('/media/oktion.png')} style={{width: '200px'}}/>
                    </Link>
                    {/* end::Logo */}
                    {/* begin::Title */}
                    <h1 className='text-white fs-2qx fw-bolder text-center mb-7'>
                        Fast, Efficient and Productive
                    </h1>
                    {/* end::Title */}

                    {/* begin::Text */}
                    <div className='text-white fs-4 text-center'>
                        Step into a world where <span
                        className='opacity-75-hover text-warning fw-bold me-1'>excitement</span> meets opportunity with
                        our cutting-edge auction app. Unleash
                        the thrill of <span className='opacity-75-hover text-warning fw-bold me-1'>bidding</span> and
                        winning, all from the palm of your hand. Immerse yourself in a
                        marketplace filled with <span
                        className='opacity-75-hover text-warning fw-bold me-1'>treasures</span> waiting to be
                        discovered. Bid with confidence, track your
                        favorite items, and outshine the competition, all while experiencing the ultimate rush of the
                        auction world.
                        Your next prized possession is just a bid away – get ready to bid, win, and
                        conquer with our one-of-a-kind auction app !
                    </div>
                    {/* end::Text */}
                </div>
                {/* end::Content */}
            </div>
            {/* end::Aside */}
        </div>
    )
}

export {AuthLayout}
