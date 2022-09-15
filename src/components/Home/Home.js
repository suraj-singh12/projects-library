import React from 'react';
import './home.css';
import Images from '../img-assets/images';
import { Link } from 'react-router-dom';
class Home extends React.Component {
    overlay;
    removeOverlay = () => {
        setTimeout(this.slowlyRemoveOverlay, 3000);
    }

    slowlyRemoveOverlay = () => {
        this.overlay.style.display = 'none';
        console.log('Overlay removed');
    }

    render() {
        return (
            <>
                <div className="home">
                    <div className="overlay">
                        <p className="welcome">Welcome To My Projects Library</p>
                    </div>

                    <h1>My Projects</h1>
                    <div>
                        <Link to="/calc">
                            <div className="projects">
                                <img src={Images['calculator']} alt="calculator" />
                            </div>
                        </Link>
                        <Link to="cart">
                            <div className="projects">
                                <img src={Images['cart']} alt="cart" />
                            </div>
                        </Link>
                    </div>

                    <div className="copyright2">
                        <p>Made With &hearts;</p>
                        <a href="https://github.com/suraj-singh12/" target="_blank" rel="noreferrer">@suraj-singh12 (Suraj Singh)</a>
                    </div>
                </div>
            </>
        )
    }

    componentDidMount() {
        document.getElementsByClassName('overlay')[0].addEventListener('mouseover', this.removeOverlay);
        this.overlay = document.getElementsByClassName('overlay')[0];
    }
}

export default Home;