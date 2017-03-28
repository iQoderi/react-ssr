import React from 'react';
import {Router,Route,browserHistory} from 'react-router';
import App from '../components/app';
import Home from '../components/home';
import TopicDetail from '../components/topic-detail';

const RouterApp=(
    <Router history={browserHistory}>
      <Route path='/' components={App}>
        <Route path='home/:tab' components={Home}/>
        <Route path='topic/:id' components={TopicDetail}/>
      </Route>
    </Router>
)

export  default  RouterApp;
