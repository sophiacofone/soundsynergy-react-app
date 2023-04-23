import axios from "axios";

const LIKES_API = "http://localhost:4000/api/likes";
const USERS_API = "http://localhost:4000/api/users";

export const findLikesByUserId = async (userId) => {
    const response = await axios.get(`${USERS_API}/${userId}/likes`);
    return response.data;
};

export const userLikesAlbum = async (userId, albumId) => {
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

export const userLikesArtist = async (userId, artistId) => {
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

export const userLikesTrack = async (userId, trackId) => {
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
