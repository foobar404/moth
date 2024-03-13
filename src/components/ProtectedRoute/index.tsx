import { firebaseDB } from "../../index";
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';


export function ProtectedRoute(props) {
    const data = useProtectedRoute();

    if (data.loading) {
        return (
            <main>
                Loading...
            </main>
        )
    }

    return data.authorized ? <Outlet /> : <Navigate to="/beta" replace />;
}


function useProtectedRoute() {
    let [loading, setLoading] = useState(true);
    let [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        checkKeyExists(localStorage.getItem("moth-beta-key"));
    }, []);

    async function checkKeyExists(keyToCheck) {
        const betaKeysCol = collection(firebaseDB, 'beta-keys');
        const q = query(betaKeysCol, where('key', '==', keyToCheck));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) setAuthorized(true);
        setLoading(false);
    }

    return {
        loading,
        authorized,
    }
}
