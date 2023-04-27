import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router";
import {Link} from "react-router-dom";
import SoundSynergyUsers from "../components/soundsynergy-users";
import AnalysisFollowers from "../components/analysis-followers";
import AnalysisGenres from "../components/analysis-genres";

function AnalysisScreen() {
    const {currentUser} = useSelector((state) => state.users);


    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <div className="container m-2">
            <div className="row">
                <div className="col-2">
                    <h1>Analysis</h1>
                </div>
                <div className="col-10">
                    <ul className="nav nav-tabs" role="tablist">
                        <li className="nav-item" role="presentation">
                            <a className="nav-link active" data-bs-toggle="tab" href="#users" aria-selected="true"
                               role="tab">SoundSynergy Users</a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a className="nav-link" data-bs-toggle="tab" href="#friends" aria-selected="false" role="tab"
                               tabIndex="-1">My Followers</a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a className="nav-link" data-bs-toggle="tab" href="#follows" aria-selected="false" role="tab"
                               tabIndex="-1">My Genres</a>
                        </li>
                    </ul>
                </div>
            </div>
            <p>Here, you can view all SoundSynergy users, see what kind of music your follower's listen to, and edit your top genres.</p>
            <div id="myTabContent" className="tab-content">
                <div className="tab-pane fade active show" id="users" role="tabpanel">
                    <SoundSynergyUsers/>
                </div>
                <div className="tab-pane fade" id="friends" role="tabpanel">
                    <AnalysisFollowers/>

                </div>
                <div className="tab-pane fade" id="follows" role="tabpanel">
                    <AnalysisGenres/>
                </div>
            </div>
        </div>
    );
}

export default AnalysisScreen;