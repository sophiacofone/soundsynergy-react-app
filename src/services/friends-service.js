import axios from "axios";

const USERS_API = "http://localhost:4000/api/users";

export const findFriendsByUser = async (user) => {
    const response = await axios.get(`${USERS_API}/${user}/friends`);
    return response.data;
};

export const userSendsFriendRequest = async (user1, user2) => {
    const response = await axios.post(`${USERS_API}/${user1}/friends/${user2}`);
    return response.data;
};

export const userAcceptsFriendRequest = async (user1, user2) => {
    const response = await axios.put(`${USERS_API}/${user1}/friends/${user2}/accept`);
    return response.data;
};
export const userRejectsFriendRequest = async (user1, user2) => {
    const response = await axios.delete(`${USERS_API}/${user1}/friends/${user2}/reject`);
    return response.data;
};

