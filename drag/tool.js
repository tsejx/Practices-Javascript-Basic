/**
 * 工具函数 by Fq
 */

// 获取元素绝对边界函数
const getRect = function (ele, type){
  return ele.getBoundingClientRect()[type];
}

// 碰撞检测函数
const duang = function (current, target){
  var currentRect = current.getBoundingClientRect();
  var targetRect = target.getBoundingClientRect();
  var currentLeft = currentRect.left, 
      currentTop = currentRect.top,
      currentRight = currentRect.right,
      currentBottom = currentRect.bottom;
  var targetLeft = targetRect.left, 
      targetTop = targetRect.top,
      targetRight = targetRect.right,
      targetBottom = targetRect.bottom;
  return currentRight > targetLeft && currentBottom > targetTop && currentLeft < targetRight && currentTop < targetBottom;
}

const createRn = function (arr){
  var max = Math.max(...arr);
  var min = Math.min(...arr);
  return Math.round(Math.random() * (max - min) + min);
};

// 设置和获取元素的样式
const css = function (ele, type, value){
  var testPx = /^(\d+)(\.\d+)?(px)$/i,
      eleStyle = getComputedStyle(ele),
      ret = null;
  
  if(typeof value === 'undefined'){
    if(typeof type === 'object'){
      for(var key in type){
        setStyle.call(this, key, type[key]);
      }
    }else{
      if(eleStyle.hasOwnProperty(type)){
        ret = eleStyle[type];
        return testPx.test(ret) ? parseFloat(ret) : ret;
      }else{
        return cssTransform(ele, type) || 0;
      }
    }
  }else{
    setStyle.call(this, type, value);
  }
  function setStyle(key, value){
    if(eleStyle.hasOwnProperty(key)){
      if(key === 'opacity'){
        ele.style.opacity = value;
      }else{
        ele.style[key] = typeof value === 'string' ? value : value + 'px';
      }
    }else{
      cssTransform(ele, key, value)
    }
  }
}

// 设置和获取元素的3d样式
const cssTransform = function (ele, type, value){
  var attrs = ele.__transform = ele.__transform || {}, str = '';
  if(typeof value === 'undefined'){
    return attrs[type];
  }
  attrs[type] = value;
  for(var key in attrs){
    switch(key){
      case 'translateX':
      case 'translateY':
        str += ` ${key}(${parseFloat(attrs[key])}px)`;
      break;
      case 'rotate':
      case 'rotateX':
      case 'rotateY':
      case 'skewX':
      case 'skewY':
        str += ` ${key}(${parseFloat(attrs[key])}deg)`;
      break;
      default:
        str += ` ${key}(${attrs[key]})`;
    }
  }
  ele.style.transform = str.trim();
}

// 动画函数
const animation = function (ele, attrs, duration, fn){
  if(ele.animation) return;
  if(typeof duration === 'function'){
    fn = duration;
    duration = 500;
  }
  if(typeof duration === 'undefined'){
    duration = 500;
  }
  var beginValue = {}, changeValue = {};
  for(var key in attrs){
    beginValue[key] = css(ele, key) || 0;
    changeValue[key] = attrs[key] - beginValue[key];
  }
  var d = duration;
  var startTime = Date.now();
  var current, c, b, t;
  const animation = () => {
    ele.animation = window.requestAnimationFrame(animation, ele);
    t = Date.now() - startTime;
    if(t >= d){
      t = d;
      window.cancelAnimationFrame(ele.animation);
      ele.animation = null;
    }
    for(key in changeValue){
      c = changeValue[key];
      b = beginValue[key];
      current = c/d*t+b;
      css(ele, key, current);
    }
    if(!ele.animation && typeof fn === 'function'){
      fn.call(ele);
    }
  };
  animation();
};