import React, { useEffect, useState } from "react";
import {findAllUsersThunk, updateUserThunk, deleteUserThunk} from "../services/users/users-thunks";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router";
import {deleteUser, findUserByUsername} from "../services/users/users-service";

export default function AdminUsers() {
    const {currentUser, users} = useSelector((state) => state.users);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [searchInput, setSearchInput] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [selectedRole, setSelectedRole] = useState("");

    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
    };
    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        const foundUser = await findUserByUsername(searchInput);
        if (foundUser) {
            setSelectedUser(foundUser);
        } else {
            alert("User not found");
        }
    };
    const handleDeleteUser = async (event) => {
        event.preventDefault();
        await deleteUser(selectedUser._id);
        setSelectedUser(null);
        dispatch(deleteUserThunk());
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
            <div className="mt-2">
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
            </div>
            {selectedUser && (
                <div>
                    <div>
                        <h5>User: {selectedUser.username}</h5>
                        <form onSubmit={handleDeleteUser}>
                            <button type="submit" className="btn btn-danger">
                                Delete
                            </button>
                        </form>
                        <table className="table">
                            <thead>
                            <tr>
                                <th scope="col">Username</th>
                                <th scope="col">Role</th>
                                <th scope="col">Email</th>
                                <th scope="col">First Name</th>
                                <th scope="col">Last Name</th>
                                <th scope="col">City</th>
                                <th scope="col">Country</th>
                                <th scope="col">Bio</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{selectedUser.username}</td>
                                <td>{selectedUser.role}</td>
                                <td>{selectedUser.email}</td>
                                <td>{selectedUser.firstname}</td>
                                <td>{selectedUser.lastname}</td>
                                <td>{selectedUser.city}</td>
                                <td>{selectedUser.country}</td>
                                <td>{selectedUser.bio}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h5>Update User</h5>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                dispatch(updateUserThunk(selectedUser)).then(() => {
                                    dispatch(findAllUsersThunk());
                                    setSelectedUser(null);
                                });
                            }}
                        >
                            <div className="">
                                <label htmlFor="role" className="form-label">Role</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="role"
                                    value={selectedUser.role}
                                    onChange={(e) => setSelectedUser({
                                        ...selectedUser,
                                        role: e.target.value
                                    })}
                                />
                            </div>
                            <div className="">
                                <label htmlFor="username" className="form-label">Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    value={selectedUser.username}
                                    onChange={(e) => setSelectedUser({
                                        ...selectedUser,
                                        username: e.target.value
                                    })}
                                />
                            </div>
                            <div className="">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    value={selectedUser.password || ""}
                                    onChange={(e) => setSelectedUser({
                                        ...selectedUser,
                                        password: e.target.value
                                    })}
                                />
                            </div>
                            <div className="">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    value={selectedUser.email || ""}
                                    onChange={(e) => setSelectedUser({
                                        ...selectedUser,
                                        email: e.target.value
                                    })}
                                />
                            </div>
                            <div className="">
                                <label htmlFor="firstname" className="form-label">First Name</label>
                                <input
                                    type="firstname"
                                    className="form-control"
                                    id="firstname"
                                    value={selectedUser.firstname || ""}
                                    onChange={(e) => setSelectedUser({
                                        ...selectedUser,
                                        firstname: e.target.value
                                    })}
                                />
                            </div>
                            <div className="">
                                <label htmlFor="lastname" className="form-label">Last Name</label>
                                <input
                                    type="lastname"
                                    className="form-control"
                                    id="lastname"
                                    value={selectedUser.lastname || ""}
                                    onChange={(e) => setSelectedUser({
                                        ...selectedUser,
                                        lastname: e.target.value
                                    })}
                                />
                            </div>
                            <div className="">
                                <label htmlFor="city" className="form-label">City</label>
                                <input
                                    type="city"
                                    className="form-control"
                                    id="city"
                                    value={selectedUser.city || ""}
                                    onChange={(e) => setSelectedUser({
                                        ...selectedUser,
                                        city: e.target.value
                                    })}
                                />
                            </div>
                            <div className="">
                                <label htmlFor="country" className="form-label">Country</label>
                                <input
                                    type="country"
                                    className="form-control"
                                    id="country"
                                    value={selectedUser.country || ""}
                                    onChange={(e) => setSelectedUser({
                                        ...selectedUser,
                                        country: e.target.value
                                    })}
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="bio" className="form-label">Bio</label>
                                <input
                                    type="bio"
                                    className="form-control"
                                    id="bio"
                                    value={selectedUser.bio || ""}
                                    onChange={(e) => setSelectedUser({
                                        ...selectedUser,
                                        bio: e.target.value
                                    })}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Update</button>
                            <button type="button" className="btn btn-secondary ms-2"
                                    onClick={() => setSelectedUser(null)}>Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
            <div>
                <div className="row mb-2">
                    <div className="col-md-4">
                        <h5>User Summary</h5>
                        <div className="input-group">
                            <span className="input-group-text">Filter by Role:</span>
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
