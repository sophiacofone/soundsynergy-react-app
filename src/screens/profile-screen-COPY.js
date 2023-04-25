import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router";
import {Link} from "react-router-dom";

import FriendRequestNotification from "../components/friend-request";

import { io } from "socket.io-client";

import {profileThunk, logoutThunk, updateUserThunk} from "../services/users/users-thunks";

import {findUserById, findUserByUsername} from "../services/users/users-service";
import {findAlbumNameId, findArtistNameId, findLikesByUserId,
    findTrackNameId, findAlbumImageId, findArtistImageId, findTrackImageId} from "../spotify/likes-service";
import {userFollowsUser, findFollowsByFollowerId, findFollowsByFollowedId} from "../services/follows-service";
import {
    findFriendsByUser,
    userSendsFriendRequest,
    userAcceptsFriendRequest,
    userRejectsFriendRequest,
    findFriendRequestsForUser
} from "../services/friends-service";


function ProfileScreen() {
    const {userId} = useParams();
    const {currentUser} = useSelector((state) => state.users);

    const [profile, setProfile] = useState(currentUser);
    const [likes, setLikes] = useState([]);
    const [following, setFollowing] = useState([]);
    const [follows, setFollows] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [friendStatus, setFriendStatus] = useState(false);
    const [friendRequests, setFriendRequests] = useState([]);


    const dispatch = useDispatch();
    const navigate = useNavigate();
    const socket = io("http://localhost:4000");

    const fetchFollowing = async () => {
        const following = await findFollowsByFollowerId(profile._id);
        setFollowing(following);
    };
    const fetchFollowers = async () => {
        const follows = await findFollowsByFollowedId(profile._id);
        setFollows(follows);
    };
    const fetchLikes = async () => {
        const likes = await findLikesByUserId(profile._id);
        const likesData = await Promise.all(
            likes.map(async (like) => {
                let name;
                let image;
                if (like.type === "album") {
                    name = await findAlbumNameId(like.musicThingId)
                    image = await findAlbumImageId(like.musicThingId);
                } else if (like.type === "artist") {
                    name = await findArtistNameId(like.musicThingId)
                    image = await findArtistImageId(like.musicThingId);
                } else if (like.type === "track") {
                    name = await findTrackNameId(like.musicThingId)
                    image = await findTrackImageId(like.musicThingId);
                }
                return {
                    ...like,
                    name,
                    image,
                };
            })
        );
        setLikes(likesData);
    };
    const fetchProfile = async () => {
        if (userId) {
            const user = await findUserById(userId);
            setProfile(user);
            return;
        }
        const response = await dispatch(profileThunk());
        setProfile(response.payload);
    };
    const loadScreen = async () => {
        await fetchProfile();
    };
    const followUser = async () => {
        await userFollowsUser(currentUser._id, profile._id);
    };
    const updateProfile = async () => {
        await dispatch(updateUserThunk(profile));
        setShowModal(false);
    };
    const toggleModal = async () => {
        setShowModal(true);
    };
    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
    };
    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        const foundUser = await findUserByUsername(searchInput);
        if (foundUser) {
            navigate(`/profile/${foundUser._id}`);
        } else {
            alert("User not found");
        }
    };

    useEffect(() => {
        const socket = io("http://localhost:4000");
        return () => {
            socket.disconnect();
        };
    }, []);

    const sendFriendRequest = async () => {
        await userSendsFriendRequest(currentUser._id, profile._id, "Hello, I'd like to be friends!");
        setFriendStatus("pending");

        socket.emit("sendFriendRequest", { user1: currentUser._id, user2: profile._id });
    };

    const acceptFriendRequest = async (request) => {
        await userAcceptsFriendRequest(currentUser._id, request.user1);
        setFriendStatus("accepted");

        socket.emit("acceptFriendRequest", { user1: currentUser._id, user2: request.user1 });

        // Update the friendRequests state
        setFriendRequests((prevRequests) =>
            prevRequests.filter((prevRequest) => prevRequest._id !== request._id)
        );
    };

    const rejectFriendRequest = async (request) => {
        await userRejectsFriendRequest(currentUser._id, request.user1);
        setFriendStatus("rejected");

        socket.emit("rejectFriendRequest", { user1: currentUser._id, user2: request.user1 });

        // Update the friendRequests state
        setFriendRequests((prevRequests) =>
            prevRequests.filter((prevRequest) => prevRequest._id !== request._id)
        );
    };

    const fetchFriendStatus = async () => {
        const friends = await findFriendsByUser(currentUser);
        const friendRecord = friends.find(
            (friend) =>
                (friend.user1 === currentUser && friend.user2 === profile) ||
                (friend.user1 === profile && friend.user2 === currentUser));
        if (friendRecord) {
            setFriendStatus(friendRecord.status);
        }
    };



    const fetchFriendRequests = async () => {
        // Replace this with the function to fetch friend requests from your backend
        const requests = await findFriendRequestsForUser(currentUser._id);
        setFriendRequests(requests);
    };

    useEffect(() => {
        socket.on("friendRequest", (data) => {
            console.log("Friend request received:", data);
            // Update the component state if necessary
        });

        socket.on("friendRequestAccepted", (data) => {
            console.log("Friend request accepted:", data);
            // Update the component state if necessary
        });

        socket.on("friendRequestRejected", (data) => {
            console.log("Friend request rejected:", data);
            // Update the component state if necessary
        });

        // Clean up the connection when the component is unmounted
        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        loadScreen();
        fetchFriendStatus();
    }, [userId]);

    useEffect(() => {
        if (profile && profile._id) {
            fetchLikes();
            fetchFollowing();
            fetchFollowers();
            fetchFriendRequests();
        }
    }, [profile]);

    return (
        <div className="container mt-2">

            <form onSubmit={handleSearchSubmit} className="d-flex mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search for a user: username"
                    value={searchInput}
                    onChange={handleSearchInputChange}
                />
                <button type="submit" className="btn btn-primary ms-2">
                    Search
                </button>
            </form>

            {profile && (
                <div>
                    <div className="row">
                        <div className="col-6">
                            <div className="card border-secondary">
                                <div className="card-header">
                                    {userId === undefined ? "My Profile" : `${profile.firstname}'s Profile`}
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-5">
                                            <div className="mt-2"><i
                                                className="bi bi-people-fill"></i> {profile.city}
                                                <span className="text-muted"> Following</span>
                                            </div>
                                            <div className="mt-2"><i
                                                className="bi bi-people-fill"></i> {profile.city}
                                                <span className="text-muted"> Followers</span>
                                            </div>
                                            <div className="mt-2"><i
                                                className="bi bi-cassette"></i> {profile.city}
                                                <span className="text-muted"> Songs Shared</span>
                                            </div>
                                            {userId === undefined &&
                                                <div>
                                                    <button
                                                        onClick={toggleModal}
                                                        className="btn btn-sm btn-secondary btn-block"
                                                    >
                                                        Update
                                                    </button>
                                                </div>
                                            }
                                            {userId === undefined &&
                                                <div>
                                                    <button
                                                        className="btn btn-sm btn-danger btn-block"
                                                        onClick={() => {
                                                            dispatch(logoutThunk());
                                                            navigate("/login");
                                                        }}
                                                    >
                                                        Logout
                                                    </button>
                                                </div>
                                            }
                                            <div>
                                                {userId !== undefined && (
                                                    <>
                                                        {currentUser ? (
                                                            <button
                                                                onClick={sendFriendRequest}
                                                                className={`btn btn-sm btn-block ${friendStatus === 'accepted' ? 'btn-success' : 'btn-primary'}`}
                                                                disabled={friendStatus === 'pending' || friendStatus === 'accepted'}
                                                            >
                                                                {friendStatus === 'pending' ? 'Request Sent' : friendStatus === 'accepted' ? 'Friends' : 'Add Friend'}
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => alert("Please log in to friend this user.")}
                                                                className="btn btn-sm btn-primary btn-block"
                                                            >
                                                                Follow
                                                            </button>
                                                        )}
                                                        {currentUser ? (
                                                            <button
                                                                onClick={followUser}
                                                                className="btn btn-sm btn-secondary btn-block"
                                                            >
                                                                Follow
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => alert("Please log in to follow this user.")}
                                                                className="btn btn-sm btn-secondary btn-block"
                                                            >
                                                                Follow
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-6">
                            <div className="">
                                <div className="card border-primary">
                                    <div className="card-header">Friend Shares</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="">
                                <div className="card border-primary">
                                    <div className="card-header">Friends</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="card border-primary">
                                <div className="card-header">Friend Requests</div>
                                <div className="card-body">
                                    {friendRequests.map((request) => (
                                        <FriendRequestNotification
                                            key={request._id}
                                            request={request}
                                            onAccept={acceptFriendRequest}
                                            onReject={rejectFriendRequest}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-2">
                        <h4>Favorite Analysis</h4>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfileScreen;