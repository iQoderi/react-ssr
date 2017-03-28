import React from 'react';
import back from '../../images/back.png';
import './index.less';

export default  function Navigator ({title}){
  return (
    <div className="navigator">
      <img src={back} alt="返回" onClick={()=>{history.go(-1)}}/>
      <span className="title">{title}</span>
    </div>
  )
}



