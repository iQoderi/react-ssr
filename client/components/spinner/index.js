import React from 'react';
import {connect} from 'react-redux';
import './index.less';

const Spinner = ({topload})=>{
  return (
    <div className="spinner" style={{display:topload?'block':'none'}}/>
  )
}

const mapStateToProps = ({topload})=> {
  return {
    topload
  }
}

export default connect(mapStateToProps)(Spinner);
