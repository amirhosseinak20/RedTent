// Modules
import axios from "axios";

// Constants
import * as Types from "../constants/action_types";
import * as API from "../constants/API"

const designs = (payload) => {
  return {
    type: Types.DESIGNS,
    payload
  }
};

export const feed = (from, row) => {
  return async (dispatch) => {
    // const url = `${API.designs}_from=${from}&_row=${row}&_order_by=`
    // const mostRated = await axios.get(`${url}rate`);
    // const mostViewd = await axios.get(`${url}view`);
    // const news = await axios.get(`${url}upload_date`);
    // const list = [...mostRated.data, ...mostViewd.data, ...news.data]);
    const list = await axios.get(`${API.designs}_from=${from}&_row=${row}`)
    dispatch(designs({count: row, list: list.data}));
  };
};

export const heightsOf = (payload) => {
  return {
    type: Types.HEIGHTS,
    payload
  }
};

export const user = (payload) => {
  return {
    type: Types.USER,
    payload
  }
};
