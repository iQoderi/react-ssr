import React,{Component} from 'react';
import Home from './home';
import Spinner from './spinner';
import BackTop from './backTop';
import {pureRender} from '../utils';
import {getTopicsSaga} from '../sagas/topic';
import './app.less';

@pureRender
export default class App extends Component{
  constructor(props) {
    super(props);
  }
  static preload(params){
    if(params && !params.tab){
      params.tab = 'all';
    }
    return [
      [getTopicsSaga,params.tab]
    ];
  }
  render(){
    return (
      <div>
        <Spinner/>
        <BackTop/>
        {this.props.children || <Home/>}
      </div>
    )
  }
}

