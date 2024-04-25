import {Route, Routes} from 'react-router-dom'
import {Products} from "./Products";
import {ShowProduct} from "./ShowProduct";
import {EditProduct} from "../../seller/products/EditProduct";


const ProductsRoutes = () => (
    <Routes>
        <Route>
            <Route path='' element={<Products/>}/>
            <Route path='/:id' element={<ShowProduct/>}/>
            <Route path='/:id/edit' element={<EditProduct/>}/>
            <Route index element={<Products/>}/>
        </Route>
    </Routes>
)

export {ProductsRoutes}
