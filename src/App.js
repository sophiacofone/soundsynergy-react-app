import store from "./redux/store";
import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router";
import { Provider } from "react-redux";
import AddScreen from "./screens/add-screen";
import NavBar from "./components/nav-bar";
import CurrentUserContext from "./components/current-user-context";
import AdminScreen from "./screens/admin-screen";
import RegisterScreen from "./screens/register-screen";
import LoginScreen from "./screens/login-screen";
import ProfileScreen from "./screens/profile-screen";
import NapsterScreen from "./napster";
import NapsterSearchScreen from "./napster/napster-search";
import NapsterAlbumDetailsScreen from "./napster/napster-album";
import NapsterTrackDetailsScreen from "./napster/napster-track";
import TuitList from "./tuiter/tuit-list";
function App() {
  return (
    <Provider store={store}>
      <CurrentUserContext>
        <div className="container-fluid">
          <BrowserRouter>
            <NavBar />
            <Routes>
{/*              <Route
                  path="/"
                  element={<NapsterTrackDetailsScreen />}
              />*/}
              <Route
                path="/napster/track/:id"
                element={<NapsterTrackDetailsScreen />}
              />
              <Route
                path="/napster/album/:id"
                element={<NapsterAlbumDetailsScreen />}
              />
              <Route path="/napster/search" element={<NapsterSearchScreen />} />
              <Route
                path="/napster/search/:searchTerm"
                element={<NapsterSearchScreen />}
              />
              <Route path="/napster" element={<NapsterScreen />} />
              <Route path="/admin" element={<AdminScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/profile/:userId" element={<ProfileScreen />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/tuits" element={<TuitList />} />
              <Route path="/add/:paramA/:paramB" element={<AddScreen />} />
            </Routes>
          </BrowserRouter>
        </div>
      </CurrentUserContext>
    </Provider>
  );
}

export default App;
