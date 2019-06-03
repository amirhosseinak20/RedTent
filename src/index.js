// modules
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";

// components
import App from "./components/index";

// store
import configureStore, { history } from "./store/index";

// Stylesheets
import 'bootstrap/dist/css/bootstrap.css';
import './assets/stylesheets/util.css';  
import './assets/stylesheets/main.css';  
import './assets/stylesheets/index.css';

const store = configureStore();

ReactDOM.render(
  <Provider store={ store }>
    <ConnectedRouter history={ history }>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.querySelector("#root")
);
