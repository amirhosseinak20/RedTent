// Modules
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";
import thunkMiddleware from 'redux-thunk';

// Reducers
import createRootReducer from "../reducers/index";

export const history = createBrowserHistory({
  // basename: '/feed/',
});

export default function configureStore(preloadedState) {
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    composeWithDevTools(
      applyMiddleware(
        routerMiddleware(history),
        thunkMiddleware
      ),
    ),
  );

  return store;
}
