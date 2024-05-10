import {createContext, useReducer} from "react";


export const Site = createContext();

const initalState = {
    userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
        : null,


};

function reducer(state, action) {
    switch (action.type) {
        case 'USER_SIGNIN':
            return { ...state, userInfo: action.payload };
        case 'USER_SIGNOUT':
            return {
                ...state,
                userInfo: null,
            };
        default:
            return state;
    }
}

export function SiteProvider(props) {
    const [state, dispatch] = useReducer(reducer, initalState);
    const value = {state, dispatch};
    return <Site.Provider value={value}>{props.children}</Site.Provider>
}