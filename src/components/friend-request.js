import React, { useEffect, useState } from "react";
import { findUserById } from "../services/users/users-service";

function FriendRequestNotification({ request, onAccept, onReject }) {
    const { user1, status } = request;
    const [username, setUsername] = useState("");

    useEffect(() => {
        const fetchUsername = async () => {
            const user = await findUserById(user1);
            setUsername(user.username);
        };

        fetchUsername();
    }, [user1]);

    return (
        <div className="friend-request">
            <p>Friend request from {username}</p>
            {status === "pending" && (
                <div>
                    <button className="btn btn-primary" onClick={() => onAccept(request)}>Accept</button>
                    <button className="btn btn-danger" onClick={() => onReject(request)}>Reject</button>
                </div>
            )}
            {status === "accepted" && <p>Request accepted</p>}
            {status === "rejected" && <p>Request rejected</p>}
        </div>
    );
}

export default FriendRequestNotification;
