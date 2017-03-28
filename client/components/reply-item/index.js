import React,{Component} from 'react';
import './index.less';

export default  class ReplyItem extends Component{
  constructor(props) {
    super(props);
  }
  makeUpHtml(){
    const {content} =this.props.reply;
    return {__html: content};
  }
  render(){
    const {create_at,author} =this.props.reply;
    return (
      <div className="reply-item">
        <div className="author">
          <img src={author.avatar_url} title="avator"/>
          <div className="user-info">
            <a href="javascript:;" className="reply-author">{author.loginname}</a>
            <a href="javascript:;" className="reply-time">{create_at}</a>
          </div>
          <div className="reply-content" dangerouslySetInnerHTML={this.makeUpHtml()}/>
        </div>
      </div>
    )
  }
}

