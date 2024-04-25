import axios from "axios";
import {API_URL} from "./apiUrl";
import {setupAxios} from "../auth/AuthHelpers";

const axiosInstance = axios.create({
    baseURL: API_URL
});

setupAxios(axiosInstance);

export const apiGet = (url, params) => {
    return axiosInstance.get(url, {params});
};

export const apiPost = (url, data) => {
    return axiosInstance.post(url, data);
};

export const apiPut = (url, data) => {
    return axiosInstance.put(url, data);
};

export const apiDelete = (url) => {
    return axiosInstance.delete(url);
};

// You can add more functions for other HTTP methods (PUT, DELETE, etc.) as needed
export default axiosInstance;