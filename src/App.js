import store from "./redux/store";
import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router";
import { Provider } from "react-redux";
import NavBar from "./components/nav-bar";
import CurrentUserContext from "./components/current-user-context";
import AdminScreen from "./screens/admin-screen";
import RegisterScreen from "./screens/register-screen";
import LoginScreen from "./screens/login-screen";
import ProfileScreen from "./screens/profile-screen";
import SpotifyScreen from "./spotify";
import SpotifyAlbumDetailsScreen from "./spotify/spotify-album-details";
import SpotifyTrackDetailsScreen from "./spotify/spotify-track-details";
import SpotifyArtistDetailsScreen from "./spotify/spotify-artist-details";
import TuitList from "./tuiter/tuit-list";
import SpotifySearchScreen from "./spotify/spotify-search";
function App() {
  return (
    <Provider store={store}>
      <CurrentUserContext>
          <BrowserRouter>
            <NavBar />
            <Routes>
              <Route
                path="/search/track/:id"
                element={<SpotifyTrackDetailsScreen />}
              />
              <Route
                path="/search/album/:id"
                element={<SpotifyAlbumDetailsScreen />}
              />
              <Route
                  path="/search/artist/:id"
                  element={<SpotifyArtistDetailsScreen />}
              />
              <Route path="/search/search" element={<SpotifySearchScreen />} />
              <Route
                path="/search/search/:searchTerm"
                element={<SpotifySearchScreen />}
              />
              <Route path="/search" element={<SpotifyScreen />} />
              <Route path="/admin" element={<AdminScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/profile/:userId" element={<ProfileScreen />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/tuits" element={<TuitList />} />
            </Routes>
          </BrowserRouter>
      </CurrentUserContext>
    </Provider>
  );
}

export default App;
