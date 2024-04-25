import {ADD_PRODUCT_URL, CATEGORIES_URL, UPLOAD_PRODUCT_IMAGE_URL} from "../common/apiUrl";
import {apiGet, apiPost, apiPut} from "../common/apiService";

export function fetchCategories() {
    return apiGet(CATEGORIES_URL)
}

export function addProduct(data) {
    return apiPost(ADD_PRODUCT_URL, data)
}

export function editProduct(data) {
    return apiPut(ADD_PRODUCT_URL, data)
}

export function addUploadImage(id, data) {
    return apiPost(UPLOAD_PRODUCT_IMAGE_URL.replace("{id}", id), data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
}

