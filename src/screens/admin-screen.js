import React from "react";

import AdminUsers from "../components/admin-users";
import AdminFriends from "../components/admin-friends";


function AdminScreen() {
    return (
        <div className="container m-2">
            <h1>Administration Page</h1>
            <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item" role="presentation">
                    <a className="nav-link active" data-bs-toggle="tab" href="#users" aria-selected="true"
                       role="tab">Users</a>
                </li>
                <li className="nav-item" role="presentation">
                    <a className="nav-link" data-bs-toggle="tab" href="#friends" aria-selected="false" role="tab"
                       tabIndex="-1">Friends</a>
                </li>
                <li className="nav-item" role="presentation">
                    <a className="nav-link" data-bs-toggle="tab" href="#follows" aria-selected="false" role="tab"
                       tabIndex="-1">Follows</a>
                </li>
            </ul>
            <div id="myTabContent" className="tab-content">
                <div className="tab-pane fade active show" id="users" role="tabpanel">
                    <AdminUsers/>
                </div>
                <div className="tab-pane fade" id="friends" role="tabpanel">
                    <AdminFriends/>
                </div>
                <div className="tab-pane fade" id="follows" role="tabpanel">

                </div>
            </div>
        </div>
    );
}

export default AdminScreen;
