import React from 'react';
import '../styles/navbar.css';
import {Link} from 'react-router-dom';

const Navbar = ({ setShow, size }) => {
    return (
        <nav>
            <div style={{backgroundColor: 'lightblue'}} className="container-fluid my-cart-head">
                <Link to="/" style={{float: 'left', marginLeft: '15px', textDecoration: 'none', color: 'white'}}>
                    <i class="fa-solid fa-house"></i>
                </Link>
                <h3 className="my_shop" onClick={() => setShow(true)}>
                    My Shopping
                </h3>
                <div className="cart" onClick={() => setShow(false)}>
                    <span><i className="fas fa-cart-plus"></i></span>
                    <span>{size}</span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;