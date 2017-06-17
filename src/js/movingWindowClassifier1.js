$(function() {
  var leftScroll, rightScroll, topScroll,
    leftScrollItemLenght = $('.rule-left .rule-left-bar li').length,
    leftScrollItemHeight = $('.rule-left .rule-left-bar li').height(),
    leftScrollHeight = window.innerHeight - $('.rule-top').height();

  $('.rule-left').height(leftScrollHeight);
  var rightScrollHeight = window.innerHeight - $('.rule-top').height() - $('.rule-right-top').height();

  $('.rule-right').height(rightScrollHeight);
  leftScroll = new IScroll('.rule-left', {
    bounce: false, //取消弹性滚动
    tap: 'click',
    deceleration: .006,
  });

  rightScroll = new IScroll('.rule-right', {
    // bounce: false  取消弹性滚动
    tap: 'click',
    deceleration: .006,
  });
  topScroll = new IScroll('.rule-top', {
    tap: 'click',
    deceleration: .006,
    scrollX: true,
    scrollY: false,
    hScrollbar: false,
    vScrollbar: false,
    vScroll: false
  });
  // 点击部门
  $('.rule-left li').each(function(index, el) {
    $(this).on('tap', function(event) {
      event.stopPropagation()
      $(this).addClass('on').siblings().removeClass('on');
      if (0 < leftScrollItemLenght * leftScrollItemHeight - leftScrollHeight - index * leftScrollItemHeight) {
        event.preventDefault();
        leftScroll.scrollTo(0, -index * leftScrollItemHeight, 1000, IScroll.ease)
      } else {
        event.preventDefault();
        leftScroll.scrollTo(0, (-index * leftScrollItemHeight) - (leftScrollItemLenght * leftScrollItemHeight - leftScrollHeight - index * leftScrollItemHeight), 1000, IScroll.ease)
      }
    });
  });
  // 点击面包屑
  $('.rule-top .breadcrumb a').each(function(index, el) {
    $(this).on('tap', function(event) {
      $(this).addClass('on').siblings().removeClass('on');
    });
  });
  // 点击列表
  $('.rule-right .type-list .weui_cell').each(function(index, el) {
    $(this).on('tap', function(event) {
      $(this).addClass('on').siblings().removeClass('on');
    });
  });
  // 点击文章
  $('.rule-right .article-list .weui_cell').each(function(index, el) {
    $(this).on('tap', function(event) {
      $(this).addClass('on').siblings().removeClass('on');
    });
  });

});
