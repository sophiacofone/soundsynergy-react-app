import React, { useEffect, useState } from "react";
import {findAllUsersThunk} from "../services/users/users-thunks";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router";

export default function SoundsynergyUsers() {
    const {currentUser, users} = useSelector((state) => state.users);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [selectedRole, setSelectedRole] = useState("");


    const filteredUsers = selectedRole
        ? users.filter((user) => user.role === selectedRole)
        : users;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const handleChangePage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        dispatch(findAllUsersThunk());

    }, []);

    return (
        <div>
            <div className="mt-2">
            </div>
            <div>
                <div className="row mb-2">
                    <div className="col-md-4">
                        <h5>SoundSynergy Users</h5>
                        <div className="input-group">
                            <span className="input-group-text">Filter by Type:</span>
                            <select
                                className="form-select"
                                onChange={(e) => setSelectedRole(e.target.value)}
                                value={selectedRole}
                            >
                                <option value="">All</option>
                                <option value="ADMIN">Admin</option>
                                <option value="USER">User</option>
                                <option value="BUSINESS">Business</option>
                            </select>
                        </div>
                    </div>
                </div>
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">Username</th>
                        <th scope="col">Account Type</th>
                        <th scope="col">Created</th>
                        <th scope="col">Profile</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentItems.map((user) => {
                        return (
                            <tr key={user._id}>
                                <td>{user.username}</td>
                                <td>{user.role}</td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
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
    );
};
