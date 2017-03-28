import {take, put, fork, select, call} from 'redux-saga/effects';
import types from '../constants/action-types';
import {getTopicsSucc, getTopicsFail, getTopicDetailSucc, pullTopicsSucc} from '../actions/topic-actions';
import {getNewTab} from '../utils';
import {getTopicsService, getTopicDetailService} from '../services/topic-service';


//获取文章
export function* getTopicsSaga(tab, page = 1, size = 30) {
  const oldTab = yield select(({topics})=>topics.tab);
  if (oldTab === tab) return;
  yield put({type: types.CLEAR_TOPICS});
  yield put({type: types.TOP_LOADING});
  const {data, success} = yield call(getTopicsService, tab, page, size);
  yield put({type: types.TOP_LOADED});
  if (success) {
    getNewTab(data);
    yield put(getTopicsSucc(tab, page, size, data));
  } else {
    yield put(getTopicsFail());
  }
}


//获取文章详情
export function* getTopicDetailSaga(id) {
  const oldId = yield select(({topic:{id}})=>id);
  if (oldId === id) return;
  yield put({type: types.CLEAR_TOPIC_DETAIL});
  yield put({type: types.TOP_LOADING});
  try {
    const {data} = yield call(getTopicDetailService, id);
    yield put({type: types.TOP_LOADED});
    yield put(getTopicDetailSucc(data));
  } catch (e) {
    yield put({type: types.GET_TOPIC_DETAIL_FAIL});
  }
}


function* watchGetTopics() {
  while (true) {
    const {tab, page, size} = yield take(types.GET_TOPICS);
    yield fork(getTopicsSaga, tab, page, size);
  }
}


function* watchGetTopicDetail() {
  while (true) {
    const {id}=yield take(types.GET_TOPIC_DETAIL);
    yield fork(getTopicDetailSaga, id);
  }
}

//下拉加载文章
function* watchPullTopics() {
  while (true) {
    yield take(types.PULL_TOPICS);
    let {tab, page, size} = yield select(({topics})=>topics);
    page = page + 1;
    const {data, success} = yield call(getTopicsService, tab, page, size);
    if (success) {
      getNewTab(data);
      yield put(pullTopicsSucc(data));
    } else {
      yield put({type: types.PULL_TOPICS_FAIL});
    }
  }
}

export default function* topicSaga() {
  yield fork(watchGetTopics);
  yield fork(watchGetTopicDetail);
  yield fork(watchPullTopics);
}
