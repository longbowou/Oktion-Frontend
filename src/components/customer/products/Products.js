import {useEffect, useState} from "react";
import {KTIcon} from "../../../_metronic/helpers";
import {PageTitle} from "../../../_metronic/layout/core";
import {Link} from "react-router-dom";
import {apiGet} from "../../common/apiService";
import clsx from "clsx";
import {API_URL, CUSTOMER_PRODUCTS_URL} from "../../common/apiUrl";
import timeAgo from "../../common/timeAgo";

const ProductsPage = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [isFiltering, setIsFiltering] = useState(false)
    const [search, setSearch] = useState("")

    useEffect(() => {
        fetchProducts()

        const intervalId = setInterval(fetchProducts, 5000);
        return () => {
            clearInterval(intervalId);
        };
    }, []);


    useEffect(() => {
        fetchProducts(search)
    }, [search])

    function fetchProducts(text) {
        let url = CUSTOMER_PRODUCTS_URL;
        if (text && text.trim() !== "") {
            url += `?search=${text}`
            setIsFiltering(true)
        }
        setLoading(true)
        apiGet(url)
            .then((response) => {
                if (response.data.data.length > 0) {
                    setProducts(response.data.data);
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            }).finally(() => {
            setLoading(false)
            setIsFiltering(false)
        });
    }

    return <>
        {/* begin::Row */}
        <div className='row g-5 g-xl-10 mb-5 mb-xl-10 justify-content-center'>
            <div className="card p-0 bg-transparent border-0 shadow-none">
                <div className="card-header border-0 pt-6">
                    <div className="card-title">
                        {products.length > 0 && <div className="d-flex align-items-center position-relative my-1">
                            {loading && isFiltering ?
                                <span className='indicator-progress position-absolute ms-3'
                                      style={{display: 'block'}}>
                                    <span
                                        className={clsx('spinner-border spinner-border-lg align-middle ms-2')}></span>
                                </span>
                                :
                                <KTIcon iconType="duotone" iconName="magnifier"
                                        className="position-absolute ms-6 fs-1"/>
                            }

                            <input onChange={(event) => {
                                setSearch(event.target.value)
                            }} type="text" id="data-kt-docs-table-filter-search" data-kt-docs-table-filter="search"
                                   className="form-control rounded-0 form-control-lg border-2 w-450px ps-14"
                                   placeholder="Search a product" value={search}/>
                            <span onClick={() => {
                                setSearch("")
                            }}
                                  className={clsx("btn btn-flush btn-active-color-primary position-absolute top-50 end-0 translate-middle-y lh-0 me-5", search.trim() === "" && "d-none")}>
                                    <KTIcon iconType="duotone" iconName="cross-circle" className="fs-1"/>
                            </span>
                        </div>}
                    </div>
                    <div className="card-toolbar">
                        <div className="d-flex justify-content-end" id="data-kt-docs-table-toolbar-base"
                             data-kt-docs-table-toolbar="base">
                        </div>
                    </div>
                </div>
                <div className="card-body row pt-3">
                    {products.map((object) => {
                        function statusBadgeColor() {
                            switch (object.status) {
                                case "Running":
                                    return "badge-light-warning"
                                case "Closed":
                                    return "badge-light-danger"
                                case "Sold":
                                    return "badge-light-success"
                                default:
                                    return "badge-light-info"
                            }
                        }

                        return <>
                            <div key={object.id} className="col-sm-12 col-md-4 mb-5">
                                <div className="card rounded-0 h-100" key={object.id}>
                                    <div className="card-body p-5 mb-0 pb-0">
                                        <Link className="d-block overlay" data-fslightbox="lightbox-hot-sales"
                                              to={`/products/${object.id}`}>
                                            {object.images && object.images.length > 0 &&
                                                <div
                                                    className="overlay-wrapper bgi-no-repeat bgi-position-center bgi-size-cover card-rounded min-h-175px"
                                                    style={{backgroundImage: `url("${API_URL}/products/images/${object.images[0].path}")`}}>
                                                </div>}
                                        </Link>

                                        <div className="mt-5">
                                            <Link to={`/products/${object.id}`}
                                                  className="fs-4 text-dark fw-bold text-hover-primary text-dark lh-base">
                                                {object.name}
                                            </Link>

                                            <div className="mt-4">
                                                <div
                                                    className={clsx('badge badge-lg fs-3 p-2', statusBadgeColor())}>
                                                    {object.status === "Sold" ? "Won" : (object.status === "Sold & Paid" ? "Won & Paid" : object.status)}
                                                </div>
                                            </div>

                                            <div className="fs-5 fw-bold mt-3">
                                                    <span
                                                        className="text-muted">{object.status === "Running" ? "Will en" : ""} </span>
                                                <span
                                                    className="text-gray-700 text-hover-primary"> {timeAgo.format(new Date(object?.bidDueDate))}</span>
                                            </div>

                                            <div className="mb-2">
                                                    <span
                                                        className="text-muted fw-semibold fs-5">{new Date(object?.bidDueDate).toLocaleString('en-us', {
                                                        weekday: "long",
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                        hour: "numeric",
                                                        minute: "numeric",
                                                    })}</span>
                                            </div>

                                            <div className="mb-3">
                                                {object.categories.map((object) => {
                                                    return <span key={object.id}
                                                                 className={clsx('badge badge-light-dark p-2 me-2')}>
                                                        {object.name}
                                                            </span>
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer p-5 pt-0">
                                        <div className="fs-6 fw-bold mt-5 d-flex flex-stack">
                                                <span className="badge fs-2 fw-bold text-dark">
                                                    <span className="fs-4 fw-semibold text-gray-400">$</span>
                                                    {object?.highestBidAmount > 0 ? object?.highestBidAmount.toLocaleString('en-US') : object.bidStartingPrice.toLocaleString('en-US')}
                                                </span>

                                            {object.status === "Running" && <Link to={`/products/${object.id}`}
                                                                                  className="btn btn-sm btn-light-success rounded-0 fs-5">
                                                Bid Now
                                            </Link>}
                                            {["Sold", "Sold & Paid"].includes(object.status) && <>
                                                <KTIcon iconType="duotone" iconName="medal-star"
                                                        className={clsx("fs-2x", object.status === "Sold" ? "text-success" : "text-info")}/>
                                            </>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>;
                    })}

                    {products.length === 0 &&
                        <div className="text-center mt-20">
                            <KTIcon iconType="duotone" iconName="crown-2" className="fs-6x"/>
                            <p className="text-muted fs-4 mt-10">
                                Great news! We have some exciting new products on the way. <br/>
                                We kindly request your patience as we prepare to unveil them. <br/>
                                Stay tuned for updates, and thank you for your understanding.
                            </p>
                        </div>}
                </div>
            </div>

            {products.length > 0 && <ul className="pagination pagination-circle pagination-outline mt-5">
                <li key={1} className="page-item first disabled m-1">
                    <a href="#" className="page-link px-0">
                        <i className="ki-duotone ki-double-left fs-2x"><span className="path1"></span><span
                            className="path2"></span></i>
                    </a>
                </li>
                <li key={2} className="page-item m-1 active"><a href="#" className="page-link fs-2">1</a></li>
                <li key={3} className="page-item last disabled m-1">
                    <a href="#" className="page-link px-0">
                        <i className="ki-duotone ki-double-right fs-2x"><span className="path1"></span><span
                            className="path2"></span></i>
                    </a>
                </li>
            </ul>}

        </div>
        {/* end::Row */}
    </>
}

const Products = () => {
    return (
        <>
            <PageTitle breadcrumbs={[]}>Products </PageTitle>
            <ProductsPage/>
        </>
    )
}

export {Products}
