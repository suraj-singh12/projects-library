import React from 'react';
import list from '../data';
import Cards from './card';
import '../styles/home.css';

const Home = ({ handleClick }) => {
    return (
        <div className="container" style={{textAlign: 'center'}}>
            <div className="container-fluid" style={{textAlign:'center', padding:'1%', fontSize:'1.8rem'}}>
                <p>Our Items</p>
            </div>
            {list.map((item) => (
                <Cards key={item.id} item={item} handleClick={handleClick} />
            ))}
            <div className="copyright3">
                <p>Made With &hearts;</p>
                <a href="https://github.com/suraj-singh12" target="_blank" rel="noopener noreferrer">@suraj-singh (Suraj Singh)</a>
            </div>
        </div>
    );
};

export default Home;