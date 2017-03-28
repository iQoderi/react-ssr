import {combineReducers} from 'redux';
import topics from './topics';
import topic from './topic';
import topload from './top-load';
import backTopVisible from './backTop';

export default combineReducers({
  topics,
  topic,
  topload,
  backTopVisible
});
