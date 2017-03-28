import React,{Component} from 'react';
import TopicItem from '../topic-item';
import './index.less';

export default class TopicList extends Component{
  constructor(props) {
    super(props);
  }
  render(){
    const {topics} = this.props;
    return(
      <div>
        {
          topics.map((topic)=>{
            return (
              <TopicItem topic={topic} key={topic.id}/>
            )
          })
        }
      </div>
    )
  }
}

