import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { findFollowsByFollowedId } from "../services/follows-service";
import { findGenresByUserId } from "../spotify/likes-service";

export default function AnalysisFollowers() {
    const { currentUser, users } = useSelector((state) => state.users);
    const [follows, setFollows] = useState([]);
    const [genresAlert, setGenresAlert] = useState(null);

    const navigate = useNavigate();

    const fetchFollowers = async () => {
        const follows = await findFollowsByFollowedId(currentUser._id);
        setFollows(follows);
    };

    useEffect(() => {
        fetchFollowers();
    }, []);

    const handleSeeGenresClick = async (userId) => {
        try {
            const genres = await findGenresByUserId(userId);
            const alert = (
                <div className="alert alert-dismissible alert-primary">
                    <button type="button" className="btn-close" onClick={() => setGenresAlert(null)}></button>
                    <strong>Genres:</strong> {genres.join(", ")}
                </div>
            );
            setGenresAlert(alert);
        } catch (error) {
            console.error("Error fetching genres:", error);
            alert("An error occurred while fetching genres.");
        }
    };

    return (
        <div className="row">
            <div className="col-12">
                {genresAlert}
                {follows.length > 0 ? (
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">Username</th>
                            <th scope="col">Genres</th>
                            <th scope="col">Profile</th>
                        </tr>
                        </thead>
                        <tbody>
                        {follows.map((follow) => {
                            return (
                                <tr key={follow._id}>
                                    <td>{follow.follower.username}</td>
                                    <td>
                                        <button className="btn btn-sm btn-primary" onClick={() => handleSeeGenresClick(follow.follower._id)}>
                                            See Genres
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn btn-sm btn-primary" onClick={() => navigate(`/profile/${follow.follower._id}`)}>
                                            Visit
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                ) : (
                    <div className="card-body">No Followers found.</div>
                )}
            </div>
        </div>
    );
}
