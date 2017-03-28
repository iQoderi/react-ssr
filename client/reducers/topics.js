import types from '../constants/action-types';
const initialState = {
  tab: '',
  page: 1,
  size: 30,
  data: []
}

export default (state = initialState, action)=> {
  switch (action.type) {
    case types.GET_TOPICS_SUCCESS:
      return {
        tab: action.tab,
        page: action.page,
        size: action.size,
        data: action.topics
      }
    case types.GET_TOPICS_FAIL:
    case types.CLEAR_TOPICS:
      return {
        tab: action.tab,
        page: action.page,
        size: action.size,
        data: []
      }
    case types.PULL_TOPICS_SUCCESS:
      console.log(action.topics,'topics');
      return {
        tab: state.tab,
        page: state.page + 1,
        size: state.size,
        data: [...state.data, ...action.topics]
      }
    case  types.PULL_TOPICS_FAIL:
    default:
      return state;
  }
}
