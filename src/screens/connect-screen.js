import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router";
import {Link} from "react-router-dom";
import SoundSynergyUsers from "../components/soundsynergy-users";
import AnalysisGenres from "../components/analysis-genres";
import ConnectBusiness from "../components/connect-business";

function ConnectScreen() {
    const {currentUser} = useSelector((state) => state.users);


    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <div className="container m-2">
            <div className="row">
                <div className="col-2">
                    <h1>Connect</h1>
                </div>
                <div className="col-10">
                    <ul className="nav nav-tabs" role="tablist">
                        <li className="nav-item" role="presentation">
                            <a className="nav-link active" data-bs-toggle="tab" href="#users" aria-selected="true"
                               role="tab">SoundSynergy Users</a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a className="nav-link" data-bs-toggle="tab" href="#friends" aria-selected="false" role="tab"
                               tabIndex="-1">Businesses</a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a className="nav-link" data-bs-toggle="tab" href="#follows" aria-selected="false" role="tab"
                               tabIndex="-1">Share</a>
                        </li>
                    </ul>
                </div>
            </div>
            <p>Here, you can view all SoundSynergy users, discover new places to listen to music, and connect with friends.</p>
            <div id="myTabContent" className="tab-content">
                <div className="tab-pane fade active show" id="users" role="tabpanel">
                    <SoundSynergyUsers/>
                </div>
                <div className="tab-pane fade" id="friends" role="tabpanel">
                    <ConnectBusiness/>

                </div>
                <div className="tab-pane fade" id="follows" role="tabpanel">
                    <AnalysisGenres/>
                </div>
            </div>
        </div>
    );
}

export default ConnectScreen;