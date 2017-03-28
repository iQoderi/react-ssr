import React,{Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getTopicDetail} from '../../actions/topic-actions';
import {getTopicDetailSaga} from '../../sagas/topic'
import Navigator from '../navigator';
import Reply from '../reply';
import tabs from '../../config/tab';

import './index.less';

const mapStateToProps = ({topic})=> {
  return {
    topic
  }
}

const mapDispatchToProps = (dispatch)=> {
  const actions = {getTopicDetail};
  const actionMap = {actions: bindActionCreators(actions, dispatch)}
  return actionMap;
}

@connect(mapStateToProps,mapDispatchToProps)
export default class TopicDetail extends Component{
  constructor(props) {
    super(props);
  }

  makeUpHtml=()=>{
    const {topic:{content}} = this.props;
    return {__html: content};
  }

  static preload({id}){
    return [
      [getTopicDetailSaga,id]
    ]
  }

  componentDidMount() {
    const {params:{id},actions:{getTopicDetail}} = this.props;
    getTopicDetail(id);
    window.onscroll = null;
  }

  render(){
    const {topic:{title,visit_count,author,tab,create_at,good,top,replies,reply_count}} = this.props;
    return (
      <div className="topic-detail-container">
        <Navigator title={title}/>
        <div className="inner" >
          <div className="topic-title">
            <span className={"normal-tap "+((good||top)&&"put-top")}>{tabs[tab]||'未知'}</span>
            {title}
            <div className="changes">
              <span>发布于{create_at}</span>
              <span>作者{author.loginname}</span>
              <span>{visit_count}次浏览</span>
              <span>来自{tabs[tab]}</span>
            </div>
          </div>
          <div dangerouslySetInnerHTML={this.makeUpHtml()}/>
        </div>
        <Reply replies={replies} count={reply_count}/>
      </div>
    )
  }
}

