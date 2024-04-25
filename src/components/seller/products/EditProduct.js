import {PageTitle} from "../../../_metronic/layout/core";
import {KTIcon} from "../../../_metronic/helpers";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {editProduct, fetchCategories} from "../_requests";
import serialize from "form-serialize";
import {apiGet} from "../../common/apiService";

const EditProductPage = () => {
    const navigate = useNavigate()
    const formRef = useRef();
    const submitRef = useRef();
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const {id} = useParams();

    let status = "Saved"
    const [formData, setFormData] = useState({});

    useEffect(() => {
        window.$(".date-time").flatpickr("datetime-local", {
            enableTime: true,
            altInput: true,
            time_24hr: true,
            minDate: 'today',
            minTime: `${(new Date()).getHours()}:${(new Date()).getMinutes()}`,
            altFormat: "l, d F H:i K",
            dateFormat: "Z",
        });
        window.$("#categories").select2({
            placeholder: 'Select categories'
        });

        getCategories()

    }, []);

    useEffect(() => {
        apiGet(`/products/${id}`).then((response) => {
            const res = response.data.data
            res["categoryIds"] = res.categories.map(category => category.id)
            setFormData(res);
        })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [])

    useEffect(() => {
        console.log("categoryIds: ", formData)
    }, [formData]);


    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    async function getCategories() {
        status = "Saved"
        fetchCategories().then((res) => {
            setCategories(res.data.data);
            console.log("getCategories ", res.data.data)

        })
    }

    function submitForRelease() {
        status = "Running"
        submitRef.current.click();
    }

    function onSubmit(e) {
        e.preventDefault()
        setLoading(true)

        const formData = serialize(document.querySelector('#add-product-form'), {hash: true});
        formData.status = status
        formData.id = id
        const originalDate = new Date(formData["bidDueDate"]);
        const originalDate2 = new Date(formData["biddingPaymentDueDate"]);
        const utcDate = new Date(originalDate.toISOString());
        const utcDate2 = new Date(originalDate2.toISOString());
        const formattedUtcDate = utcDate.toISOString();
        const formattedUtcDate2 = utcDate2.toISOString();

        formData["bidDueDate"] = formattedUtcDate;
        formData["biddingPaymentDueDate"] = formattedUtcDate2;
        editProduct(formData).then((res) => {
            navigate("/products")
        }).finally(() => {
            setLoading(false)
        })
    }

    return <>
        <div className="card">
            <div className="card-header border-0 pt-6">
                <div className="card-title">
                </div>

                <div className="card-toolbar">
                    <Link to="/products" className="btn btn-light-dark">
                        <KTIcon iconType="duotone" iconName="double-left" className="fs-2"/>
                        Back to Products
                    </Link>
                </div>
            </div>

            <div className="card-body pt-0">
                <div className="row mb-5 justify-content-center">
                    <div className="col-sm-12 col-lg-6">
                        <form ref={formRef} onSubmit={onSubmit} action="" method="post" id="add-product-form">
                            <div className="col-md-12 fv-row mb-5">
                                <label className="fs-5 fw-bold mb-2" htmlFor="name">Name</label>
                                <input disabled={loading} type="text" name="name" className="form-control" id="name"
                                       placeholder="Name" value={formData.name}
                                       onChange={handleChange}
                                       required/>
                            </div>

                            <div className="col-md-12 fv-row mb-5">
                                <label className="fs-5 fw-bold mb-2" htmlFor="description">Description</label>
                                <textarea disabled={loading} name="description" id="description"
                                          value={formData.description}
                                          onChange={handleChange} className="form-control"
                                          placeholder="Description" rows='5' required></textarea>
                            </div>

                            <div className="col-md-12 fv-row mb-5">
                                <label className="fs-5 fw-bold mb-2" htmlFor="categories">Categories</label>
                                <select disabled={loading} name="categoryIds[]" data-control="select2"
                                        multiple="multiple"
                                        className="form-select"
                                        defaultValue={formData.categoryIds}
                                        value={formData.categoryIds}
                                        id="categories" required>
                                    {categories.map((object) => {
                                        return <option value={object.id} key={object.id}>{object.name}</option>;
                                    })}
                                </select>
                            </div>

                            <div className="col-md-12 fv-row mb-5">
                                <label className="fs-5 fw-bold mb-2" htmlFor="price">Price</label>
                                <input disabled={loading} name="price" min="1" type="number"
                                       className="form-control" id="price" value={formData.price}
                                       onChange={handleChange}
                                       placeholder="Price"
                                       required/>
                            </div>

                            <div className="col-md-12 fv-row mb-5">
                                <label className="fs-5 fw-bold mb-2" htmlFor="name">Bid Start Price</label>
                                <input disabled={loading} name="bidStartingPrice" min="1" type="number"
                                       className="form-control" id="name" value={formData.bidStartingPrice}
                                       onChange={handleChange}
                                       placeholder="Bid Start Price"
                                       required/>
                            </div>

                            <div className="col-md-12 fv-row mb-5">
                                <label className="fs-5 fw-bold mb-2" htmlFor="name">Bid Deposit Percent</label>
                                <div className="input-group">
                                    <input disabled={loading} name="deposit" min="1" type="number"
                                           className="form-control"
                                           id="name" value={formData.deposit} onChange={handleChange}
                                           placeholder="Bid Deposit Percent" required/>
                                    <span className="input-group-text">
                                        <span className="text-dark">
                                            %
                                        </span>
                                    </span>
                                </div>
                            </div>

                            <div className="col-md-12 fv-row mb-5">
                                <label htmlFor="bid_due_date" className="fs-5 fw-bold mb-2">Bid Due Date</label>
                                <input disabled={loading} name="bidDueDate" className="form-control date-time"
                                       type={"datetime-local"}
                                       placeholder="Pick a date" value={new Date(formData.bidDueDate).toLocaleString()}
                                       onChange={handleChange}
                                       id="bid_due_date"/>
                            </div>

                            <div className="col-md-12 fv-row mb-5">
                                <label htmlFor="bid_payment_due_date" className="fs-5 fw-bold mb-2">Bid Payment Due
                                    Date</label>
                                <input disabled={loading} name="biddingPaymentDueDate"
                                       className="form-control date-time" type={"datetime-local"}
                                       placeholder="Pick a date"
                                       value={new Date(formData.biddingPaymentDueDate).toLocaleString()}
                                       onChange={handleChange}
                                       id="bid_payment_due_date" required/>
                            </div>

                            {/*                            <div className="col-md-12 fv-row mb-5">
                                <label htmlFor="images" className="fs-5 fw-bold mb-2">
                                    Images
                                </label>
                                <input disabled={loading} name="images" ref={imagesRef} className="form-control"
                                       type="file" id="images"
                                       multiple
                                       required/>
                            </div>*/}

                            <button ref={submitRef} type="submit" className="btn btn-light-dark mt-3">
                                {!loading && <span className='indicator-label'>Submit</span>}
                                {loading && (
                                    <span className='indicator-progress' style={{display: 'block'}}>
                                    Submit...
                                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                    </span>
                                )}
                            </button>

                            <button onClick={submitForRelease} type="button"
                                    className="btn btn-light-success mt-3 ms-2">
                                {!loading && <span className='indicator-label'>Submit & Release</span>}
                                {loading && (
                                    <span className='indicator-progress' style={{display: 'block'}}>
                                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                    </span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </>
}

const EditProduct = () => {
    const breadcrumbs = [
        {
            title: 'Products',
            path: '/products',
            isSeparator: false,
            isActive: false,
        },
        {
            title: '',
            path: '',
            isSeparator: true,
            isActive: false,
        },
    ]
    return (
        <>
            <PageTitle breadcrumbs={breadcrumbs}>Edit Product</PageTitle>
            <EditProductPage/>
        </>
    )
}

export {EditProduct}

