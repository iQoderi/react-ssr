"use strict";
const throttle = function (fn, delay = 20, atleast = 500) {
  let timer = null;
  let previous = null;
  return function (...args) {
    let now = +new Date();
    const ctx = this;
    if ( !previous ) previous = now;
    if ( now - previous > atleast ) {
      fn.apply(ctx, args);
      previous = now;
    } else {
      clearTimeout(timer);
      timer = setTimeout(function() {
        fn.apply(ctx, args);
      }, delay);
    }
  }
};

export default  throttle;
