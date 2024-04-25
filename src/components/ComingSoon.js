import {toAbsoluteUrl} from "../_metronic/helpers";
import {useNavigate} from "react-router-dom";

const ComingSoon = () => {
    const navigate = useNavigate();
    return (
        <div className='d-flex flex-column flex-root'>
            <div className='d-flex flex-column flex-center flex-column-fluid'>
                <div className='d-flex flex-column flex-center text-center p-10'>
                    <div className='card card-flush  w-lg-650px py-5'>
                        <div className='card-body py-15 py-lg-20'>
                            {/* begin::Title */}
                            <h1 className='fw-bolder fs-2qx text-gray-900 mb-4'>Exciting features are on the horizon
                                !</h1>
                            {/* end::Title */}

                            {/* begin::Text */}
                            <div className='fw-semibold fs-6 text-gray-500 mb-7'>
                                Stay tuned for updates and be among the first to experience this next feature !
                            </div>
                            {/* end::Text */}

                            {/* begin::Illustration */}
                            <div className='mb-11'>
                                <img
                                    src={toAbsoluteUrl('/media/coming_soon.svg')}
                                    className='mw-100 mh-300px'
                                    alt=''
                                />
                            </div>
                            {/* end::Illustration */}

                            {/* begin::Link */}
                            <div className='mb-0'>
                                <button onClick={() => {
                                    navigate(-1)
                                }} className='btn btn-sm btn-primary'>
                                    Return Back
                                </button>
                            </div>
                            {/* end::Link */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export {ComingSoon}
