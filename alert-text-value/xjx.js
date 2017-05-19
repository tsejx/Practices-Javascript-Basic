/**
 * 用来获取选择的元素
 */
function $(selector){
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
  eles = document.querySelectorAll(selector);
  return eles.length === 1 ? eles[0] : Array.from(eles);
}

/**
 * 获取或者设置一个DOM元素的innerHTML
 */
function html(ele, val){
  if(typeof val === 'undefined'){
    return ele.innerHTML;
  }
  ele.innerHTML = val;
}

/**
 * 获取或者设置一个元素的value
 */
function val(ele, value){
  if(typeof value === 'undefined'){
    return ele.value;
  }
  ele.value = value;
}

function css(){
  var args = arguments;
  var ele = args[0], type = args[1], value = args[2];
  var len = args.length;
  
  // 如果是两个参数的时候
  if(len === 2){
    // 获取元素计算后的样式
    return parseFloat(getComputedStyle(ele)[type]);
  }
  // 如果是三个参数的情况
  if(len === 3){
    ele.style[type] = value + 'px';
  }
}