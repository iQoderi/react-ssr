import types from '../constants/action-types';

const initialState = false;
const topload = (state = initialState, {type})=> {
  switch (type) {
    case types.TOP_LOADING:
      return true;
    case types.TOP_LOADED:
      return false;
    default:
      return state;
  }
}

export default  topload;
