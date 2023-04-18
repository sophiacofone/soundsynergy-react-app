import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function NavBar() {
  const { currentUser } = useSelector((state) => state.users);
  return (
    <div>
        <Link to="/admin">Admin</Link>|
        <Link to="/">Home</Link>|
        <Link to="/tuits">Tuits</Link>|
        <Link to="/napster">Napster</Link>|
      {!currentUser && (
        <>
          <Link to="/login">Login</Link>|<Link to="/register">Register</Link>|
        </>
      )}
      {currentUser && <Link to="/profile">Profile</Link>}
    </div>
  );
}
