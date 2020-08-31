import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {goodsData} from "./js/data";
import "@/styles/main.scss";
import App from "./components/app/app";

ReactDOM.render(
  <App
    // properties
    data={goodsData}
  />,
  document.getElementById('root')
);
