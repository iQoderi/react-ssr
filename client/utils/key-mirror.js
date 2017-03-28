"use strict";
export default (opt)=>{
  let res = {};
  for(var item in opt){
    if(opt.hasOwnProperty(item)){
      res[item] = item;
    }
  }

  return res;
}
