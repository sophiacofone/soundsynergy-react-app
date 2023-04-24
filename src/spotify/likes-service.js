import axios from "axios";

const LIKES_API = "http://localhost:4000/api/likes";
const USERS_API = "http://localhost:4000/api/users";
const ALBUMS_API = "http://localhost:4000/api/albums";
const ARTIST_API = "http://localhost:4000/api/artists";
const TRACKS_API = "http://localhost:4000/api/tracks";

export const findLikesByUserId = async (userId) => {
    const response = await axios.get(`${USERS_API}/${userId}/likes`);
    return response.data;
};

export const findAlbumNameId = async (albumId) => {
    const response = await axios.get(`${ALBUMS_API}/${albumId}/name`);
    return response.data;
};

export const findArtistNameId = async (artistId) => {
    const response = await axios.get(`${ARTIST_API}/${artistId}/name`);
    return response.data;
};

export const findTrackNameId = async (trackId) => {
    const response = await axios.get(`${TRACKS_API}/${trackId}/name`);
    return response.data;
};

export const findAlbumImageId = async (albumId) => {
    const response = await axios.get(`${ALBUMS_API}/${albumId}/image`);
    return response.data;
};

export const findArtistImageId = async (artistId) => {
    const response = await axios.get(`${ARTIST_API}/${artistId}/image`);
    return response.data;
};

export const findTrackImageId = async (trackId) => {
    const response = await axios.get(`${TRACKS_API}/${trackId}/image`);
    return response.data;
};

export const userLikesAlbum = async (userId, albumId, name, image) => {
    // Check if album exists in albums collection
    const albumResponse = await axios.get(`${ALBUMS_API}/${albumId}`);
    const album = albumResponse.data;

    // If not, add it
    if (!album) {
        await axios.post(`${ALBUMS_API}`, { spotifyAlbumId: albumId , name: name, image: image});
    }

    // Add like to likes collection
    const response = await axios.post(
        `${USERS_API}/${userId}/likes/album/${albumId}`
    );
    return response.data;
};

export const userUnlikesAlbum = async (userId, albumId) => {
    const response = await axios.delete(
        `${USERS_API}/${userId}/likes/album/${albumId}`
    );
    return response.data;
};

export const userLikesArtist = async (userId, artistId, name, image) => {
    // Check if artist exists in artist collection
    const artistResponse = await axios.get(`${ARTIST_API}/${artistId}`);
    const artist = artistResponse.data;
    // If not, add it
    if (!artist) {
        await axios.post(`${ARTIST_API}`, { spotifyArtistId: artistId, name: name, image: image});
    }
    // Add like to likes collection
    const response = await axios.post(
        `${USERS_API}/${userId}/likes/artist/${artistId}`
    );
    return response.data;
};

export const userUnlikesArtist = async (userId, artistId) => {
    const response = await axios.delete(
        `${USERS_API}/${userId}/likes/artist/${artistId}`
    );
    return response.data;
};

export const userLikesTrack = async (userId, trackId, name, image) => {
    // Check if track exists in track collection
    const trackResponse = await axios.get(`${TRACKS_API}/${trackId}`);
    const track = trackResponse.data;
    // If not, add it
    if (!track) {
        await axios.post(`${TRACKS_API}`, { spotifyTrackId: trackId, name: name, image:image});
    }
    // Add like to likes collection
    const response = await axios.post(
        `${USERS_API}/${userId}/likes/track/${trackId}`
    );
    return response.data;
};

export const userUnlikesTrack = async (userId, trackId) => {
    const response = await axios.delete(
        `${USERS_API}/${userId}/likes/track/${trackId}`
    );
    return response.data;
};
