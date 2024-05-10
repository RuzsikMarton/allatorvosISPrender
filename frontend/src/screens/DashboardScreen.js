import React, {useReducer} from "react";
import {Helmet} from "react-helmet-async";
import {Container} from "react-bootstrap";

const reducer = (state, action) => {
    switch (action.type) {
        default:
            return state;
    }
}

export default function DashboardScreen() {
    const [{loading, error}, dispatch] = useReducer(reducer, {
        loading: false,
        error: '',
    });

    return (
        <div>
            <Helmet>
                <title>Dashboard</title>
            </Helmet>
            <Container>
                <h1 className={"mt-3"}>Dashboard</h1>

            </Container>
        </div>
    )
}
