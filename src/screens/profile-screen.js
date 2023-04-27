import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router";
import {Link} from "react-router-dom";

import FriendRequestNotification from "../components/friend-request";

import {profileThunk, logoutThunk, updateUserThunk} from "../services/users/users-thunks";

import {findUserById, findUserByUsername} from "../services/users/users-service";
import {findAlbumNameId, findArtistNameId, findLikesByUserId, findTrackNameId, findAlbumImageId, findArtistImageId, findTrackImageId} from "../spotify/likes-service";
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
    const [favoriteGenres, setFavoriteGenres] = useState([]);
    const [showModalGenre, setModalGenre] = useState(false);
    const [checkboxes, setCheckboxes] = useState({
        acoustic: false,
        afrobeat: false,
        altrock: false,
        alternative: false,
        children: false,
        chill: false,
        classical: false,
        club: false,
        country: false,
        dance: false,
        edm: false,
        electronic: false,
        folk: false,
        funk: false,
        happy: false,
        hipHop: false,
        holidays: false,
        house: false,
        indie: false,
        indiePop: false,
        jazz: false,
        kPop: false,
        latin: false,
        metal: false,
        movies: false,
        piano: false,
        pop: false,
        punk: false,
        rnb: false,
        rap: false,
        reggae: false,
        reggaeton: false,
        rock: false,
        romance: false,
        sad: false,
        singerSongwriter: false,
        soul: false,
        study: false,
        techno: false,
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleModalGenreOpen = () => setModalGenre(true);
    const handleModalGenreClose = () => setModalGenre(false);

    const handleCheckboxChange = (event) => {
        setCheckboxes({ ...checkboxes, [event.target.name]: event.target.checked });
    };

    const handleSubmitGenre = () => {
        const selectedGenres = Object.keys(checkboxes)
            .filter((genre) => checkboxes[genre])
            .map((genre) => genre.charAt(0).toUpperCase() + genre.slice(1));

        setFavoriteGenres(selectedGenres);
        handleModalGenreClose();
    };

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

    console.log(profile)
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
                                                {userId !== undefined && (
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
                        {profile.role === "USER" ? (
                        <div className="col-3">
                            <div className="">
                                <div className="card border-primary">
                                    <div className="card-header">Following</div>
                                    {following && (
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
                                    )}
                                </div>
                            </div>
                        </div>
                        ) : null }
                        {profile.role === "BUSINESS" ? (
                            <div className="col-3">
                            <div className="">
                                <div className="">
                                    <div className="card border-primary">
                                        <div className="card-header">
                                            Favorite Genres
                                            <button className="btn btn-secondary btn-sm ml-2 float-end" onClick={handleModalGenreOpen}>
                                                Change
                                            </button>
                                        </div>
                                        <ul
                                            className="list-group list-group-flush overflow-auto shadow"
                                            style={{ maxHeight: '235px' }}
                                        >
                                            {favoriteGenres.map((genre, index) => (
                                                <li key={index} className="list-group-item">
                                                    <p>{genre}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            {showModalGenre && (
                                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                    <div className="modal-dialog" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">Select Genres</h5>
                                                <button type="button" className="btn-close" onClick={handleModalGenreClose}>
                                                    <span aria-hidden="true"></span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                <div className="row">
                                                    <div className="col-4">
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="acoustic"
                                                                id="acoustic"
                                                                checked={checkboxes.acoustic}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="acoustic">
                                                                Acoustic
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="afrobeat"
                                                                id="afrobeat"
                                                                checked={checkboxes.afrobeat}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="afrobeat">
                                                                Afrobeat
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="altrock"
                                                                id="altrock"
                                                                checked={checkboxes.altrock}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="altrock">
                                                                Alt-Rock
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="alternative"
                                                                id="alternative"
                                                                checked={checkboxes.alternative}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="alternative">
                                                                Alternative
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="children"
                                                                id="children"
                                                                checked={checkboxes.children}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="children">
                                                                Children
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="chill"
                                                                id="chill"
                                                                checked={checkboxes.chill}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="chill">
                                                                Chill
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="classical"
                                                                id="classical"
                                                                checked={checkboxes.classical}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="classical">
                                                                Classical
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="club"
                                                                id="club"
                                                                checked={checkboxes.club}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="club">
                                                                Club
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="country"
                                                                id="country"
                                                                checked={checkboxes.country}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="country">
                                                                Country
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="dance"
                                                                id="dance"
                                                                checked={checkboxes.dance}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="dance">
                                                                Dance
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="edm"
                                                                id="edm"
                                                                checked={checkboxes.edm}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="edm">
                                                                EDM
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="electronic"
                                                                id="electronic"
                                                                checked={checkboxes.electronic}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="electronic">
                                                                Electronic
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="folk"
                                                                id="folk"
                                                                checked={checkboxes.folk}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="folk">
                                                                Folk
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-4">
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="funk"
                                                                id="funk"
                                                                checked={checkboxes.funk}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="funk">
                                                                Funk
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="happy"
                                                                id="happy"
                                                                checked={checkboxes.happy}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="happy">
                                                                Happy
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="hipHop"
                                                                id="hipHop"
                                                                checked={checkboxes.hipHop}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="hipHop">
                                                                Hip-Hop
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="holidays"
                                                                id="holidays"
                                                                checked={checkboxes.holidays}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="holidays">
                                                                Holidays
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="house"
                                                                id="house"
                                                                checked={checkboxes.house}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="house">
                                                                House
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="indie"
                                                                id="indie"
                                                                checked={checkboxes.indie}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="indie">
                                                                Indie
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="indiePop"
                                                                id="indiePop"
                                                                checked={checkboxes.indiePop}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="indiePop">
                                                                Indie Pop
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="jazz"
                                                                id="jazz"
                                                                checked={checkboxes.jazz}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="jazz">
                                                                Jazz
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="kPop"
                                                                id="kPop"
                                                                checked={checkboxes.kPop}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="kPop">
                                                                K-Pop
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="latin"
                                                                id="latin"
                                                                checked={checkboxes.latin}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="latin">
                                                                Latin
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="metal"
                                                                id="metal"
                                                                checked={checkboxes.metal}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="metal">
                                                                Metal
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="movies"
                                                                id="movies"
                                                                checked={checkboxes.movies}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="movies">
                                                                Movies
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="piano"
                                                                id="piano"
                                                                checked={checkboxes.piano}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="piano">
                                                                Piano
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-4">
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="pop"
                                                                id="pop"
                                                                checked={checkboxes.pop}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="pop">
                                                                Pop
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="punk"
                                                                id="punk"
                                                                checked={checkboxes.punk}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="punk">
                                                                Punk
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="rnb"
                                                                id="rnb"
                                                                checked={checkboxes.rnb}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="rnb">
                                                                R&B
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="rap"
                                                                id="rap"
                                                                checked={checkboxes.rap}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="rap">
                                                                Rap
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="reggae"
                                                                id="reggae"
                                                                checked={checkboxes.reggae}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="reggae">
                                                                Reggae
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="reggaeton"
                                                                id="reggaeton"
                                                                checked={checkboxes.reggaeton}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="reggaeton">
                                                                reggaeton
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="rock"
                                                                id="rock"
                                                                checked={checkboxes.rock}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="rock">
                                                                Rock
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="romance"
                                                                id="romance"
                                                                checked={checkboxes.romance}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="romance">
                                                                Romance
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="sad"
                                                                id="sad"
                                                                checked={checkboxes.sad}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="sad">
                                                                Sad
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="singerSongwriter"
                                                                id="singerSongwriter"
                                                                checked={checkboxes.singerSongwriter}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="singerSongwriter">
                                                                Singer Songwriter
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="soul"
                                                                id="soul"
                                                                checked={checkboxes.soul}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="soul">
                                                                Soul
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="study"
                                                                id="study"
                                                                checked={checkboxes.study}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="study">
                                                                Study
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="techno"
                                                                id="techno"
                                                                checked={checkboxes.techno}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="techno">
                                                                Techno
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-primary" onClick={handleSubmitGenre}>
                                                    Save changes
                                                </button>
                                                <button type="button" className="btn btn-secondary" onClick={handleModalGenreClose}>
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            </div>
                        ) : null }
                        <div className="col-3">
                            <div className="">
                                <div className="card border-primary">
                                    <div className="card-header">Followers</div>
                                    {follows && (
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
                                    )}
                                </div>
                            </div>
                        </div>
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
                                    <ul className="list-group list-group-flush overflow-auto shadow" style={{maxHeight: "235px"}}>
                                        <li className="list-group-item">No friend requests found</li>
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                    ) : null }
                    {profile.role === "USER" ? (
                    <div className="mt-2">
                        <h4>Favorite Analysis</h4>
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