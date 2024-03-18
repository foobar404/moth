import React from 'react';
import "./scss/index.scss";
import { Routing } from "./Routing";
import mixpanel from 'mixpanel-browser';
import ReactDOM from 'react-dom/client';
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';


mixpanel.init('d0fd76de4b27e761d97f59a0ca878094', { debug: true, track_pageview: true, persistence: 'localStorage' });


const firebaseConfig = {
  apiKey: "AIzaSyA--ZxKCxF7L3xaCaMm12fRZKfEP6yjfq0",
  authDomain: "bug-pack.firebaseapp.com",
  projectId: "bug-pack",
  storageBucket: "bug-pack.appspot.com",
  messagingSenderId: "50270182070",
  appId: "1:50270182070:web:5826e0c95121dd368ce417"
};
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseDB = getFirestore(firebaseApp);


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<Routing />);



