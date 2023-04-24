import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router";
import {Link} from "react-router-dom";

function HomeScreen() {
    const {currentUser} = useSelector((state) => state.users);


    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <div>
            <div className="card m-3">
                <h3 className="card-header text-center">Welcome to SoundSynergy!</h3>
                <div className="card-body">
                    <h5 className="card-title text-center">SoundSynergy lets you explore your music, connect with
                        friends that share your taste, and discover new places to meet other music lovers like you <i className="bi bi-music-note-beamed"></i>
                    </h5>

                </div>
                <div className="card-body p-1">
                    {currentUser === null && (
                    <div>
                        <h6 className="card-subtitle text-muted text-center"><i className="bi bi-stars"></i>See what's
                            possible with SoundSynergy, and log in!
                            <i className="bi bi-stars"></i>
                            <div className="mt-2">
                                <Link to="/login"  className='btn btn-primary'> Log in »</Link>
                            </div>
                        </h6>
                    </div>
                    )}
                </div>
                <div className="card-body">
                    <div className="container marketing">
                        <div className="row">
                            <div className="col-lg-4 text-center">
                                <h2 className="fw-normal">Explore</h2>
                                <p>See stats on your listening history, most popular genres, and more.</p>
                                {currentUser ? (
                                    <Link to="/analysis" className="btn btn-secondary">
                                        <span className="">Analyze »</span>
                                    </Link>
                                ) : (
                                    <button className="btn btn-secondary">Please log in »</button>
                                )}
                            </div>
                            <div className="col-lg-4 text-center">
                                <h2 className="fw-normal">Connect</h2>
                                <p>Search for any song, and see which of your friends are most likely to enjoy it.</p>
                                <Link to="/search"  className='btn btn-secondary'>
                                    <span className=""> Search »</span>
                                </Link>
                            </div>
                            <div className="col-lg-4 text-center">
                                <h2 className="fw-normal">Discover</h2>
                                <p>Learn about local restaurants, cafes, and shops that play music you will love. </p>
                                <Link to="/analysis"  className='btn btn-secondary'>
                                    <span className=""> Discover »</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-footer text-muted">
                    Sound Synergy - Home
                </div>
            </div>
        </div>
    );
}

export default HomeScreen;
