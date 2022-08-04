import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App';
import reportWebVitals from './reportWebVitals';
import "react-materialize"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import SummonerPage from "./SummonerPage";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <div style={{minHeight: '100vh'}} className={'theme-switcher'}>
      <link href="http://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-rc.2/css/materialize.min.css"/>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-rc.2/js/materialize.min.js"></script>
      <script src={""}></script>
      <BrowserRouter>
          <Routes>
              <Route path={''} element={<App/>}/>
              <Route path="/:server/:summonerName" element={<SummonerPage/>}/>
          </Routes>
      </BrowserRouter>
      </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
