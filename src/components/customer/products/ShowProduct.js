import {PageTitle} from "../../../_metronic/layout/core";
import {useEffect, useRef, useState} from "react";
import {Link, useParams} from 'react-router-dom';
import "@pqina/flip/dist/flip.min.css";
import CountDown from "../../CountDown";
import clsx from "clsx";
import {KTIcon} from "../../../_metronic/helpers";
import {apiGet, apiPost} from "../../common/apiService";
import {useAuth} from "../../auth/AuthProvider";
import {API_URL, DASHBOARD_URL} from "../../common/apiUrl";
import timeAgo from "../../common/timeAgo";
import {UserBalanceCountUp} from "../../UserBalanceCountUp";

const ShowProductPage = () => {
    const {currentUser} = useAuth()
    const {id} = useParams();

    const [bidAmount, setBidAmount] = useState(0);
    const [minBidAmount, setMinBidAmount] = useState(0);
    const [bidPaymentRemainingAmount, setBidPaymentRemainingAmount] = useState(0);
    const [userBalance, setUserBalance] = useState(currentUser.balance);

    const [product, setProduct] = useState({});
    const [bidding, setBidding] = useState([]);

    const [loading, setLoading] = useState(false)
    const [fetchingProduct, setFetchingProduct] = useState(false)

    const highestBidAmountRef = useRef(null);
    const [highestBidAmountAnim, setHighestBidAmountAnim] = useState()
    const [isHighestBidAmountAnimInitiated, setIsHighestBidAmountAnimInitiated] = useState(false)

    const biddersRef = useRef(null);
    const [biddersAnim, setBiddersAnim] = useState()
    const [isBiddersAnimInitiated, setIsBiddersAnimInitiated] = useState(false)

    const [bidders, setBidders] = useState([]);

    const [bidError, setBidError] = useState(null);

    const [isMakingFullPayment, setIsMakingFullPayment] = useState(false)


    useEffect(() => {
        initHighestBidAmountCountUp()
        initBiddersCountUp()
        fetchProduct()

        console.log(currentUser)

        const intervalId = setInterval(fetchProduct, 5000);
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    async function initHighestBidAmountCountUp() {
        const anim = new window.CountUp(highestBidAmountRef.current, minBidAmount);
        setHighestBidAmountAnim(anim)
        if (!anim.error) {
            anim.start();
            setIsHighestBidAmountAnimInitiated(true)
        }
    }

    async function initBiddersCountUp() {
        const anim = new window.CountUp(biddersRef.current, bidders.length)
        setBiddersAnim(anim);
        if (!anim.error) {
            anim.start();
            setIsBiddersAnimInitiated(true)
        }
    }

    useEffect(() => {
        updateBidAmount()
        updateHighestBidCounter()
        updateRemainingAmount()
    }, [product]);

    function updateRemainingAmount() {
        if (product.status === "Sold") {
            setBidPaymentRemainingAmount(product.highestBidAmount - product.depositAmount)
        }
    }

    function updateBidAmount() {
        let localMinBidAmount = 0
        if (product) {
            localMinBidAmount = (product.highestBidAmount > 0 ? product.highestBidAmount : product.bidStartingPrice)
            setMinBidAmount(localMinBidAmount)
        }
        if (bidAmount <= localMinBidAmount) {
            setBidAmount(localMinBidAmount + 1)
        }
    }

    function increaseBidAmount() {
        if (bidAmount) {
            setBidAmount(bidAmount + 500)
        } else {
            setBidAmount(500)
        }
    }

    function handleFullPayment() {
        setIsMakingFullPayment(true)
        apiPost("/bidding/full-payment", {productId: id}).then((response) => {
            console.log(response)
            fetchProduct()
        }).catch((error) => {
        }).finally(() => {
            setIsMakingFullPayment(false)
        });

    }

    function decreaseBidAmount() {
        const amount = bidAmount - 500;
        if (amount > minBidAmount) {
            setBidAmount(bidAmount - 500)
        } else {
            setBidAmount(minBidAmount)
        }
    }

    async function fetchProduct() {
        if (!fetchingProduct) {
            setFetchingProduct(true)
            apiGet(`/products/${id}`).then((response) => {
                setProduct(response.data.data);
                if (response.data.data.highestBidAmount) {
                    fetchBidHistory()
                }
                fetchUserBalance()
            })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                }).finally(() => {
                setFetchingProduct(false)
            });
        }
    }

    async function fetchBidHistory() {
        apiGet(`/bidding/product/${id}`).then((response) => {
            setBidding(response.data.data);
        })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }

    async function fetchUserBalance() {
        apiGet(DASHBOARD_URL).then((response) => {
            setUserBalance(response.data.data.balance)
        })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }

    useEffect(() => {
        updateHighestBidCounter()
    }, [minBidAmount]);

    function updateHighestBidCounter() {
        if (isHighestBidAmountAnimInitiated) {
            highestBidAmountAnim.update(minBidAmount)
        } else {
            initHighestBidAmountCountUp()
        }
    }

    useEffect(() => {
        let bidUserIds = [];
        let bidUserNames = [];
        bidding.forEach((b) => {
            if (!bidUserIds.includes(b.customer.id)) {
                bidUserIds.push(b.customer.id)
                bidUserNames.push(b.customer.name)
            }
        })

        if (bidUserIds.length > bidders.length) {
            setBidders(bidUserNames)
        }
    }, [bidding]);

    useEffect(() => {
        updateBiddersCounter()
    }, [bidders]);

    function updateBiddersCounter() {
        if (isBiddersAnimInitiated) {
            biddersAnim.update(bidders.length)
        } else {
            initBiddersCountUp()
        }
    }

    function statusTextColor() {
        switch (product.status) {
            case "Running":
                return "text-warning"
            case "Closed":
                return "text-danger"
            case "Sold":
                return "text-success"
            default:
                return "text-info"
        }
    }

    const backgrounds = ["bg-info", "bg-warning", "bg-success", "bg-dark", "bg-danger"]

    function onSubmit(event) {
        event.preventDefault()
        setLoading(true)
        setBidError(null)
        apiPost("/bidding", {"productId": product.id, "amount": bidAmount})
            .then((res) => {
                console.log(res)

                fetchProduct()
            }).catch((error) => {
            if (error.response.status === 412) {
                setBidError("Oops! It seems your account balance is too low to place a bid. To keep participating, top up your balance now. Make a deposit and keep the excitement going!")
            }
            if (error.response.status === 406) {
                setBidError("Oops! Your Bid is Below the Highest Bid. Probably due to a previous concurrent bid!")
            }
        }).finally(() => {
            setLoading(false)
        })
    }

    return <>
        {/* begin::Row */}
        <div className='row g-5 g-xl-10 mb-5 mb-xl-10 justify-content-center'>
            <div className="col-sm-12 mt-5">
                <div className="float-end">
                    <Link to="/products" className="btn btn-light-dark">
                        <KTIcon iconType="duotone" iconName="double-left" className="fs-2"/>
                        Back to Products
                    </Link>
                </div>
            </div>

            <div className="col-sm-12 col-md-7 mt-5">
                <div className="card p-5 mb-5">
                    <div className="card-body p-0">
                        <div className="d-block overlay" data-fslightbox="lightbox-hot-sales">
                            <div id="kt_carousel_1_carousel" className="carousel carousel-custom slide"
                                 data-bs-ride="carousel" data-bs-interval="8000">
                                <div className="d-flex align-items-center justify-content-between flex-wrap">
                                    <span className="fs-4 fw-bold pe-2"></span>
                                    <ol className="p-0 m-0 carousel-indicators carousel-indicators-dots">
                                        {product.images && product.images.map((image, index) => {
                                            return <li data-bs-target="#kt_carousel_1_carousel"
                                                       data-bs-slide-to={index}
                                                       className={clsx("ms-1", index === 0 && "active")}></li>
                                        })}
                                    </ol>
                                </div>

                                <div className="carousel-inner">
                                    {product.images && product.images.map((image, index) => {
                                        return <div className={clsx("carousel-item", index === 0 && "active")}>
                                            <div
                                                className="overlay-wrapper bgi-no-repeat bgi-position-center bgi-size-cover card-rounded min-h-250px"
                                                style={{backgroundImage: `url("${API_URL}/products/images/${image.path}")`}}>
                                            </div>
                                        </div>
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="mt-5">
                            <div
                                className="fs-2 text-dark fw-bold text-hover-primary text-dark lh-base">
                                {product.name}
                            </div>

                            <div className="col-md-12 mt-5">
                                <h6 className="fs-4 text-muted">Description</h6>
                                <p className="fs-3">{product.description}</p>
                            </div>

                            <div className="col-md-12 mt-5">
                                <h6 className="fs-4 text-muted">Price</h6>
                                <p>
                                    <span className="fs-5 fw-semibold text-gray-400">$</span>
                                    <span
                                        className="fs-1 fw-bold">{product.price && product.price.toLocaleString('en-US')}</span>
                                </p>
                            </div>

                            <div className="col-md-12 mt-5">
                                <h6 className="fs-4 text-muted">Starting Price</h6>
                                <p>
                                    <span className="fs-5 fw-semibold text-gray-400">$</span>
                                    <span
                                        className="fs-1 fw-bold">{product.bidStartingPrice && product.bidStartingPrice.toLocaleString('en-US')}</span>
                                </p>
                            </div>

                            <div className="col-md-12 mt-5">
                                <h6 className="fs-4 text-muted">Deposit</h6>
                                <p>
                                    <span className="fs-5 fw-semibold text-gray-400">$</span>
                                    <span
                                        className="fs-1 fw-bold">{product.depositAmount && product.depositAmount.toLocaleString('en-US')} - {product.deposit && product.deposit}%</span>
                                </p>
                            </div>

                            {product.highestBidAmount > 0 &&
                                <div className="col-md-12 mt-5">
                                    <h6 className="fs-4 text-muted">Highest Bid</h6>
                                    <p>
                                        <span className="fs-5 fw-semibold text-gray-400">$</span>
                                        <span
                                            className="fs-1 fw-bold">{product.highestBidAmount && product.highestBidAmount.toLocaleString('en-US')} - {product.highestBidUser && product.highestBidUser.name}</span>
                                    </p>
                                </div>}

                            {product.bidders > 0 &&
                                <div className="col-md-12 mt-5">
                                    <h6 className="fs-4 text-muted">Bidders</h6>
                                    <p>
                                        <span className="fs-1 fw-bold">{product.bidders}</span>
                                    </p>
                                </div>}

                            <div className="col-md-12 mt-5">
                                <h6 className="fs-4 text-muted">Bid Due Date</h6>
                                <p className="fs-3">{(new Date(product.bidDueDate)).toLocaleString('en-us', {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                })}</p>
                            </div>

                            <div className="col-md-12 mt-5">
                                <h6 className="fs-4 text-muted">Bid Payment Due Date</h6>
                                <p className="fs-3">{(new Date(product.biddingPaymentDueDate)).toLocaleString('en-us', {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                })}</p>
                            </div>

                            <div className="col-md-12 mt-5">
                                <h6 className="fs-4 text-muted">Categories</h6>
                                <ul>
                                    {product.categories && product.categories.map((object) => {
                                        return <li className="fs-3">{object.name}</li>
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {product.highestBidAmount > 0 &&
                    <div className="card p-5">
                        <div className="card-header">
                            <div className="card-title">
                                <h1>Bidding History</h1>
                            </div>
                            <div className="card-toolbar">

                            </div>
                        </div>

                        <div className="card-body p-0">
                            <table id="kt_datatable_example_1"
                                   className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer">
                                <thead>
                                <tr className="text-start text-gray-900 fw-bolder fs-7 text-uppercase gs-0 ">
                                    <th className="ps-9 fs-3">Full Name</th>
                                    <th className="text-center fs-3">Amount</th>
                                    <th className="text-center fs-3">Made On</th>
                                </tr>
                                </thead>
                                <tbody className="text-gray-800 fw-bold">
                                {bidding.map((object) => {
                                    return <>
                                        <tr className="" key={object.id}>
                                            <td className="text-center">
                                                <div className="d-flex align-items-center">
                                                    <a href="#" className="symbol symbol-circle symbol-50px">
                                                    <span
                                                        className={clsx("symbol-label text-inverse-primary fw-bold fs-3 bg-dark")}>
                                                        {object.customer.name[0]}
                                                    </span>
                                                    </a>

                                                    <div className="ms-5">
                                                        <a href="#"
                                                           className="text-start text-gray-800 text-hover-primary fs-3 fw-normal"
                                                           data-kt-ecommerce-product-filter="product_name">
                                                            {object.customer.name}
                                                            <div className="">
                                                               <span className="text-start text-muted fw-normal fs-4">
                                                                    {object.customer.email}
                                                                </span>
                                                            </div>
                                                        </a>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="text-center">
                                                <span className="fs-6 fw-semibold text-gray-400">$</span>
                                                <span className="fs-2">
                                                {object.amount.toLocaleString("en-US")}
                                            </span>
                                            </td>
                                            <td className="text-center fs-3 fw-normal">
                                                {(new Date(object.createdOn)).toLocaleString('en-us', {
                                                    weekday: "long",
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "numeric",
                                                    minute: "numeric",
                                                })}
                                            </td>
                                        </tr>
                                    </>
                                })}
                                </tbody>
                            </table>

                            <div className="row">
                                <div
                                    className="col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start">
                                </div>
                                <div
                                    className="col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end">
                                    <div className="dataTables_paginate paging_simple_numbers"
                                         id="kt_ecommerce_products_table_paginate">
                                        <ul className="pagination">
                                            <li key={1} className="paginate_button page-item previous disabled"
                                                id="kt_ecommerce_products_table_previous">
                                                <a href="#"
                                                   aria-controls="kt_ecommerce_products_table"
                                                   data-dt-idx="0" tabIndex="0"
                                                   className="page-link"><i
                                                    className="previous"></i>
                                                </a>
                                            </li>
                                            <li key={2} className="paginate_button page-item active">
                                                <a href="#"
                                                   aria-controls="kt_ecommerce_products_table"
                                                   data-dt-idx="1" tabIndex="0"
                                                   className="page-link">1
                                                </a>
                                            </li>
                                            <li key={3} className="paginate_button page-item next disabled"
                                                id="kt_ecommerce_products_table_next">
                                                <a href="#"
                                                   aria-controls="kt_ecommerce_products_table"
                                                   data-dt-idx="6" tabIndex="0"
                                                   className="page-link">
                                                    <i className="next"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>

            <div className="col-sm-12 col-md-5 mt-5">
                <div className="card mb-5">
                    <div className="card-body">
                        {["Sold", "Sold & Paid"].includes(product.status) && product.highestBidUser.id === currentUser.id &&
                            <div className="text-center">
                            <KTIcon iconType="duotone" iconName="medal-star"
                                    className="text-success fs-7x"/>
                        </div>}

                        {["Sold", "Sold & Paid"].includes(product.status) && product.highestBidUser.id === currentUser.id &&
                            <h1 className={clsx("text-center text-success fs-2x mb-4")}>
                                Congratulations<br/> You've Hit the Jackpot!
                            </h1>}

                        {["Running", "Closed"].includes(product.status) &&
                            <h1 className={clsx("text-center fs-4x mb-4", statusTextColor())}>
                                {product && product.status}
                            </h1>}

                        {["Sold"].includes(product.status) && product.highestBidUser.id !== currentUser.id &&
                            <h1 className={clsx("text-center fs-4x mb-4", statusTextColor())}>
                                {product && product.status}
                            </h1>}

                        {product && product.bidDueDate && product.status === "Running" &&
                            <CountDown value={product.bidDueDate}/>}

                        {["Closed", "Sold", "Sold & Paid"].includes(product.status) && <div className="text-center">
                            <span className="text-gray-900 fw-bolder fs-2x">
                                {timeAgo.format(new Date(product?.bidDueDate))}
                            </span>
                        </div>}

                        {product.status === "Running" && <div className="text-center">
                            <span className="fs-1 fw-semibold text-gray-400">$</span>
                            <span ref={highestBidAmountRef} className="text-gray-900 fw-bolder fs-5x mt-5">
                                0
                            </span>
                            {product && product.highestBidAmount > 0 &&
                                <div className="fs-2 fw-bold text-gray-900">
                                    {product.highestBidUser.name}
                                </div>}
                            <div
                                className="fs-1 fw-bold text-gray-400">{product.highestBidAmount > 0 ? "Highest Bid" : "Starting Price"}</div>
                        </div>}

                        {["Closed", "Sold", "Sold & Paid"].includes(product.status) &&
                            <div className="separator my-5"></div>}

                        {product.status === "Sold" && product.highestBidUser.id === currentUser.id && <>
                            <div className="text-center mb-2">
                                <span className="text-warning fw-bolder fs-2x">
                                        Make your the remaining payment before the due time
                                    </span>
                            </div>

                            {product && product.biddingPaymentDueDate && product.status === "Sold" &&
                                <CountDown value={product.biddingPaymentDueDate}/>}
                        </>}

                        {["Sold", "Sold & Paid"].includes(product.status) &&
                            <UserBalanceCountUp balance={userBalance}
                                                color={userBalance < bidPaymentRemainingAmount ? "text-danger" : "text-success"}/>}

                        {product.status === "Sold" && product.highestBidUser.id === currentUser.id && <>
                            <div className="text-center mt-3">
                                <p className="m-0 fs-2 fw-semibold">Remaining Amount</p>
                                <span className="fs-1 fw-semibold text-gray-400">$</span>
                                <span className="text-gray-900 fw-bolder fs-3x mt-5">
                                    {bidPaymentRemainingAmount.toLocaleString("en-US")}
                                </span>
                            </div>

                            {userBalance < bidPaymentRemainingAmount &&
                                <div className="text-danger text-center fs-3">
                                    Uh-oh! Your account balance is a bit short for the full payment. Time to top it
                                    up! Make
                                    a deposit and complete the payment seamlessly.
                                </div>}

                            <button onClick={handleFullPayment} type="submit"
                                    disabled={isMakingFullPayment || userBalance < bidPaymentRemainingAmount}
                                    className="btn btn-success btn-lg rounded-0 mt-5 col-md-12">
                                {!isMakingFullPayment && <span className='indicator-label'>Make the payment</span>}
                                {isMakingFullPayment && (
                                    <span className='indicator-progress' style={{display: 'block'}}>
                                        Submitting...
                                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                    </span>
                                )}
                            </button>
                        </>}
                    </div>
                </div>

                {product.status === "Running" && <div className="card mb-5">
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                        <UserBalanceCountUp balance={userBalance}/>

                        <form action="" onSubmit={onSubmit}>
                            <div className="col-md-12 fv-row mb-5">
                                <label className="fs-1 fw-bold mb-1" htmlFor="name">Amount</label>
                                {product.highestBidAmount === 0 && <div className="mb-5">
                                    <span className="text-muted text-start fs-5 fw-semibold">Be the first to bid this product</span>
                                </div>}
                                <div className="input-group rounded-0">
                                    <span onClick={decreaseBidAmount} className="input-group-text bg-hover-warning">
                                        <KTIcon iconType="duotone" iconName="minus-circle"
                                                className="fs-3x text-dark"/>
                                    </span>
                                    <input autoFocus type="number"
                                           disabled={loading}
                                           min={minBidAmount}
                                           value={bidAmount}
                                           onChange={(event) => {
                                               setBidAmount(parseInt(event.target.value))
                                           }}
                                           className="form-control form-control-lg rounded-0 fs-2x" id="name"
                                           placeholder="Type the amount" required/>
                                    <span onClick={increaseBidAmount} className="input-group-text bg-hover-success">
                                        <KTIcon iconType="duotone" iconName="plus-circle" className="fs-3x text-dark"/>
                                    </span>
                                </div>
                                {bidError && <div className="mt-3">
                                    <span className="text-danger fs-3">
                                        {bidError}
                                    </span>
                                </div>}
                            </div>

                            <button disabled={loading} type="submit"
                                    className="btn btn-light-success btn-lg rounded-0 col-md-12">
                                {!loading && <span className='indicator-label'>Bid Now</span>}
                                {loading && (
                                    <span className='indicator-progress' style={{display: 'block'}}>
                                        Submitting...
                                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                    </span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>}

                {product.highestBidAmount > 0 && <div className="card me-md-6">
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                        <div ref={biddersRef} className="fs-6x fw-bold">0</div>
                        <div
                            className="fs-1 fw-semibold text-gray-400 mb-7">Bidder{bidders.length > 1 ? "s" : ""}</div>
                        {product.highestBidAmount > 0 &&
                            <div className="symbol-group symbol-hover justify-content-center">
                                {bidders.slice(0, 2).map((bidder, index) => {
                                    return <div className="symbol symbol-35px symbol-circle"
                                                data-bs-toggle="tooltip"
                                                data-bs-original-title={bidder} data-kt-initialized="1">
                                            <span
                                                className={clsx("symbol-label text-inverse-warning fw-bold", backgrounds[index])}>
                                                {bidder[0].toUpperCase()}
                                            </span>
                                    </div>
                                })}

                                {bidders.length > 3 &&
                                    <a href="#" className="symbol symbol-35px symbol-circle" data-bs-toggle="modal"
                                       data-bs-target="#kt_modal_view_users">
                                        <span className="symbol-label bg-dark text-gray-300 fs-8 fw-bold">
                                            +{bidders.length - 3}
                                        </span>
                                    </a>
                                }
                            </div>
                        }
                    </div>
                </div>}
            </div>
        </div>
        {/* end::Row */}
    </>
}

const ShowProduct = () => {
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
            <PageTitle breadcrumbs={breadcrumbs}>View Product</PageTitle>
            <ShowProductPage/>
        </>
    )
}

export {ShowProduct}
