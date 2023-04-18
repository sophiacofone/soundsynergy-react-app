import axios from "axios";

const SPOTIFY_API = "https://api.spotify.com/v1";
const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
function getAccessToken() {
    const encodedCredentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    return axios({
        method: 'POST',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${encodedCredentials}`
        },
        data: 'grant_type=client_credentials'
    })
        .then(response => response.data.access_token)
        .catch(error => {
            console.error(error);
            throw new Error('Failed to obtain Spotify access token');
        });
}

export const searchTracks = async (query) => {
    const accessToken = await getAccessToken();
    const response = await axios.get(`${SPOTIFY_API}/search`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        params: {
        q: query,
        type: "track",
        },
    });
    return response.data.tracks;
};
export const searchArtists = async (query) => {
    const accessToken = await getAccessToken();
    const response = await axios.get(`${SPOTIFY_API}/search`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        params: {
            q: query,
            type: "artist",
        },
    });
    return response.data.artists;
};
export const searchAlbums = async (query) => {
    const accessToken = await getAccessToken();
    const response = await axios.get(`${SPOTIFY_API}/search`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        params: {
            q: query,
            type: "album",
        },
    });
    return response.data.albums;
};
