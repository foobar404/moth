import { firebaseDB } from "../../index";
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';


export function ProtectedRoute(props) {
    const data = useProtectedRoute();

    if (data.loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500">
                <div className="flex space-x-2">
                    <div className="w-8 h-8 bg-white rounded-full animate-bounce"></div>
                    <div className="w-8 h-8 bg-white rounded-full animate-bounce200"></div>
                    <div className="w-8 h-8 bg-white rounded-full animate-bounce400"></div>
                </div>
            </div>
        )
    }

    return data.authorized ? <Outlet /> : <Navigate to="/beta" replace />;
}


function useProtectedRoute() {
    let [loading, setLoading] = useState(true);
    let [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        let key = localStorage.getItem("moth-beta-key");
        if (!key) {
            setLoading(false);
            return;
        }
        checkKeyExists(key);
    }, []);

    async function checkKeyExists(keyToCheck) {
        const docRef = doc(firebaseDB, 'beta-keys', keyToCheck);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists())
            setAuthorized(true);

        setLoading(false);
    }

    return {
        loading,
        authorized,
    }
}
