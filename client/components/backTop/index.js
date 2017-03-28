import React, {Component} from 'react';
import {connect} from 'react-redux';
import './index.less';

const mapStateToProps = ({backTopVisible})=> {
  return {
    backTopVisible
  }
}

@connect(mapStateToProps)
export default class BackTop extends Component {
  constructor(props) {
    super(props);
    this.scrollToTop = this.scrollToTop.bind(this);
    this.timer = null;
  }

  scrollToTop() {
    let totalTime = 100;
    let scrollTop = document.body.scrollTop;
    let scrollDis = 0;
    let speed = 1;
    clearInterval(this.timer);
    if (scrollTop > 0) {
      this.timer = setInterval(()=> {
        scrollDis = document.body.scrollTop - scrollTop / totalTime;
        window.scrollTo(0, scrollDis);
        if (document.body.scrollTop <= 0) {
          clearInterval(this.timer);
        }
      }, speed)
    }
  }

  render() {
    const {backTopVisible} = this.props;
    return (
      <div style={{display:backTopVisible?'block':'none'}} className="back-top" onClick={this.scrollToTop}>
        回到顶部
      </div>
    )
  }
}
