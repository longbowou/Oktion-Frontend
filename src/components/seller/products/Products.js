import {PageTitle} from "../../../_metronic/layout/core";
import {KTIcon} from "../../../_metronic/helpers";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import clsx from "clsx";
import {apiDelete, apiGet} from "../../common/apiService";
import {API_URL, DELETE_PRODUCT_URL, PRODUCTS_URL} from "../../common/apiUrl";
import {useSuccessMessage} from "../../auth/AuthProvider";

const ProductsPage = () => {
    const {messageSuccess} = useSuccessMessage();

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [isFiltering, setIsFiltering] = useState(false)
    const [search, setSearch] = useState("");

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
        let url = PRODUCTS_URL;
        if (text && text.trim() !== "") {
            url += `?search=${text}`
            setIsFiltering(true)
        }
        setLoading(true)
        apiGet(url)
            .then((response) => {
                console.log(text, response.data.data)
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

    function deleteProduct(object) {
        // eslint-disable-next-line no-restricted-globals
        if (confirm(`Do you really want to delete "${object.name}" ?`)) {
            apiDelete(DELETE_PRODUCT_URL.replace("{id}", object.id))
                .then((response) => {
                    console.log(response)
                    fetchProducts()
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                }).finally(() => {
            });
        }
    }

    return <>
        {/* begin::Row */}
        {messageSuccess ? (
            <div className='mb-lg-15 alert alert-success'>
                <div className='alert-text font-weight-bold'>{messageSuccess}</div>
            </div>
        ) : ""}
        <div className='row g-5 g-xl-10 mb-5 mb-xl-10 justify-content-center'>
            <div className="card">
                <div className="card-header border-0 pt-6">
                    <div className="card-title">
                        <div className="d-flex align-items-center position-relative my-1">
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
                                   className="form-control form-control-lg border-2 w-450px ps-14"
                                   placeholder="Search a product" value={search}/>
                            <span onClick={() => {
                                setSearch("")
                            }}
                                  className={clsx("btn btn-flush btn-active-color-primary position-absolute top-50 end-0 translate-middle-y lh-0 me-5", search.trim() === "" && "d-none")}>
                                    <KTIcon iconType="duotone" iconName="cross-circle" className="fs-1"/>
                            </span>
                        </div>
                    </div>
                    <div className="card-toolbar">
                        <div className="d-flex justify-content-end" id="data-kt-docs-table-toolbar-base"
                             data-kt-docs-table-toolbar="base">
                            <Link to="/products/add" className="btn btn-light-dark me-3">
                                <KTIcon iconType="duotone" iconName="double-right" className="fs-2"/>
                                Add Product
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="card-body pt-0">
                    <table id="kt_datatable_example_1"
                           className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer">
                        <thead>
                        <tr className="text-start text-gray-900 fw-bolder fs-7 text-uppercase gs-0 ">
                            <th style={{width: '25%'}}>Name</th>
                            <th className="text-center">Status</th>
                            <th className="text-center">Price</th>
                            <th className="text-center">Bid Start Price</th>
                            <th className="text-center">Deposit</th>
                            <th className="text-center">Highest Bid</th>
                            <th style={{width: '10%'}}>Bid Due Date</th>
                            <th style={{width: '12%'}}>Bid Payment Due Date</th>
                            <th className="text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="text-gray-800 fw-bold">
                        {products.map((object) => {
                            function statusBadgeColor() {
                                switch (object.status) {
                                    case "Running":
                                        return "badge-light-warning"
                                    case "Closed":
                                        return "badge-light-danger"
                                    case "Sold":
                                        return "badge-light-success"
                                    case "Saved":
                                        return "badge-light-dark"
                                    default:
                                        return "badge-light-info"
                                }
                            }

                            return <>
                                <tr className="" key={object.id}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <Link to={`/products/${object.id}`} className="symbol symbol-70px">
                                                {object.images.length > 0 ?
                                                    <span className="symbol-label"
                                                          style={{backgroundImage: `url("${API_URL}/products/images/${object.images[0].path}")`}}></span> :
                                                    <span className="symbol-label">{object.name[0]}</span>}
                                            </Link>

                                            <div className="ms-5">
                                                <Link to={`/products/${object.id}`}
                                                      className="text-gray-800 text-hover-primary fs-5 fw-bold"
                                                      data-kt-ecommerce-product-filter="product_name">
                                                    {object.name}
                                                </Link>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-center pe-0">
                                        <div
                                            className={clsx('badge badge-lg mb-2', statusBadgeColor())}>
                                            {object.status}
                                        </div>
                                    </td>
                                    <td className="text-center pe-0">
                                        <span
                                            className="fs-6 fw-semibold text-gray-400">$</span>
                                        {object.price.toLocaleString('en-US')}
                                    </td>
                                    <td className="text-center pe-0">
                                        <span
                                            className="fs-6 fw-semibold text-gray-400">$</span>
                                        {object.bidStartingPrice.toLocaleString('en-US')}
                                    </td>
                                    <td className="text-center pe-0">
                                        <span
                                            className="fs-6 fw-semibold text-gray-400">$</span>
                                        {object.depositAmount.toLocaleString('en-US')}
                                        <div>
                                            {object.deposit}%
                                        </div>
                                    </td>
                                    <td className="text-center pe-0">
                                        {object.highestBidAmount > 0 ?
                                            <><span
                                                className="fs-6 fw-semibold text-gray-400">$</span>{object.highestBidAmount.toLocaleString('en-US')}
                                            </> : "-"}
                                        <div>
                                            {object.highestBidUser && object.highestBidUser.name}
                                        </div>
                                    </td>
                                    <td className="pe-0">
                                        {/*{object.bidDueDate }*/}
                                        {new Date(object.bidDueDate).toLocaleString('en-us', {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: "numeric",
                                            minute: "numeric",
                                        })}
                                    </td>
                                    <td className="pe-0">
                                        {/*{object.biddingPaymentDueDate}*/}
                                        {new Date(object.biddingPaymentDueDate).toLocaleString('en-us', {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: "numeric",
                                            minute: "numeric",
                                        })}

                                    </td>
                                    <td className="text-center">
                                        <Link to={`/products/${object.id}`}
                                              className="btn btn-icon btn-sm btn-light-success me-5">
                                            <KTIcon iconType="duotone" iconName="eye" className="fs-2x "/>
                                        </Link>

                                        {object.status === "Saved" &&
                                            <Link to={`/products/${object.id}/edit`}
                                                  className="btn btn-icon btn-sm btn-light-primary me-5">
                                                <KTIcon iconType="duotone" iconName="notepad-edit" className="fs-2x"/>
                                            </Link>
                                        }

                                        {object.status === "Saved" &&
                                            <button onClick={() => {
                                                deleteProduct(object)
                                            }}
                                                    className="btn btn-icon btn-sm btn-light-danger me-5">
                                                <KTIcon iconType="duotone" iconName="trash" className="fs-2x "/>
                                            </button>}
                                    </td>
                                </tr>
                            </>
                        })}
                        </tbody>
                    </table>

                    {products.length === 0 &&
                        <div className="text-center mt-20">
                            <KTIcon iconType="duotone" iconName="crown-2" className="fs-6x"/>
                            <p className="text-muted fs-4 mt-10 text-center">
                                Ready to boost your sales? <br/>
                                Consider adding more products! It's an easy way to
                                attract more customers and increase revenue. <br/>
                                We're here to support you every step of the way.
                            </p>
                        </div>}
                    {products.length > 0 &&
                        <div className="row">
                            <div
                                className="col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start">
                            </div>
                            <div
                                className="col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end">
                                <div className="dataTables_paginate paging_simple_numbers"
                                     id="kt_ecommerce_products_table_paginate">
                                    <ul className="pagination">
                                        <li key="1" className="paginate_button page-item previous disabled"
                                            id="kt_ecommerce_products_table_previous">
                                            <a href="#"
                                               aria-controls="kt_ecommerce_products_table"
                                               data-dt-idx="0" tabIndex="0"
                                               className="page-link"><i
                                                className="previous"></i>
                                            </a>
                                        </li>
                                        <li key="2" className="paginate_button page-item active">
                                            <a href="#"
                                               aria-controls="kt_ecommerce_products_table"
                                               data-dt-idx="1" tabIndex="0"
                                               className="page-link">1
                                            </a>
                                        </li>
                                        <li key="3" className="paginate_button page-item next disabled"
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
                        </div>}
                </div>
            </div>
        </div>
        {/* end::Row */}
    </>
}

const Products = () => {
    return (
        <>
            <PageTitle breadcrumbs={[]}>Products</PageTitle>
            <ProductsPage/>
        </>
    )
}

export {Products}
