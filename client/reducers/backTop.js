import types from '../constants/action-types';

const initialState = false;
const backTopVisible = (state = initialState, {type})=> {
  switch (type) {
    case types.SHOW_BACK_TOP:
      return true;
    case types.HIDE_BACK_TOP:
      return false;
    default:
      return state;
  }
}

export default  backTopVisible;
