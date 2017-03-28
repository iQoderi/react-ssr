import types from '../constants/action-types';
import {createAction} from '../utils';

//文章列表相关
export const getTopics = (tab, page = 1, size = 30)=> {
  return {
    type: types.GET_TOPICS,
    tab,
    page,
    size
  }
};

export const getTopicsSucc = (tab, page, size, topics)=> {
  return {
    type: types.GET_TOPICS_SUCCESS,
    tab,
    page,
    size,
    topics
  }
}

export const getTopicsFail = createAction(types.GET_TOPICS_FAIL);

//下拉加载
export const pullTopic = createAction(types.PULL_TOPICS);

export const pullTopicsSucc = (topics)=> {
  return {
    type:types.PULL_TOPICS_SUCCESS,
    topics
  }
}


//文章详情
export const getTopicDetail = (id)=> {
  return {
    type: types.GET_TOPIC_DETAIL,
    id
  }
}

export const getTopicDetailSucc = (payload)=> {
  return {
    type: types.GET_TOPIC_DETAIL_SUCCESS,
    payload
  }
}


//显示隐藏backtop
export const showBackTop = createAction(types.SHOW_BACK_TOP);
export const hideBackTop = createAction(types.HIDE_BACK_TOP);

