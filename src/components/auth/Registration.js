import {useEffect, useState} from 'react'
import clsx from 'clsx'
import {Link, useNavigate} from 'react-router-dom'
import {initPasswordShowHide, setTitle} from "./AuthHelpers";

import {apiPost} from "../common/apiService";
import {useSuccessMessage} from "./AuthProvider";


export function Registration() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [passValidation, setPassValidation] = useState(false)
    const [errMsg, setErrMsg] = useState("")
    const {setSuccessMessage} = useSuccessMessage();


    useEffect(() => {
        initPasswordShowHide()
        setTitle("Sign Up")
    }, []);

    const types = [
        {
            id: "SELLER",
            name: "Seller",
        },
        {
            id: "CUSTOMER",
            name: "Customer",
        },
    ]

    useEffect(() => {
        window.$("#type").select2();
    }, [])

    function clearAll() {
        setErrMsg("");
        setPassValidation(false)
    }

    function handleSubmit(e) {
        e.preventDefault()
        setLoading(true);
        clearAll()
        const formData = new FormData(e.target);
        const formDataObj = Object.fromEntries(formData.entries())

        if (formDataObj?.password !== formDataObj?.confirmPassword) {
            console.log("confirm password has matched ")
            setPassValidation(true);
            return
        }

        formDataObj.roles = [formDataObj["roles"]]
        delete formDataObj.confirmPassword;

        apiPost('/users/register', formDataObj)
            .then((response) => {
                console.log("Success")
                setLoading(false)
                setSuccessMessage("Registration Successfully Done!")
                navigate('/auth/login');


            }).catch(error => {
            setLoading(false);

            // Handle the error here
            if (error.response) {
                // The request was made, and the server responded with a status code other than 2xx.
                console.log("Response data:", error.response.data.message);
                console.log("Response status:", error.response.status);
                setErrMsg(error.response.data.message)
                return

            } else if (error.request) {
                // The request was made, but no response was received.
                console.log("No response received. The request was made but didn't get a response.");
            } else {
                // Something happened in setting up the request that triggered an error.
                console.error("Error:", error.message);
            }

            // You can throw an error or handle it as needed.
            // For example, you might return a specific error message or set some state.
            throw error;
        })

    }

    return (
        <form
            className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
            id='kt_login_signup_form'
            onSubmit={handleSubmit}
        >
            {/* begin::Heading */}
            <div className='text-center mb-11'>
                {/* begin::Title */}
                <h1 className='text-dark fw-bolder mb-3'>Sign Up</h1>
                {/* end::Title */}

                <div className='text-gray-500 fw-semibold fs-6'>Your next prized possession is just a bid away – get
                    ready to bid, win, and
                    conquer with our one-of-a-kind auction app !
                </div>
            </div>
            {/* end::Heading */}

            {errMsg !== "" ? (
                <div className='mb-lg-15 alert alert-danger'>
                    <div className='alert-text font-weight-bold'>{errMsg}</div>
                </div>
            ) : ""}

            {/* begin::Form group Firstname */}
            <div className='fv-row mb-8'>
                <label className='form-label    fw-bolder text-dark fs-6'>Account Type</label>
                <select data-control="select2" className="form-select" name="roles"
                        id="type" required={true}>
                    <option disabled selected>Select a type</option>
                    {types.map((object) => {
                        return <option value={object.id} key={object.id}>{object.name}</option>;
                    })}
                </select>

            </div>

            <div className='fv-row mb-8'>
                <label className='form-label fw-bolder text-dark fs-6'>First name</label>
                <input
                    required={true}
                    placeholder='Name'
                    type='text'
                    autoComplete='off'
                    className={clsx(
                        'form-control bg-transparent',
                        {
                            'is-invalid': false,
                        },
                        {
                            'is-valid': false,
                        }
                    )}
                    name="name"
                />
                {false && (
                    <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>
                            <span role='alert'>{}</span>
                        </div>
                    </div>
                )}
            </div>
            {/* end::Form group */}
            <div className='fv-row mb-8'>
                {/* begin::Form group Lastname */}
                <label className='form-label fw-bolder text-dark fs-6'>Licence</label>
                <input
                    required={true}
                    placeholder='Licence'
                    name='licenseNumber'
                    type='text'
                    autoComplete='off'
                    className={clsx(
                        'form-control bg-transparent',
                        {
                            'is-invalid': false,
                        }
                    )}
                />
                {false && (
                    <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>
                            <span role='alert'>{}</span>
                        </div>
                    </div>
                )}
                {/* end::Form group */}
            </div>

            {/* begin::Form group Email */}
            <div className='fv-row mb-8'>
                <label className='form-label fw-bolder text-dark fs-6'>Email</label>
                <input
                    required={true}
                    placeholder='Email'
                    type='email'
                    name='email'
                    autoComplete='off'
                    className={clsx(
                        'form-control bg-transparent',
                        {'is-invalid': false}
                    )}
                />
                {false && (
                    <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>
                            <span role='alert'>{}</span>
                        </div>
                    </div>
                )}
            </div>
            {/* end::Form group */}

            {/* begin::Form group Password */}
            <div className='fv-row mb-8' data-kt-password-meter='true'>
                <div className='mb-1'>
                    <label className='form-label fw-bolder text-dark fs-6'>Password</label>
                    <div className='position-relative mb-3'>
                        <input
                            required={true}
                            type='password'
                            name='password'
                            placeholder='Password'
                            autoComplete='off'
                            className={clsx(
                                'form-control bg-transparent',
                                {
                                    'is-invalid': false,
                                }
                            )}
                        />
                        <span className="btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2"
                              data-kt-password-meter-control="visibility">
											<i className="ki-duotone ki-eye fs-3x">
                                                <span className="path1"></span>
                                                <span className="path2"></span>
                                                <span className="path3"></span>
                                            </i>
                                            <i className="ki-duotone ki-eye-slash fs-3x d-none">
                                                <span className="path1"></span>
                                                <span className="path2"></span>
                                                <span className="path3"></span>
                                                <span className="path4"></span>
                                            </i>
                    </span>
                    </div>
                    {false && (
                        <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>
                                <span role='alert'>{}</span>
                            </div>
                        </div>
                    )}
                </div>
                <div className='text-muted'>
                    Use 8 or more characters with a mix of letters, numbers & symbols.
                </div>
            </div>
            {/* end::Form group */}

            {/* begin::Form group Confirm password */}
            <div className='fv-row mb-5' data-kt-password-meter="true">
                <label className='form-label fw-bolder text-dark fs-6'>Confirm Password</label>
                <div className="position-relative">
                    <input
                        required={true}
                        type='password'
                        name='confirmPassword'
                        placeholder='confirm Password'
                        autoComplete='off'
                        className={clsx(
                            'form-control bg-transparent',
                            {
                                'is-invalid': passValidation,
                            }
                        )}
                    />
                    <span className="btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2"
                          data-kt-password-meter-control="visibility">
											<i className="ki-duotone ki-eye fs-3x">
                                                <span className="path1"></span>
                                                <span className="path2"></span>
                                                <span className="path3"></span>
                                            </i>
                                            <i className="ki-duotone ki-eye-slash fs-3x d-none">
                                                <span className="path1"></span>
                                                <span className="path2"></span>
                                                <span className="path3"></span>
                                                <span className="path4"></span>
                                            </i>
                    </span>
                </div>
                {passValidation && (
                    <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>
                            <span role='alert'>{"Password has miss-matched !"}</span>
                        </div>
                    </div>
                )}
            </div>
            {/* end::Form group */}


            {/* begin::Form group */}
            <div className='text-center'>
                <button
                    type='submit'
                    id='kt_sign_up_submit'
                    className='btn btn-lg btn-primary w-100 mb-5'
                    disabled={false}
                >
                    {!loading && <span className='indicator-label'>Submit</span>}
                    {loading && (
                        <span className='indicator-progress' style={{display: 'block'}}>
              Please wait...{' '}
                            <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
                    )}
                </button>
                <Link to='/auth/login'>
                    <button
                        type='button'
                        id='kt_login_signup_form_cancel_button'
                        className='btn btn-lg btn-light-primary w-100 mb-5'
                    >
                        Cancel
                    </button>
                </Link>
            </div>
            {/* end::Form group */}
        </form>
    )
}
