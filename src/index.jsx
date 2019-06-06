// Node Modules
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { CookiesProvider } from 'react-cookie';

// store
import configureStore, { history } from "./store/index";

// Stylesheets
import "./assets/stylesheets/reset.css";
import "./assets/stylesheets/style.css";

// Components
import App from "./components/App";

// Rendering VDOM
const store = configureStore();
const rootElement = document.getElementById("root");
ReactDOM.render(
  <CookiesProvider>
    <Provider store={ store }>
      <ConnectedRouter history={ history }>
        <App />
      </ConnectedRouter>
    </Provider>
  </CookiesProvider>,
  rootElement
);
