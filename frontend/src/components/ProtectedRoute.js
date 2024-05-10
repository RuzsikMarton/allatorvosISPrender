import React, {useContext} from "react";
import {Navigate} from "react-router-dom";
import {Site} from "../Site";

function ProtectedRoutes({children}) {
    const {state} = useContext(Site);
    const {userInfo} = state;
    return userInfo ? children : <Navigate to={"/signin"}></Navigate>
}

export default ProtectedRoutes;