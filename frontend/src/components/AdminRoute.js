import React, {useContext} from "react";
import {Navigate} from "react-router-dom";
import {Site} from "../Site";

function AdminRoute({children}) {
    const {state} = useContext(Site);
    const {userInfo} = state;
    return userInfo && userInfo.isAdmin ? children : <Navigate to={"/signin"}></Navigate>
}

export default AdminRoute;