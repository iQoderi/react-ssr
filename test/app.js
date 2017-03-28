window.onload = function () {
  var count = 0;

  function handleScroll() {
    console.log("一共触发了" + count++ + "次");
  }

  window.addEventListener('scroll', debounce(handleScroll, 200));
}

//函数防抖动
function debounce(fn, delay, immediate) {
  var timer = null;
  return function () {
    var cxt = this;
    var args = Array.prototype.slice.call(arguments);
    var later = function () {
      timer = null;
      if (!immediate) fn.apply(cxt, args);
    }

    var callNow = immediate && !timer;
    clearTimeout(timer);
    timer = setTimeout(later, delay);
    if (callNow) {
      fn.apply(cxt, args)
    }
  }
}

//函数节流
function throttle(fn, delay) {
  var _self = fn;
  var firstTime = true;
  var timer = null;
  return function () {
    var cxt = this;
    var args = Array.prototype.slice.call(arguments);
    if (fisrtTime) {
      _self.apply(cxt, args);
      return firstTime = false;
    }
    clearTimeout(timer);
    timer = setTimeout(()=> {
      
    }, delay);
  }
}
