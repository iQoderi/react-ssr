import React,{Component} from 'react';
import {Link} from 'react-router';
import './index.less';

export default class TopiclItem extends Component{
  constructor(props) {
    super(props);
  }
  render(){
    const {topic:{title,author,newTab,good,top,reply_count,visit_count,id}} =this.props;
    return (
      <div className="topic-item">
        <img className="avator" src={author.avatar_url} alt="头像"/>
        <div className="title-wrapper">
          <span className={"normal-tap "+((good||top)&&"put-top")}>{newTab}</span>
          <Link to={`/topic/${id}`} className='topic-title'>
            {title}
          </Link>
        </div>
        <div className="reply-count">
          <span className="count">{reply_count}</span>
          <span className="line">/</span>
          <span className="visit">{visit_count}</span>
        </div>
        <div className="last-time">
          3小时前
        </div>
      </div>
    )
  }
}

