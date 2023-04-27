import React, { useEffect, useState } from "react";
import {findAllUsersThunk, updateUserThunk} from "../services/users/users-thunks";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router";
import {deleteUser, findUserByUsername} from "../services/users/users-service";

export default function AdminFriends() {
    const {currentUser, users} = useSelector((state) => state.users);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [searchInput, setSearchInput] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [selectedRole, setSelectedRole] = useState("");

    const handleDeleteUser = async (event) => {
        event.preventDefault();
        await deleteUser(selectedUser._id);
        setSelectedUser(null);
    };

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
            <div>
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">Username</th>
                        <th scope="col">User ID</th>
                        <th scope="col">Role</th>
                        <th scope="col">Created At</th>
                        <th scope="col">Profile</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentItems.map((user) => {
                        return (
                            <tr key={user._id}>
                                <td>{user.username}</td>
                                <td>{user._id}</td>
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
