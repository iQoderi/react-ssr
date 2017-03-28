import types from '../constants/action-types';
const initialState = {
  author:{},
  replies:[]
}

export default (state = initialState, action)=>{
  switch (action.type){
    case types.GET_TOPIC_DETAIL_SUCCESS:
      return action.payload;
    case types.GET_TOPIC_DETAIL_FAIL:
    case types.CLEAR_TOPIC_DETAIL:
      return initialState;
    default:
      return state;
  }
}
