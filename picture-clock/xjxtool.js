/**
 * 用来获取选择的元素
 */

var xjx = {};

// 元素选择器
xjx.$ = function (selector, context){
  var context = context || document;
  var first = selector.substr(0, 1);
  var len = selector.split(' ').length; // join
  var eles;
  // 如果是id选择器
  // console.log(first === '#' && len === 1);
  if(first === '#' && len === 1){
    console.log(selector.substr(1));
    return document.getElementById(selector.substr(1));
  }
  // 如果是CSS选择器
  eles = context.querySelectorAll(selector);
  return eles.length === 1 ? eles[0] : Array.from(eles);
}

/**
 * 获取或者设置一个DOM元素的innerHTML
 */
xjx.html = function html(ele, val){
  if(typeof val === 'undefined'){
    return ele.innerHTML;
  }
  ele.innerHTML = val;
}

/**
 * 获取或者设置一个元素的value
 */
xjx.val = function val(ele, value){
  if(typeof value === 'undefined'){
    return ele.value;
  }
  ele.value = value;
}

// 判断某个元素是否有某个class
xjx.hasClass = function (ele, cls){
  return ele.classList.contains(cls);
};

// 给某个元素添加一个class
xjx.addClass = function (ele, cls){
  ele.classList.add(cls);
};

// 给某个元素删除某个class
xjx.rmClass = function (ele, cls){
  ele.classList.remove(cls);
};

// 给某个元素toggle某个class
xjx.toggleClass = function (ele, cls){
  ele.classList.toggle(cls);
};

/**
 * 用来获取和设置元素的css样式
 */
xjx.css = function css(){
  var args = arguments, ele = args[0], type = args[1], value = args[2], len = args.length, ret, _this = this;
  
  if(len === 2){
    if(type === ''){
      ele.style.cssText = '';
      return true;
    }
    
    if(typeof type === 'string'){
      if(getTransform(type)){
        return this.cssTransform(ele, type);
      }
      
      ret = getComputedStyle(ele)[type];
      if(getStyle(type)){
        return parseFloat(ret);
      };
      return ret * 1 ? ret * 1 : ret;
    }
    
    if(typeof type === 'object'){
      for(var key in type){
        setStyle(key, type[key]);
      }
      return true;
    }
  }
  
  if(len === 3){
    setStyle(type, value);
  }
  
  function setStyle(attr, value){
    if(getStyle(attr) && typeof value === 'string'){
      ele.style[attr] = value;
    }else if(getStyle(attr)){
      ele.style[attr] = parseFloat(value) + 'px';
    }else if(getTransform(attr)){
      _this.cssTransform(ele, attr, value);
    }else{
      ele.style[attr] = value;
    }
  }
  
  function getStyle(type){
    return type === 'width' ||  type === 'height'|| type === 'left' || type === 'top' || type === 'right' || type === 'bottom';
  }
  function getTransform(type){
    return type === 'translateX' ||  type === 'translateY'|| type === 'rotate' || type === 'rotateX' || type === 'rotateY' || type === 'scale' || type === 'scaleX' || type === 'scaleY' || type === 'skewX' || type === 'skewY' || type === 'translate' || type === 'skew';
  }
}

// 必须通过这个函数设置的才能通过这个函数获取
xjx.cssTransform = function cssTransform(ele, type, value){
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
xjx.animate = function animate(ele, attrs, duration, fx, fn){
  if(typeof duration === 'undefined'){
    duration = 500;
    fx = 'linear';
  }
  
  if(typeof duration === 'number'){
    if(typeof fx === 'function'){
      fn = fx;
      fx = 'linear';
    }
    if(typeof fx === 'undefined'){
      fx = 'linear';
    }
  }
  
  if(typeof duration === 'function'){
    fn = duration;
    fx = 'linear';
    duration = 500;
  }
  
  if(typeof duration === 'string'){
    if(typeof fx === 'undefined'){
      fx = duration;
      duration = 500;
    }else{
      fn = fx;
      fx = duration;
      duration = 500;
    }
  }
  
  var beginValue = {}, changeValue = {};
  
  for(var key in attrs){
    beginValue[key] = this.css(ele, key) || 0;
    changeValue[key] = attrs[key] - beginValue[key];
  }
  
  var d = duration;
  var startTime = Date.now();
  var current, c, b, t, _this = this;
  
  window.cancelAnimationFrame(ele.animate);
  
  (function animate(){
    ele.animate = window.requestAnimationFrame(animate, ele);
    
    t = Date.now() - startTime;
    
    if(t >= d){
      t = d;
      window.cancelAnimationFrame(ele.animate);
      ele.animate = null;
    }
    
    for(key in changeValue){
      c = changeValue[key];
      b = beginValue[key];
      current = Tween[fx](t, b, c, d);
      _this.css(ele, key, current);
    }
    
    if(!ele.animate && typeof fn === 'function'){
      fn.call(ele);
    }
  })();
};

var Tween = {
	linear: function (t, b, c, d){  //匀速
		return c*t/d + b;
	},
	easeIn: function(t, b, c, d){  //加速曲线
		return c*(t/=d)*t + b;
	},
	easeOut: function(t, b, c, d){  //减速曲线
		return -c *(t/=d)*(t-2) + b;
	},
	easeBoth: function(t, b, c, d){  //加速减速曲线
		if ((t/=d/2) < 1) {
			return c/2*t*t + b;
		}
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInStrong: function(t, b, c, d){  //加加速曲线
		return c*(t/=d)*t*t*t + b;
	},
	easeOutStrong: function(t, b, c, d){  //减减速曲线
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
		if ((t/=d/2) < 1) {
			return c/2*t*t*t*t + b;
		}
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
		if (t === 0) { 
			return b; 
		}
		if ( (t /= d) == 1 ) {
			return b+c; 
		}
		if (!p) {
			p=d*0.3; 
		}
		if (!a || a < Math.abs(c)) {
			a = c; 
			var s = p/4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	elasticOut: function(t, b, c, d, a, p){    //*正弦增强曲线（弹动渐出）
		if (t === 0) {
			return b;
		}
		if ( (t /= d) == 1 ) {
			return b+c;
		}
		if (!p) {
			p=d*0.3;
		}
		if (!a || a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},    
	elasticBoth: function(t, b, c, d, a, p){
		if (t === 0) {
			return b;
		}
		if ( (t /= d/2) == 2 ) {
			return b+c;
		}
		if (!p) {
			p = d*(0.3*1.5);
		}
		if ( !a || a < Math.abs(c) ) {
			a = c; 
			var s = p/4;
		}
		else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		if (t < 1) {
			return - 0.5*(a*Math.pow(2,10*(t-=1)) * 
					Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		}
		return a*Math.pow(2,-10*(t-=1)) * 
				Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
	},
	backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
		if (typeof s == 'undefined') {
		   s = 1.70158;
		}
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	backOut: function(t, b, c, d, s){
		if (typeof s == 'undefined') {
			s = 3.70158;  //回缩的距离
		}
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	}, 
	backBoth: function(t, b, c, d, s){
		if (typeof s == 'undefined') {
			s = 1.70158; 
		}
		if ((t /= d/2 ) < 1) {
			return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		}
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
		return c - Tween['bounceOut'](d-t, 0, c, d) + b;
	},       
	bounceOut: function(t, b, c, d){//*
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
		}
		return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
	},      
	bounceBoth: function(t, b, c, d){
		if (t < d/2) {
			return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
		}
		return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
	}
}


