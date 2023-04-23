import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router";
import {registerThunk} from "../services/users/users-thunks";

function RegisterScreen() {
    const {currentUser} = useSelector((state) => state.users);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [role, setRole] = useState("USER"); // new state variable for selected role
    const [errorMessage, setErrorMessage] = useState("");



    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRegister= async (e) => {
        e.preventDefault(); // prevent default form submission behavior
        try {
            console.log({username, email, password, firstname, lastname, role});
            await dispatch(registerThunk({ username, email, password, firstname, lastname, role}));
            navigate("/profile");
        } catch (err) {
            console.log(err);
            if (err.response && err.response.status === 409) {
                setErrorMessage(err.response.data.message);
            } else {
                setErrorMessage("An error occurred. Please try again.");
            }
        }
    };

    return (
        <div>
            <div className="container mx-auto w-50 text-center mt-3">
                <h1 className="h3 font-weight-normal">Register Here <i className="bi bi-music-note-beamed"></i></h1>
               <div className="m-2">
                   Already Registered? <a href="/login">Login Here.</a>
               </div>
                <div>
                    {errorMessage && (
                        <div className="alert alert-danger" role="alert">
                            {errorMessage}
                        </div>
                    )}
                </div>
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="role"
                                id="user"
                                value="USER"
                                checked={role === "USER"}
                                onChange={() => setRole("USER")}
                            />
                            <label className="form-check-label" htmlFor="user">
                                User Account
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="role"
                                id="business"
                                value="BUSINESS"
                                checked={role === "BUSINESS"}
                                onChange={() => setRole("BUSINESS")}
                            />
                            <label className="form-check-label" htmlFor="business">
                                Business Account
                            </label>
                        </div>
                        <input
                            type="username"
                            id="inputUser"
                            className="form-control"
                            placeholder="Enter Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required=""
                            autoFocus="">
                        </input>
                        <label htmlFor="inputUser" className="sr-only"></label>
                        <input
                            type="email"
                            id="inputEmail"
                            className="form-control"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required=""
                            autoFocus="">
                        </input>
                        <label htmlFor="inputEmail" className="sr-only"></label>
                        <input
                            type="password"
                            id="inputPassword"
                            className="form-control"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required=""
                            autoFocus="">
                        </input>
                        <label htmlFor="inputPassword" className="sr-only"></label>
                        <input
                            type="firstname"
                            id="inputfirstname"
                            className="form-control"
                            placeholder="Enter First Name"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            required=""
                            autoFocus="">
                        </input>
                        <label htmlFor="inputfirstname" className="sr-only"></label>
                        <input
                            type="lastname"
                            id="inputlastname"
                            className="form-control"
                            placeholder="Enter Last Name"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            required=""
                            autoFocus="">
                        </input>
                        <label htmlFor="inputlastname" className="sr-only"></label>
                    </div>
                    <button className="btn btn-lg btn-primary w-100 mt-2" type="submit">Register</button>
                </form>
            </div>
        </div>
    );
}

export default RegisterScreen;
