// Modules
import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

// constants
import * as Types from "../constants/action_types";

// Helpers
import { getUnique } from "../helpers/index";

const designs = (
  state = {
    count: 0,
    list: []
  },
  action
) => {
  switch(action.type) {
    case Types.DESIGNS:
      const uniqueList = getUnique([...action.payload.list, ...state.list]);
      return {...state, count: state.count + action.payload.count, list: uniqueList};
    default:
      return state;
  }
}

const heightsOf = (
  state = {
    set: false,
    dynamic: false,
    header: 0,
    footer: 0,
    main: 0
  }, 
  action
) => {
  switch(action.type){
    case Types.HEIGHTS:
      return {...state, ...action.payload};
    default:
      return state;
  }
};

const user = (
  state = {
    isLoggedIn: false
  }, 
  action) => {
    switch(action.type){
      case Types.USER:
        return {...action.payload};
      default:
        return state;
    };
};

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  designs,
  heightsOf,
  user
});
export default createRootReducer;
