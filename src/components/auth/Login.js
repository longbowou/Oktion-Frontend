import {useEffect, useState} from 'react'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {initPasswordShowHide, setTitle} from "./AuthHelpers";
import {login} from "./_requests";
import {useAuth, useSuccessMessage} from "./AuthProvider";


export function Login() {
    const {messageSuccess} = useSuccessMessage()
    const [loading, setLoading] = useState(false)
    const [validation, setValidation] = useState(false)
    const [validationMessage, setValidationMessage] = useState("")
    const [resMessage, setResMessage] = useState("")
    const [isValid, setIsValid] = useState(true);
    const email_pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    // const {successMsg} = props;

    useEffect(() => {
        initPasswordShowHide()

        setTitle("Sign In")
    }, []);

    const {setCurrentUser, saveAuth} = useAuth();

    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true)
        setResMessage("")
        const res = login(formData.email, formData.password)
        res.then(response => {
            // Handle the successful response here
            saveAuth(response.data.data);
            setCurrentUser(response.data.data)
        })
            .catch(error => {
                // Handle the error here
                if (error.response) {
                    // The request was made, and the server responded with a status code other than 2xx.
                    setResMessage(error.response.data.message)

                    return error
                } else if (error.request) {
                    return {"message": "No response received. The request was made but didn't get a response."}
                } else {

                    console.error("message:", error.message);
                }

                throw error;
            }).finally(() => {
            setLoading(false)
        });
    }


    const handleChange = (e) => {
        const {name, value} = e.target;
        if (name === "email") {
            if (value.match(email_pattern)) {
                setValidation(false);
                setFormData({
                    ...formData,
                    [name]: value,
                });
            } else {
                setValidation(true);
                setValidationMessage("Invalid email expression!")

            }

        } else if (name === "password") {
            setFormData({
                ...formData,
                [name]: value,
            });
        } else {
            console.log("test set validation")
            setValidation(true);
        }
    };

    return (
        <form
            className='form w-100'
            onSubmit={handleSubmit}
            id='kt_login_signin_form'
        >
            {/* begin::Heading */}
            <div className='text-center mb-11'>
                <h1 className='text-dark fw-bolder mb-3'>Sign In</h1>
                <div className='text-gray-500 fw-semibold fs-6'>Your next prized possession is just a bid away – get
                    ready to bid, win, and
                    conquer with our one-of-a-kind auction app !
                </div>
            </div>
            {/* begin::Heading */}

            {messageSuccess ? (
                <div className='mb-lg-15 alert alert-success'>
                    <div className='alert-text font-weight-bold'>{messageSuccess}</div>
                </div>
            ):""}

            {/* begin::Form group */}
            <div className='fv-row mb-8'>
                <label className='form-label fs-6 fw-bolder text-dark'>Email</label>
                <input
                    required
                    placeholder='Email'
                    className={clsx(
                        'form-control bg-transparent',
                        {'is-invalid': validation},
                    )}
                    type={'email'}
                    name='email'
                    autoComplete='off'
                    onChange={handleChange}
                />
                {validation && (
                    <div className='fv-plugins-message-container'>
                        <span role='alert'>{validationMessage}</span>
                    </div>
                )}
            </div>
            {/* end::Form group */}

            {/* begin::Form group */}
            <div className='fv-row mb-3' data-kt-password-meter="true">
                <label className='form-label fw-bolder text-dark fs-6 mb-0'>Password</label>
                <div className="position-relative">
                    <input
                        type='password'
                        placeholder='Password'
                        autoComplete='off'
                        className={clsx(
                            'form-control bg-transparent',
                            {
                                'is-invalid': false,
                            }
                        )}
                        name='password'
                        onChange={handleChange}
                        required
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
                {resMessage && (
                    <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>
                            <span role='alert'>{resMessage}</span>
                        </div>
                    </div>
                )}
            </div>
            {/* end::Form group */}

            {/* begin::Action */}
            <div className='d-grid mb-10'>
                <button
                    type='submit'
                    id='kt_sign_in_submit'
                    className='btn btn-primary'
                    disabled={loading}
                >
                    {!loading && <span className='indicator-label'>Login</span>}
                    {loading && (
                        <span className='indicator-progress' style={{display: 'block'}}>
                            Please wait...
                            <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                        </span>
                    )}
                </button>
            </div>
            {/* end::Action */}

            <div className='text-gray-500 text-center fw-semibold fs-6'>
                Not a Member yet?{' '}
                <Link to='/auth/registration' className='link-primary'>
                    Sign up
                </Link>
            </div>
        </form>
    )
}
