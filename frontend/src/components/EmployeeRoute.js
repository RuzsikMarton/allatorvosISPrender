import React, {useContext} from "react";
import {Navigate} from "react-router-dom";
import {Site} from "../Site";

function EmployeeRoute({children}) {
    const {state} = useContext(Site);
    const {userInfo} = state;
    return userInfo && userInfo.isEmployee ? children : <Navigate to={"/signin"}></Navigate>
}

export default EmployeeRoute;