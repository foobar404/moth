import React from 'react';
import "./scss/index.scss";
import { Routing } from "./Routing";
import mixpanel from 'mixpanel-browser';
import ReactDOM from 'react-dom/client';


mixpanel.init('d0fd76de4b27e761d97f59a0ca878094', { debug: true, track_pageview: true, persistence: 'localStorage' });


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<Routing />);



