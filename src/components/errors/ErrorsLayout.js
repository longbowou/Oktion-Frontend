import {Outlet} from 'react-router-dom'

const ErrorsLayout = () => {
    return (
        <div className='d-flex flex-column flex-root'>
            <div className='d-flex flex-column flex-center flex-column-fluid'>
                <div className='d-flex flex-column flex-center text-center p-10'>
                    <div className='card card-flush  w-lg-650px py-5'>
                        <div className='card-body py-15 py-lg-20'>
                            <Outlet/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export {ErrorsLayout}
