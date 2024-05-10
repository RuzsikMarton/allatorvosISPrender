import React, {useContext, useEffect, useReducer} from "react";
import {Site} from "../Site";
import axios from "axios";
import {getError} from "../utils";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import {Helmet} from "react-helmet-async";
import {Button, Container} from "react-bootstrap";
import {Link, useLocation, useNavigate} from "react-router-dom";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                animals: action.payload.animals,
                page: action.payload.page,
                pages: action.payload.pages,
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

export default function AnimalListScreen() {
    const [{ loading, error, animals, pages, loadingDelete, successDelete}, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const navigate = useNavigate();
    const {search} = useLocation();
    const sp = new URLSearchParams(search);
    const page = sp.get('page') || 1;

    const { state } = useContext(Site);
    const { userInfo } = state;

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/animals/?page=${page}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
                console.log("Current page:", page);
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
    }, [userInfo, successDelete, page]);

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
            <h1 className={"mt-3"}>Regisztrált állatok</h1>
            {loadingDelete && <LoadingBox></LoadingBox>}
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <>
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
                                        variant="secondary"
                                        onClick={() => navigate(`/animal/${animal._id}`)}
                                >
                                    Adatok
                                </Button>
                                <Button className={"m-lg-1 mb-1"}
                                        type="button"
                                        variant="dark"
                                        onClick={() => navigate(`/employee/createorder/${animal._id}`)}
                                >
                                    Számla létrehozása
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
                <div>
                    {[...Array(pages).keys()].map((x) => (
                        <Link
                            className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                            key={x + 1}
                            to={`/employee/animalList?page=${x + 1}`}
                        >
                            {x + 1}
                        </Link>
                    ))}
                </div></>
            )}
        </Container>
    );
}