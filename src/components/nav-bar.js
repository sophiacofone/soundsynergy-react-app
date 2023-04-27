import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {useLocation} from "react-router";

export default function NavBar() {

    const { currentUser } = useSelector((state) => state.users);

    const {pathname} = useLocation();
    const paths = pathname.split('/')
    const active = paths[2];

  return (
    <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary p-0">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">SoundSynergy</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarColor01">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <div className="nav-link">
                                <Link to="/"  className={`nav-link ${active === 'home'?'active':''}`}>
                                    <i className="bi bi-house"></i>
                                    <span className=""> Home</span>
                                </Link>
                            </div>
                        </li>
                        <li className="nav-item">
                            <div className="nav-link">
                                <div className="nav-link">
                                    <Link to="/search"  className={`nav-link ${active === 'search'?'active':''}`}>
                                        <i className="bi bi-search"></i>
                                        <span className=""> Search</span>
                                    </Link>
                                </div>
                            </div>
                        </li>
                        <li className="nav-item">
                            <div className="nav-link">
                                <div className="nav-link">
                                    <Link to="/profile"  className={`nav-link ${active === 'profile'?'active':''}`}>
                                        <i className="bi bi-people-fill"></i>
                                        <span className=""> Profile</span>
                                    </Link>
                                </div>
                            </div>
                        </li>
                        {currentUser && (<li className="nav-item">
                            <div className="nav-link">
                                <Link to="/analysis"  className={`nav-link ${active === 'analysis'?'active':''}`}>
                                    <i className="bi bi-bar-chart"></i>
                                    <span className=""> Analysis</span>
                                </Link>
                            </div>
                        </li>)}
                        {!currentUser && (<li className="nav-item">
                            <div className="nav-link">
                                <div className="nav-link">
                                    <Link to="/login"  className={`nav-link ${active === 'login'?'active':''}`}>
                                        <i className="bi bi-person"></i>
                                        <span className=""> Login</span>
                                    </Link>
                                </div>
                            </div>
                        </li>)}
                        {!currentUser && (<li className="nav-item">
                            <div className="nav-link">
                                <div className="nav-link">
                                    <Link to="/register"  className={`nav-link ${active === 'register'?'active':''}`}>
                                        <i className="bi bi-person"></i>
                                        <span className=""> Register</span>
                                    </Link>
                                </div>
                            </div>
                        </li>)}
                        <li className="nav-item">
                            <div className="nav-link">
                                <Link to="/admin"  className={`nav-link ${active === 'admin'?'active':''}`}>
                                    <i className="bi bi-person"></i>
                                    <span className=""> Admin</span>
                                </Link>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </div>
  );
}
