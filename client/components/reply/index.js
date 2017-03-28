import React,{Component} from 'react';
import ReplyItem from '../reply-item';
import './index.less';

export default  class Reply extends Component{
  constructor(props) {
    super(props);
  }
  render(){
    const {replies,count} = this.props;
    return (
      <div className="reply">
        <div className="reply-header">
          {`${count} 回复`}
        </div>
        {
          replies.map((reply)=>{
            return(
              <ReplyItem reply={reply} key={reply.id}/>
            )
          })
        }
      </div>
    )
  }
}
