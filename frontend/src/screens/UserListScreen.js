import React, {useContext, useEffect, useReducer} from "react";
import {Site} from "../Site";
import axios from "axios";
import {getError} from "../utils";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import {Helmet} from "react-helmet-async";
import {Button, Container} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                users: action.payload,
                loading: false,
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'DELETE_REQUEST':
            return { ...state, loadingDelete: true, successDelete: false };
        case 'DELETE_SUCCESS':
            return {
                ...state,
                loadingDelete: false,
                successDelete: true,
            };
        case 'DELETE_FAIL':
            return { ...state, loadingDelete: false };
        case 'DELETE_RESET':
            return { ...state, loadingDelete: false, successDelete: false };

        default:
            return state;
    }
};

export default function UserListScreen() {
    const [{ loading, error, users, loadingDelete, successDelete}, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const navigate = useNavigate();
    const { state } = useContext(Site);
    const { userInfo } = state;

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/users`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: getError(err),
                });
            }
        };
        if (successDelete) {
            dispatch({ type: 'DELETE_RESET' });
        } else {
            fetchData();
        }
    }, [userInfo, successDelete]);

    const deleteHandler = async (user) => {
        if (window.confirm('Are you sure to delete?')) {
            try {
                dispatch({ type: 'DELETE_REQUEST' });
                await axios.delete(`/api/users/${user._id}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                alert('user deleted successfully');
                dispatch({ type: 'DELETE_SUCCESS' });
            } catch (error) {
                alert(getError(error));
                dispatch({
                    type: 'DELETE_FAIL',
                });
            }
        }
    };

    return (
        <Container>
            <Helmet>
                <title>Felhasználók</title>
            </Helmet>
            <h1 className={"mt-3"}>Felhasználók</h1>
            {loadingDelete && <LoadingBox></LoadingBox>}
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <table className="table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>NÉV</th>
                        <th>EMAIL</th>
                        <th>LAKCÍM</th>
                        <th>ACTIONS</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.address} {user.city}</td>
                            <td>
                                <Button className={"m-lg-1 mb-1"}
                                        type="button"
                                        variant="secondary"
                                        onClick={() => navigate(`/employee/animalList/${user._id}`)}
                                >
                                    Állatok
                                </Button>
                                <Button className={"m-lg-1 mb-1"}
                                    type="button"
                                    variant="dark"
                                    onClick={() => navigate(`/admin/user/${user._id}`)}
                                >
                                    Adatok - Szerkesztés
                                </Button>
                                <Button className={"m-lg-1 mb-1"}
                                    type="button"
                                    variant="danger"
                                        onClick={() => deleteHandler(user)}
                                >
                                    Törlés
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </Container>
    );
}