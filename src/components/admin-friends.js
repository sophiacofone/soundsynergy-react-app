import React, { useEffect, useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router";
import {deleteUser, findUserByUsername} from "../services/users/users-service";
import {findFriendsByUser, userUnfriendsUser} from "../services/friends-service";


export default function AdminFriends() {


    return (
        <div>
            implement?
        </div>
    );
};
