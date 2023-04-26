import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router";
import {Link} from "react-router-dom";

import FriendRequestNotification from "../components/friend-request";

import {profileThunk, logoutThunk, updateUserThunk} from "../services/users/users-thunks";

import {findUserById, findUserByUsername} from "../services/users/users-service";
import {findAlbumNameId, findArtistNameId, findLikesByUserId,
    findTrackNameId, findAlbumImageId, findArtistImageId, findTrackImageId} from "../spotify/likes-service";
import {userFollowsUser, findFollowsByFollowerId, findFollowsByFollowedId, userUnfollowsUser} from "../services/follows-service";
import {
    findFriendsByUser,
    userSendsFriendRequest,
    userAcceptsFriendRequest,
    userRejectsFriendRequest,
    findFriendRequestsForUser, userUnfriendsUser
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
    const [friends, setFriends] = useState([]);
    const [followStatus, setFollowStatus] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

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
    const unfollowUser = async () => {
        await userUnfollowsUser(currentUser._id, profile._id);
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

    const sendFriendRequest = async () => {
        await userSendsFriendRequest(currentUser._id, profile._id, "Hello, I'd like to be friends!");
        setFriendStatus("pending");
    };

    const unfriendUser = async () => {
        await userUnfriendsUser(currentUser._id, profile._id);
        setFriendStatus(false);
        // Update the friends state
        setFriends((prevFriends) => prevFriends.filter((prevFriend) => prevFriend._id !== profile._id));
    }

    const acceptFriendRequest = async (request) => {
        await userAcceptsFriendRequest(currentUser._id, request.user1);
        setFriendStatus("accepted");
        // Update the friendRequests state
        setFriendRequests((prevRequests) =>
            prevRequests.filter((prevRequest) => prevRequest._id !== request._id)
        );
    };

    const rejectFriendRequest = async (request) => {
        await userRejectsFriendRequest(currentUser._id, request.user1);
        setFriendStatus("rejected");
        // Update the friendRequests state
        setFriendRequests((prevRequests) =>
            prevRequests.filter((prevRequest) => prevRequest._id !== request._id)
        );
    };

    const fetchFriendStatus = async () => {
        const friends = await findFriendsByUser(currentUser._id);
        const friendRecord = friends.find(
            (friend) =>
                (friend.user1 === currentUser._id && friend.user2 === profile._id) ||
                (friend.user1 === profile._id && friend.user2 === currentUser._id)
        );
        if (friendRecord) {
            setFriendStatus(friendRecord.status);
        }
    };

    const fetchFollowStatus = async () => {
        const follows = await findFollowsByFollowerId(currentUser._id);
        const followRecord = follows.find((follow) => follow.followed._id === profile._id);
        if (followRecord) {
            setFollowStatus(true);
        }
    }

    const fetchFriends = async () => {
        // 1. Fetch all the friendObjects for the user.
        const friendObjects = await findFriendsByUser(profile._id);

        // 2. Filter the friendObjects array to only include the ones where the status is "accepted".
        const acceptedFriendObjects = friendObjects.filter((friend) => friend.status === "accepted");

        // 3. For each of the filtered friendObjects, determine which user ID is the friend's ID (the user that is not the current user).
        const friendIds = acceptedFriendObjects.map((friend) => friend.user1 === profile._id ? friend.user2 : friend.user1);

        // 4. Fetch the username for each friend's ID.
        const friendDataPromises = friendIds.map(async (friendId) => {
            const friendData = await findUserById(friendId);
            return friendData;
        });

        const friendData = await Promise.all(friendDataPromises);

        // 5. Return the finalized list of friend objects with the usernames.
        setFriends(friendData.map((friend, index) => ({...acceptedFriendObjects[index], username: friend.username})));
    };

    const fetchFriendRequests = async () => {
        // Replace this with the function to fetch friend requests from your backend
        const requests = await findFriendRequestsForUser(currentUser._id);
        setFriendRequests(requests);
    };

    useEffect(() => {
        loadScreen();
    }, [userId]);

    useEffect(() => {
        if (profile && profile._id) {
            fetchLikes();
            fetchFollowing();
            fetchFollowers();
            fetchFriendRequests();
            fetchFriends();
            fetchFriendStatus();
            fetchFollowStatus();
        }
    }, [profile]);
    console.log(followStatus)
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
                            <div className="card border-primary">
                                <div className="card-header">Friends</div>
                                <div className="card-body">
                                    {friends.map((friend) => (
                                        <div key={friend._id}>
                                            <Link to={`/profile/${friend._id}`}>
                                                {friend.username}
                                            </Link>
                                        </div>
                                    ))}
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