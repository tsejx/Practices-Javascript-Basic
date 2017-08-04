(function (){
  
  var data = [
    {
      img: './image/1.jpg',
      h2: '妹子挺漂亮',
      h3: '可惜是假的'
    },
    {
      img: './image/2.jpg'
    },
    {
      img: './image/3.jpg'
    },
    {
      img: './image/4.jpg'
    },
    {
      img: './image/5.jpg'
    },
    {
      img: './image/6.jpg'
    },
    {
      img: './image/7.jpg'
    }
  ];
  
  // 最外层容器
  var slideContainer = document.querySelector('.slide-container');
  
  // 幻灯片和导航栏容器
  var slideWrapper = document.querySelector('.slides');
  var navsWrapper = document.querySelector('.navs');
  
  // 生成所有的幻灯片以及导航栏按钮
  
  function createSlideHtml(data){
    var sildeHtml = ``, navHtml = ``;
    for(var i=0; i<data.length; i++){
      sildeHtml += `<div class="slides-item ${i%2 ? 'right' : 'left'}">
                        <span class="pic" style="background-image: url(${data[i].img});"></span>
                        <div class="caption"></div>
                    </div>`;
      navHtml += `<span class="navs-item">
                    <img src="${data[i].img}">
                  </span>`;
    }
    return {sildeHtml, navHtml};
  }
  
  (function initSlideHtml(){
    var htmlData = createSlideHtml(data);
    slideWrapper.innerHTML = htmlData.sildeHtml;
    navsWrapper.innerHTML = htmlData.navHtml;
  })();
  
  // 获取到所有的幻灯片和对应的按钮
  var slideImgs = document.querySelectorAll('.slides-item');
  var navBtns = document.querySelectorAll('.navs-item');
  
  // 切换按钮
  var prevBtn = document.querySelector('.prev');
  var nextBtn = document.querySelector('.next');
  
  // 当前显示的索引
  var index = 0, len = navBtns.length, timer;
  
  // 初始化让第一张图片显示出来
  tabSlide(index)
  
  // 点击按钮进行切换
  for(var i=0; i<len; i++){
    (function (i){
      navBtns[i].onclick = function (){
        tabSlide(index = i);
      };
    })(i);
  }
  
  // 左右切换按钮功能
  prevBtn.onclick = function (){
    index = index > 0 ? --index : len - 1;
    tabSlide(index);
  };
  
  nextBtn.onclick = function (){
    index = index < len - 1 ? ++ index : 0;
    tabSlide(index);
  };
  
  // 自动轮播功能
  timer = setInterval(nextBtn.onclick, 3000);
  
  // 鼠标悬停
  slideContainer.onmouseover = function (){
    clearInterval(timer);
  };
  
  slideContainer.onmouseout = function (){
    timer = setInterval(nextBtn.onclick, 3000);
  };
  
  // 切换图片的逻辑
  function tabSlide(index){
    for(var i=0; i<len; i++){
      slideImgs[i].classList.remove('active');
      navBtns[i].classList.remove('active');
    }
    slideImgs[index].classList.add('active');
    navBtns[index].classList.add('active');
    
    setTimeout(function() {
      slideWrapper.style.backgroundImage = `url(${data[index].img})`;
    }, 1001);
  }
})();