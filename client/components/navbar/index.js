import React,{Component} from 'react';
import {Link} from 'react-router';
import navList from '../../config/nav';
import {uuid} from '../../utils';
import './index.less';

export default class NavBar extends Component{
  constructor(props) {
    super(props);
  }
  renderNav = ()=>{
    const {getTopics} =this.props;
    return navList.map((nav,index)=>{
      return (
        <li onClick={()=>{getTopics(nav.link)}} key={uuid(index)}>
          <Link activeClassName='active-nav' to={`/home/${nav.link}`}>{nav.name}</Link>
        </li>
      )
    })
  }
  render(){
    return(
      <div className="header">
        <ul className="nav-list">
          {this.renderNav()}
        </ul>
      </div>
    )
  }
}

