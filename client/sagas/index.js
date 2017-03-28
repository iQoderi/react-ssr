import {fork} from 'redux-saga/effects';
import topicSaga from './topic';

export default function* rootSaga() {
  yield fork(topicSaga)
}
