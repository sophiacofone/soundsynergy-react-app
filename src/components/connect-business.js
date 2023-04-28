import React, { useEffect, useState } from "react";
import { findAllUsersThunk } from "../services/users/users-thunks";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { findGenresByUserId } from "../spotify/likes-service";

export default function ConnectBusiness() {
    const { currentUser, users } = useSelector((state) => state.users);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [selectedRole, setSelectedRole] = useState("BUSINESS");
    const [genresAlert, setGenresAlert] = useState(null);
    const [currentUserGenres, setCurrentUserGenres] = useState([]);
    const [bisgenre, setBisgenre] = useState([]);

    const handleChangePage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const handleSeeGenresClick = async (userId) => {
        try {
            const genres = await findGenresByUserId(userId);
            const alert = (
                <div className="alert alert-dismissible alert-primary">
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setGenresAlert(null)}
                    ></button>
                    <strong>Genres:</strong> {genres.join(", ")}
                </div>
            );
            setGenresAlert(alert);
        } catch (error) {
            console.error("Error fetching genres:", error);
            alert("An error occurred while fetching genres.");
        }
    };

    useEffect(() => {
        dispatch(findAllUsersThunk());
        const fetchGenres = async () => {
            if (currentUser) {
                const genres = await findGenresByUserId(currentUser._id);
                setCurrentUserGenres(genres);
            }
        };
        fetchGenres();
    }, [currentUser]);

    // Step 2: Filter users array to only include business users
    const businessUsers = users.filter((user) => user.role === "BUSINESS");

    // Step 3: Filter businessUsers array to only include users with at least one genre in common with currentUser
    const filteredBusinessUsers = businessUsers.filter(async (user) => {
        try {
            const genres = await findGenresByUserId(user._id);
            let hasGenreInCommon = false;
            for (let genre of currentUserGenres) {
                if (genres.includes(genre)) {
                    hasGenreInCommon = true;
                    break;
                }
            }
            return hasGenreInCommon;
        } catch (error) {
            console.error("Error fetching genres:", error);
            return false;
        }
    });

    // Step 4: Render filteredBusinessUsers array as list of business users
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBusinessUsers.slice(
        indexOfFirstItem,
        indexOfLastItem
    );
    const totalPages = Math.ceil(
        filteredBusinessUsers.length / itemsPerPage
    );
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
<>
        {currentUser && (
        <div>
            <div className="mt-2">
            </div>
            <div>
                <div className="row mb-2">
                    <div className="col-md-12">
                        <h5>SoundSynergy Business Users</h5>
                        <p>These are the places we think you'll like visiting the most based on your music data!</p>
                    </div>
                </div>
                {genresAlert}
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">Username</th>
                        <th scope="col">Genres</th>
                        <th scope="col">Profile</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentItems.map((user) => {
                        return (
                            <tr key={user._id}>
                                <td>{user.username}</td>
                                <td>
                                    <button className="btn btn-sm btn-primary" onClick={() => handleSeeGenresClick(user._id)}>
                                        See Genres
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => navigate(`/profile/${user._id}`)}
                                    >
                                        Visit
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
                <nav>
                    <ul className="pagination">
                        {pageNumbers.map((pageNumber) => (
                            <li
                                key={pageNumber}
                                className={`page-item ${currentPage === pageNumber ? "active" : ""}`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => handleChangePage(pageNumber)}
                                >
                                    {pageNumber}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    )}
</>
    );
};