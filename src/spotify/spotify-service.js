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

export const getTrack = async (trackId) => {
    const accessToken = await getAccessToken();
    const response = await axios.get(`${SPOTIFY_API}/tracks/${trackId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

export const getArtist = async (artistId) => {
    const accessToken = await getAccessToken();
    const response = await axios.get(`${SPOTIFY_API}/artists/${artistId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

export const getAlbum = async (albumId) => {
    const accessToken = await getAccessToken();
    const response = await axios.get(`${SPOTIFY_API}/albums/${albumId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};
export const getAlbumTracks = async (albumId) => {
    const accessToken = await getAccessToken();
    const response = await axios.get(`${SPOTIFY_API}/albums/${albumId}/tracks`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data.items;
};
export const getNewAlbumReleases = async () => {
    const accessToken = await getAccessToken();
    const response = await axios.get(`${SPOTIFY_API}/browse/new-releases`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};
export const getArtistAlbums = async (artistId) => {
    const accessToken = await getAccessToken();
    const response = await axios.get(`${SPOTIFY_API}/artists/${artistId}/albums`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};
export const getArtistTopTracks = async (artistId, country) => {
    const accessToken = await getAccessToken();
    const response = await axios.get(`${SPOTIFY_API}/artists/${artistId}/top-tracks`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};
export const getArtistRelatedArtists = async (artistId) => {
    const accessToken = await getAccessToken();
    const response = await axios.get(`${SPOTIFY_API}/artists/${artistId}/related-artists`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};
export const getTrackAudioFeatures = async (trackId) => {
    const accessToken = await getAccessToken();
    const response = await axios.get(`${SPOTIFY_API}/audio-features/${trackId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};
