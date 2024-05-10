import React, {useContext, useEffect, useReducer} from "react";
import {Button, Container} from "react-bootstrap";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Site} from "../Site";
import axios from "axios";
import {getError} from "../utils";
import {Helmet} from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                orders: action.payload.orders,
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

export default function OrderListScreen() {
    const [{ loading, error, orders, pages, loadingDelete, successDelete}, dispatch] = useReducer(reducer, {
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
                const { data } = await axios.get(`/api/orders/?page=${page}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
                console.log(data);
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

    const deleteHandler = async (order) => {
        if (window.confirm('Are you sure to delete?')) {
            try {
                dispatch({ type: 'DELETE_REQUEST' });
                await axios.delete(`/api/orders/${order._id}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                alert('order deleted successfully');
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
                <title>Számlák</title>
            </Helmet>
            <h1 className={"mt-3"}>Számlák</h1>
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <>
                <table className="table">
                    <thead>
                    <tr>
                        <th>LÉTREHOZVA</th>
                        <th>ELJÁRÁS</th>
                        <th>FELJEGYEZTE</th>
                        <th>ÁLLAT NEVE</th>
                        <th>GAZDI</th>
                        <th>ACTIONS</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr key={order._id}>
                            <td>{order.createdAt ? order.createdAt.slice(0, -5) : 'N/A'}</td>
                            <td>{order.procedure}</td>
                            <td>{order.employee.name}</td>
                            <td>{order.animal.name}</td>
                            <td>{order.animal.owner.name}</td>
                            <td><Button className={"m-lg-1 mb-1"}
                                        type="button"
                                        variant="secondary"
                                        onClick={() => navigate(`/order/${order._id}`)}
                            >
                                Adatok
                            </Button>
                                <Button className={"m-lg-1 mb-1"}
                                        type="button"
                                        variant="danger"
                                        onClick={() => deleteHandler(order)}
                                >
                                    Törlés
                                </Button></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                    <div>
                        {[...Array(pages).keys()].map((x) => (
                            <Link
                                className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                                key={x + 1}
                                to={`/employee/orderList?page=${x + 1}`}
                            >
                                {x + 1}
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </Container>
    )
}