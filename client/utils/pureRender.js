'use strict';
import shallowCompare from 'react-addons-shallow-compare';

export default function pureRender(reactComponent){
  reactComponent.prototype.shouldComponentUpdate=function(nextProps, nextState){
    return shallowCompare(this, nextProps, nextState);
  }
}
