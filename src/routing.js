import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import Home from './component/Home/Home';
import BasicCalculator from './component/calc/BasicCalculator';
import ScientificCalculator from './component/calc/ScientificCalculator';

const Routing =  () => {
    return (
        <BrowserRouter>
            <Route exact path='/' component={Home} />
            <Route path="/calc1" component={BasicCalculator} />
            <Route path="/calc2" component={ScientificCalculator} />
        </BrowserRouter>
    )
}

export default Routing;