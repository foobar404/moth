import React from 'react';
import { Beta } from '../../pages';
import { Navigate, Outlet, Route } from 'react-router-dom';


export function ProtectedRoute(props) {
    const data = useProtectedRoute();

    return data.authorized ? <Outlet /> : <Navigate to="/beta" replace />;
}


function useProtectedRoute() {
    const authorized = false;

    return {
        authorized
    }
}
