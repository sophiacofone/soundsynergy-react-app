import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router";
import {Link} from "react-router-dom";

import {profileThunk, logoutThunk, updateUserThunk} from "../services/users/users-thunks";

import {findUserById} from "../services/users/users-service";
import {findLikesByUserId} from "../spotify/likes-service";
import {userFollowsUser, findFollowsByFollowerId, findFollowsByFollowedId} from "../services/follows-service";


function ProfileScreen() {
    const {userId} = useParams();
    const {currentUser} = useSelector((state) => state.users);

    const [profile, setProfile] = useState(currentUser);
    const [likes, setLikes] = useState([]);
    const [following, setFollowing] = useState([]);
    const [follows, setFollows] = useState([]);
    const [showModal, setShowModal] = useState(false);

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
        setLikes(likes);
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

    useEffect(() => {
        loadScreen();
    }, [userId]);

    useEffect(() => {
        if (profile && profile._id) {
            fetchLikes();
            fetchFollowing();
            fetchFollowers();
        }
    }, [profile]);

    return (
        <div className="container mt-2">
            {profile && (
                <div>
                    <div className="row">
                        <div className="col-6">
                            <div className="card border-secondary">
                                <div className="card-header">{typeof userId !== undefined ? "My" : userId} Profile</div>
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
                                            {userId !== undefined &&
                                                <div>
                                                    <button
                                                        onClick={followUser}
                                                        className="btn btn-sm btn-primary btn-block">
                                                        Follow
                                                    </button>
                                                </div>
                                            }
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
                        <div className="col-2">
                            <div className="">
                                <div className="card border-primary">
                                    <div className="card-header">Shares</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="">
                                <div className="card border-primary">
                                    <div className="card-header">Following List</div>
                                    {following && (
                                        <ul className="list-group list-group-flush">
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
                        <div className="col-2">
                            <div className="">
                                <div className="card border-primary">
                                    <div className="card-header">Followers List</div>
                                    {follows && (
                                        <ul className="list-group">
                                            {follows.map((follow) => (
                                                <div key={follow.follower._id}>
                                                    <li className="list-group-item">
                                                        <Link to={`/profile/${follow.follower._id}`}>
                                                            <h6>{follow.follower.username}</h6>
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
                </div>
            )}
            <div>
                <h2>Likes</h2>
                <div className="table-responsive">
                    <table className="table table-striped">
                        <tbody>
                        <tr>
                            {likes.map((like) => (
                                <td key={like.musicThingId}>
                                    <Link to={`/spotify/album/${like.musicThingId}`}>
                                        <h3>{like.musicThingId}</h3>
                                    </Link>
                                </td>
                            ))
                            }
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ProfileScreen;