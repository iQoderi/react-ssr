import React, {Component} from 'react';
import TopicList from '../topic-list';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getTopics, pullTopic, showBackTop, hideBackTop} from '../../actions/topic-actions';
import {throttle} from '../../utils';
import NavBar from '../navbar';
import './index.less';

const mapStateToProps = ({topics, topload})=> {
  return {
    topics,
    topload
  }
}

const mapDispatchToProps = (dispatch)=> {
  const actions = {getTopics, pullTopic,showBackTop, hideBackTop};
  const actionMap = {actions: bindActionCreators(actions, dispatch)}
  return actionMap;
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.handleScroll = this.handleScroll.bind(this);
    this.preScrollTop = 0;
  }

  handleScroll() {
    const windowH = document.documentElement.clientHeight || window.innerHeight;
    const scrollTop = document.body.scrollTop;
    const totalH = windowH + scrollTop;
    const {offsetTop} = this.refs.refresh;
    const showBackTopLimit = windowH + 100;
    const {actions:{pullTopic, showBackTop, hideBackTop}} = this.props;
    const limitTop = 500;
    if (this.preScrollTop <= scrollTop) {
      this.preScrollTop = scrollTop;
      if (offsetTop - totalH < limitTop) {
        pullTopic();
      }
    }
    if (scrollTop >= showBackTopLimit) {
      showBackTop();
    } else {
      hideBackTop();
    }
  }

  componentDidMount() {
    let {actions:{getTopics}, params} = this.props;
    if (!params) {
      params = {tab: 'all'}
    }
    getTopics(params.tab);
    window.onscroll = throttle(this.handleScroll, 300, 1000);
  }

  componentWillReceiveProps(nextProps) {
    const {topics:{page}} = nextProps;
    if (page === 1) {
      this.preScrollTop = 0;
    }
  }

  render() {
    const {topics:{data}, topload, actions:{getTopics}} = this.props;
    return (
      <div className="home-container">
        <NavBar getTopics={getTopics}/>
        <div className="gap"/>
        <TopicList topics={data}/>
        <div style={{display: topload ? 'none' : 'block'}} className="refresh-bottom" ref="refresh">
          上拉加载...
        </div>
      </div>
    )
  }
}

