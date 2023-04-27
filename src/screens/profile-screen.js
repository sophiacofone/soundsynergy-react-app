import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router";
import {Link} from "react-router-dom";

import FriendRequestNotification from "../components/friend-request";

import {profileThunk, logoutThunk, updateUserThunk} from "../services/users/users-thunks";

import {findUserById, findUserByUsername} from "../services/users/users-service";
import {findAlbumNameId, findArtistNameId, findLikesByUserId, findTrackNameId, findAlbumImageId, findArtistImageId, findTrackImageId, findArtistGenreId, findTrackGenreId} from "../spotify/likes-service";
import {userFollowsUser, findFollowsByFollowerId, findFollowsByFollowedId, userUnfollowsUser} from "../services/follows-service";
import {findFriendsByUser, userSendsFriendRequest, userAcceptsFriendRequest, userRejectsFriendRequest, findFriendRequestsForUser, userUnfriendsUser} from "../services/friends-service";
import {findSharedItemsByShareReceiver} from "../services/shared-service";

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
    const [sharedItems, setSharedItems] = useState([]);
    const [likedGenres, setLikedGenres] = useState([]);


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
                let genre;
                if (like.type === "album") {
                    name = await findAlbumNameId(like.musicThingId)
                    image = await findAlbumImageId(like.musicThingId);
                } else if (like.type === "artist") {
                    name = await findArtistNameId(like.musicThingId)
                    image = await findArtistImageId(like.musicThingId);
                    genre = await findArtistGenreId(like.musicThingId);
                } else if (like.type === "track") {
                    name = await findTrackNameId(like.musicThingId)
                    image = await findTrackImageId(like.musicThingId);
                    genre = await findTrackGenreId(like.musicThingId);
                }
                return {
                    ...like,
                    name,
                    image,
                    genre,
                };
            })
        );
        setLikes(likesData);

        const genresSet = new Set();

        likesData.forEach((like) => {
            if (like.genre) {
                like.genre.forEach((genre) => {
                    genresSet.add(genre);
                });
            }
        });

        const uniqueGenres = Array.from(genresSet);
        setLikedGenres(uniqueGenres);
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
    const fetchSharedItems = async () => {
        const sharedItemsData = await findSharedItemsByShareReceiver(profile._id);
        const sharedItemsDataImg = await Promise.all(
            sharedItemsData.map(async (sharedItemsData) => {
                let imageShared;
                if (sharedItemsData.type === "album") {
                    imageShared = await findAlbumImageId(sharedItemsData.musicThingId);
                } else if (sharedItemsData.type === "artist") {
                    imageShared = await findArtistImageId(sharedItemsData.musicThingId);
                } else if (sharedItemsData.type === "track") {
                    imageShared = await findTrackImageId(sharedItemsData.musicThingId);
                }
                return {
                    ...sharedItemsData,
                    imageShared,
                };
            })
        );
        const sharedItemsDataImgName = await Promise.all(
            sharedItemsDataImg.map(async (sharedItemsDataImg) => {
                const nameShared = await findUserById(sharedItemsDataImg.sharer);
                return {
                    ...sharedItemsDataImg,
                    nameShared,
                }
            })
        );
        setSharedItems(sharedItemsDataImgName);
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
            fetchSharedItems();
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
                                        <div className="col-7">
                                            <h2 className="mb-0">{profile.firstname} {profile.lastname}</h2>
                                            <div className="mb-0">@{profile.username}</div>
                                            <div className="mt-2">{profile.bio}</div>
                                            <div>
                                                <i className="bi bi-geo-alt-fill" style={{ marginRight: '5px' }}></i>
                                                <span className="text-muted">
                                                {profile.city}, {profile.country}
                                                </span>
                                            </div>
                                            <div>
                                                <i className="bi bi-calendar3" style={{ marginRight: '5px' }}></i>
                                                 <span className="text-muted">
                                                     Joined {new Date(profile.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                 </span>
                                            </div>
                                        </div>
                                        <div className="col-5">
                                            {profile.role === "USER" ? (
                                                <div className="mt-2"><i
                                                    className="bi bi-people-fill"></i> {friends.length}
                                                    <span className="text-muted"> Friends</span>
                                                </div>
                                            ): null}
                                            {profile.role === "USER" ? (
                                                <div className="mt-2"><i
                                                    className="bi bi-people-fill"></i> {following.length}
                                                    <span className="text-muted"> Following</span>
                                                </div>
                                            ): null}
                                            {profile.role === "BUSINESS" ? (
                                                <div className="mt-2"><i
                                                    className="bi bi-people-fill"></i> {follows.length}
                                                    <span className="text-muted"> Followers</span>
                                                </div>
                                            ): null}
                                            {profile.role === "USER" || "BUSINESS" ? (
                                                <div className="mt-2 mb-2"><i
                                                    className="bi bi-cassette"></i> {likes.length}
                                                    <span className="text-muted"> Likes </span>
                                                </div>
                                            ): null}
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
                                                {userId !== undefined && currentUser.role === "USER" && profile.role === "USER" &&  (
                                                    <>
                                                        {currentUser !== null && friendStatus === "pending" ? (
                                                            <button
                                                                onClick={sendFriendRequest}
                                                                className="btn btn-sm btn-primary btn-block disabled"
                                                            >
                                                                Pending
                                                            </button>
                                                        ) : currentUser !== null && friendStatus === null ? (
                                                            <button
                                                                onClick={() => alert("Please log in to friend this user.")}
                                                                className="btn btn-sm btn-primary btn-block"
                                                            >
                                                                Add Friend
                                                            </button>
                                                        ) : currentUser !== null && friendStatus === "accepted" ? (
                                                            <button
                                                                onClick={unfriendUser}
                                                                className="btn btn-sm btn-danger btn-block"
                                                            >
                                                                Unfriend
                                                            </button>
                                                        ) : currentUser !== null && friendStatus === "rejected" ? (
                                                            <button
                                                                onClick={sendFriendRequest}
                                                                className="btn btn-sm btn-primary btn-block disabled"
                                                            >
                                                                Rejected
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={sendFriendRequest}
                                                                className="btn btn-sm btn-primary btn-block"
                                                            >
                                                                Add Friend
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                                {userId !== undefined && currentUser.role === "USER" &&   (
                                                    <>
                                                        {currentUser !== null && followStatus ? (
                                                            <button
                                                                onClick={unfollowUser}
                                                                className="btn btn-sm btn-secondary btn-block"
                                                            >
                                                                Unfollow
                                                            </button>
                                                        ) : currentUser !== null && friendStatus === null ? (
                                                            <button
                                                                onClick={() => alert("Please log in to friend this user.")}
                                                                className="btn btn-sm btn-primary btn-block"
                                                            >
                                                                Follow
                                                            </button>

                                                        ) : (
                                                            <button
                                                                onClick={followUser}
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
                        {showModal && ( // only show the modal if showModal is true
                            <div>
                                <div className="alert alert-dismissible alert-primary">
                                    <button onClick={() => setShowModal(false)}
                                            type="button"
                                            className="btn-close"
                                            data-bs-dismiss="alert">
                                    </button>
                                    <div className="">
                                        <div className="">
                                            <h5 className="">Update Information</h5>
                                        </div>
                                        <div className="">
                                            <p><strong>Public Information</strong></p>
                                            <div className="form-group">
                                                <label>Username</label>
                                                <input
                                                    type="text"
                                                    placeholder="Username"
                                                    className="form-control"
                                                    value={profile.username}
                                                    onChange={(e) => {
                                                        setProfile({...profile, username: e.target.value});
                                                    }}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>First Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="Firstname"
                                                    className="form-control"
                                                    value={profile.firstname}
                                                    onChange={(e) => {
                                                        setProfile({...profile, firstname: e.target.value});
                                                    }}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Last Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={profile.lastname}
                                                    onChange={(e) => {
                                                        setProfile({...profile, lastname: e.target.value});
                                                    }}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Bio</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={profile.bio}
                                                    onChange={(e) => {
                                                        setProfile({...profile, bio: e.target.value});
                                                    }}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>City</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={profile.city}
                                                    onChange={(e) => {
                                                        setProfile({...profile, city: e.target.value});
                                                    }}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Country</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={profile.country}
                                                    onChange={(e) => {
                                                        setProfile({...profile, country: e.target.value});
                                                    }}
                                                />
                                            </div>
                                            <p className="mt-2"><strong>Private Information</strong></p>
                                            <div className="form-group">
                                                <label>Password</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    value={profile.password}
                                                    onChange={(e) => {
                                                        setProfile({...profile, password: e.target.value});
                                                    }}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    value={profile.email}
                                                    onChange={(e) => {
                                                        setProfile({...profile, email: e.target.value});
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={updateProfile}
                                            >
                                                Save changes
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={() => setShowModal(false)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                            <div className="col-3">
                                <div className="">
                                    <div className="card border-primary">
                                        <div className="card-header">Liked Genres</div>
                                        {likedGenres.length > 0 ? (
                                            <ul className="list-group list-group-flush overflow-auto shadow" style={{maxHeight: "235px"}}>
                                                {likedGenres.map((genre) => (
                                                    <div>
                                                        <li className="list-group-item">
                                                            {genre}
                                                        </li>
                                                    </div>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="card-body">
                                                <p className="card-text">You have not liked any genres yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        {profile.role === "USER" ? (
                            <div className="col-3">
                            <div className="">
                                <div className="card border-primary">
                                    <div className="card-header">Following</div>
                                    {following.length > 0 ? (
                                        <ul className="list-group list-group-flush overflow-auto shadow" style={{maxHeight: "235px"}}>
                                            {following.map((follow) => (
                                                <div key={follow.followed._id}>
                                                    <li className="list-group-item">
                                                        <Link to={`/profile/${follow.followed._id}`}>
                                                            <p>{follow.followed.username}</p>
                                                        </Link>
                                                    </li>
                                                </div>
                                            ))}
                                        </ul>
                                    ) :
                                    ( <div className="card-body">
                                            <p className="card-text">You are not following anyone.</p>
                                    </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        ) : null }
                        {profile.role === "BUSINESS" ? (
                        <div className="col-3">
                            <div className="">
                                <div className="card border-primary">
                                    <div className="card-header">Followers</div>
                                    {follows.length > 0 ?(
                                        <ul className="list-group list-group-flush overflow-auto shadow" style={{maxHeight: "235px"}}>
                                            {follows.map((follow) => (
                                                <div key={follow.follower._id}>
                                                    <li className="list-group-item">
                                                        <Link to={`/profile/${follow.follower._id}`}>
                                                            <p>{follow.follower.username}</p>
                                                        </Link>
                                                    </li>
                                                </div>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="card-body">No Followers found.</div>
                                        )}
                                </div>
                            </div>
                        </div>
                        ) : null }
                    </div>
                    {profile.role === "USER" ? (
                    <div className="row mt-2">
                        <div className="col-6">
                            <div className="card border-primary">
                                <div className="card-header">Friend Shares</div>
                                {sharedItems.length > 0 ? (
                                    <ul className="list-group list-group-flush overflow-auto shadow" style={{maxHeight: "235px"}}>
                                        {sharedItems.map((sharedItem) => (
                                            <div key={sharedItem._id}>
                                                <li className="list-group-item">
                                                    <Link to={`/search/artist/${sharedItem.musicThingId}`} style={{ textDecoration: 'none' }}>
                                                        <div className="card text-white mb-1">
                                                            <div className="card-body p-2">
                                                                <div className="row">
                                                                    <div className="col-10 d-flex justify-content-center align-items-center">
                                                                        <p className="card-text"><strong>{sharedItem.nameShared.username}</strong> thinks you would love <strong>{sharedItem.name}</strong>!</p>
                                                                    </div>
                                                                    <div className="col-2">
                                                                        <img
                                                                            src={sharedItem.imageShared}
                                                                            className="img-thumbnail"
                                                                            style={{ width: "4rem", height: "4rem" }}
                                                                            alt={sharedItem.name}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </li>
                                            </div>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="card-body">No shares found.</div>
                                )}
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="">
                                <div className="card border-primary">
                                    <div className="card-header">Friends</div>
                                    {friends.length > 0 ? (
                                        <ul className="list-group list-group-flush overflow-auto shadow" style={{maxHeight: "235px"}}>
                                            {friends.map((friend) => (
                                                <div key={friend._id}>
                                                    <li className="list-group-item">
                                                    <Link to={`/profile/${friend._id}`}>
                                                        <p>{friend.username}</p>
                                                    </Link>
                                                    </li>
                                                </div>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="card-body">No friends found.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="card border-primary">
                                <div className="card-header">Friend Requests</div>
                                {friendRequests.length > 0 ? (
                                    <ul className="list-group list-group-flush overflow-auto shadow" style={{maxHeight: "235px"}}>
                                        {friendRequests.map((request) => (
                                            <div key={request._id}>
                                                <li className="list-group-item">
                                                    <div className={`${userId ? 'blur' : ''}`}>
                                                        <FriendRequestNotification
                                                            key={request._id}
                                                            request={request}
                                                            onAccept={acceptFriendRequest}
                                                            onReject={rejectFriendRequest}
                                                        />
                                                    </div>
                                                </li>
                                            </div>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="card-body">No friend requests found</div>
                                )}
                            </div>
                        </div>
                    </div>
                    ) : null }
                    <div className="mt-2">
                        <h4>Favorite Albums</h4>
                        <div className="table-responsive">
                            {likes.filter((like) => like.type === "album").length > 0 && (
                                <table className="table table-striped">
                                    <tbody>
                                    <tr>
                                        {likes
                                            .filter((like) => like.type === "album")
                                            .map((like) => (
                                                <td key={like.musicThingId}>
                                                    <Link to={`/search/album/${like.musicThingId}`}>
                                                        <div className="card">
                                                            <h6 className="card-header">{like.name}</h6>
                                                            <img
                                                                src={like.image}
                                                                className="card-img-top"
                                                                style={{ width: "12rem", height: "12rem" }}
                                                                alt={like.name}
                                                            />
                                                        </div>
                                                    </Link>
                                                </td>
                                            ))}
                                    </tr>
                                    </tbody>
                                </table>
                            )}
                        </div>
                        <h4>Favorite Tracks</h4>
                        <div className="table-responsive">
                            {likes.filter((like) => like.type === "track").length > 0 && (
                                <table className="table table-striped">
                                    <tbody>
                                    <tr>
                                        {likes
                                            .filter((like) => like.type === "track")
                                            .map((like) => (
                                                <td key={like.musicThingId}>
                                                    <Link to={`/search/track/${like.musicThingId}`}>
                                                        <div className="card">
                                                            <h6 className="card-header">{like.name}</h6>
                                                            <img
                                                                src={like.image}
                                                                className="card-img-top"
                                                                style={{ width: "12rem", height: "12rem" }}
                                                                alt={like.name}
                                                            />
                                                        </div>
                                                    </Link>
                                                </td>
                                            ))}
                                    </tr>
                                    </tbody>
                                </table>
                            )}
                        </div>
                        <h4>Favorite Artists</h4>
                        <div className="table-responsive">
                            {likes.filter((like) => like.type === "artist").length > 0 && (
                                <table className="table table-striped">
                                    <tbody>
                                    <tr>
                                        {likes
                                            .filter((like) => like.type === "artist")
                                            .map((like) => (
                                                <td key={like.musicThingId}>
                                                    <Link to={`/search/artist/${like.musicThingId}`}>
                                                        <div className="card">
                                                            <h6 className="card-header">{like.name}</h6>
                                                            <img
                                                                src={like.image}
                                                                className="card-img-top"
                                                                style={{ width: "12rem", height: "12rem" }}
                                                                alt={like.name}
                                                            />
                                                        </div>
                                                    </Link>
                                                </td>
                                            ))}
                                    </tr>
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
                )}
        </div>
    );
}

export default ProfileScreen;