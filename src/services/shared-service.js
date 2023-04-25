import axios from "axios";

const USERS_API = "http://localhost:4000/api/users";

export const findSharedItemsByShareReceiver = async (userId) => {
    const response = await axios.get(`${USERS_API}/${userId}/shared/received`);
    return response.data;
};

export const userSharesItem = async (sharer, shareRecipient, type, musicThingId, name) => {
    const response = await axios.post(`${USERS_API}/${sharer}/shareRecipient/${shareRecipient}/${type}/${musicThingId}`, { name });
    return response.data;
};

export const findSharedItemsByShareSender = async (userId) => {
    const response = await axios.get(`${USERS_API}/${userId}/shared/sent`);
    return response.data;
};