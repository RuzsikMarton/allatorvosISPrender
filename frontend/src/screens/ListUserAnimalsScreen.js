import React, {useContext, useEffect, useReducer} from "react";
import {Button, Container} from "react-bootstrap";
import {Helmet} from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import {useNavigate, useParams} from "react-router-dom";
import {Site} from "../Site";
import axios from "axios";
import {getError} from "../utils";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                animals: action.payload,
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

export default function ListUserAnimalsScreen(){
    const [{ loading, error, animals, loadingDelete, successDelete}, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const navigate = useNavigate();
    const { state } = useContext(Site);
    const { userInfo } = state;

    const params = useParams();
    const { id: userId } = params;

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/animals/owner/${userId}`, {
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
    }, [userInfo, successDelete, userId]);

    const deleteHandler = async (animal) => {
        if (window.confirm('Are you sure to delete?')) {
            try {
                dispatch({ type: 'DELETE_REQUEST' });
                await axios.delete(`/api/animals/${animal._id}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                alert('animal deleted successfully');
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
                <title>Regisztrált állatok</title>
            </Helmet>
            <h1>Regisztrált állatok</h1>
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
                        <th>NEM</th>
                        <th>FAJ</th>
                        <th>GAZDA</th>
                        <th>ACTIONS</th>
                    </tr>
                    </thead>
                    <tbody>
                    {animals.map((animal) => (
                        <tr key={animal._id}>
                            <td>{animal._id}</td>
                            <td>{animal.name}</td>
                            <td>{animal.gender}</td>
                            <td>{animal.breed}</td>
                            <td>{animal.owner.name}</td>
                            <td>
                                <Button className={"m-lg-1 mb-1"}
                                        type="button"
                                        variant="dark"
                                        onClick={() => navigate(`/animal/${animal._id}`)}
                                >
                                    Adatok
                                </Button>
                                <Button className={"m-lg-1 mb-1"}
                                        type="button"
                                        variant="dark"
                                        onClick={() => navigate(`/employee/animal/${animal._id}`)}
                                >
                                    Szerkesztés
                                </Button>
                                <Button className={"m-lg-1 mb-1"}
                                        type="button"
                                        variant="danger"
                                        onClick={() => deleteHandler(animal)}
                                >
                                    Törlés
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </Container>);
}