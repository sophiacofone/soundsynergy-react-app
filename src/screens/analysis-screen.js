import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router";
import {Link} from "react-router-dom";

function AnalysisScreen() {
    const {currentUser} = useSelector((state) => state.users);


    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <div>
            hi
        </div>
    );
}

export default AnalysisScreen;