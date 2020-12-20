import React from 'react'
import AppAppBar from './views/AppAppBar';
import Product from './views/Product';
import ProductValues from './views/ProductValues';
import ProductCategories from './views/ProductCategories';
import Pricing from './views/Pricing';


const Home = () => {
    return (
        <React.Fragment>
            <AppAppBar />
            <Product />
            <ProductValues />
            <ProductCategories />
            <Pricing />
        </React.Fragment>

        )
}

export default Home
