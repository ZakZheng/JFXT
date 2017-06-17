(function($) {
  /** 开启滚动和点击回调
  - 将需要的模块ID或类名传进来，暂时有三块，还需要设定对应的高度


  **/
  'use strict';

  $.fn.movingWindowClassifier = function(options) {
    var defaults = {
      headBar: options.headBar, //顶部横向滚动
      listBar: options.listBar, //点击纵向滚动到该位置
      contentBar: options.contentBar, //纵向滚动
      headBarHeight: options.headBarHeight, // 顶部高度
      listBarHeight: options.listBarHeight, // 列表高度
      contentBarHeight: options.contentBarHeight, // 内容高度
      confirm: function(ret) {}, //回调
      compile: function(ret) {}
    }
    var opts = Zepto.extend({}, defaults, options);
    var indent = $(this);
    // 单选
    if (opts.headBar) {
      $(opts.headBar).height(opts.headBarHeight);
      var topScroll = new IScroll(opts.headBar, {
        tap: 'click',
        deceleration: .006, //滑动速率 值越大越快
        scrollX: true,
        scrollY: false,
        hScrollbar: false,
        vScrollbar: false,
        vScroll: false
      });

      $('.rule-top .breadcrumb a').each(function(index, el) {
        $(this).on('tap', function(event) {
          $(this).addClass('on').siblings().removeClass('on');
          opts.confirm($(this))
          rightScroll.refresh(); //加载完数据后重新定义宽度
          topScroll.refresh(); //加载完数据后重新定义宽度
        });
      });

    }
    if (opts.listBar) {
      $(opts.listBar).height(opts.listBarHeight);

      var leftScrollItemLenght = $(opts.listBar).find('li').length,
        leftScrollItemHeight = $(opts.listBar).find('li').height(),
        leftScroll = new IScroll(opts.listBar, {
          bounce: false, //取消弹性滚动
          tap: 'click',
          deceleration: .006,
        });
      $(opts.listBar).height(opts.listBarHeight);
      $(opts.listBar).find('li').each(function(index, el) {
        $(this).on('tap', function(event) {
          event.stopPropagation()
          $(this).addClass('on').siblings().removeClass('on');
          if (0 < leftScrollItemLenght * leftScrollItemHeight - opts.listBarHeight - index * leftScrollItemHeight) {
            event.preventDefault();
            leftScroll.scrollTo(0, -index * leftScrollItemHeight, 1000, IScroll.ease)
          } else {
            event.preventDefault();
            leftScroll.scrollTo(0, (-index * leftScrollItemHeight) - (leftScrollItemLenght * leftScrollItemHeight - opts.listBarHeight - index * leftScrollItemHeight), 1000, IScroll.ease)
          }
          opts.confirm($(this))
            // rightScroll.refresh(); 如果左边列表数据也需要刷新，则使用这个
          topScroll.refresh(); //加载完数据后重新定义宽度
          rightScroll.refresh(); //加载完数据后重新定义宽度

        });
      });
    }
    if (opts.contentBar) {
      $(opts.contentBar).height(opts.contentBarHeight);

      var rightScroll = new IScroll(opts.contentBar, {
        // bounce: false  取消弹性滚动
        tap: 'click',
        deceleration: .006,
      });

      // 点击文章
      $('.rule-right .type-list .weui_cell').each(function(index, el) {
        $(this).on('tap', function(event) {
          $(this).addClass('on').siblings().removeClass('on');
          opts.confirm($(this))
          topScroll.refresh(); //加载完数据后重新定义宽度
          rightScroll.refresh(); //加载完数据后重新定义宽度
        });
      });
      // 点击文章
      $('.rule-right .article-list .weui_cell').each(function(index, el) {
        $(this).on('tap', function(event) {
          $(this).addClass('on').siblings().removeClass('on');
          opts.confirm($(this))
          topScroll.refresh(); //加载完数据后重新定义宽度
          rightScroll.refresh(); //加载完数据后重新定义宽度
        });
      });
      $('#delete').on('click', function(event) {
        event.preventDefault();
        var alert = $('<ul class="alertLayer clearfix">' + '<li class="item" id=""><a href="javascript:;"><i class="icon icon-66 circle"></i>确定</a></li>' + '<li class="item" id="abolish"><a href="javascript:;"><i class="icon icon-95 circle"></i>取消</a></li>' + '</ul>');
        $('#footer').prepend(alert)
        setTimeout(function() {
          alert.css("top", "0");
        }, 100);
        $('.rule-right .article-list .weui_cell').each(function() {
          $(this).unbind('tap')
          var checked = $('<i class="weui_icon_checked"></i>');
          $(this).find('.weui_cell_bd').append(checked);
        })
        $("#abolish").on('click', function(event) {
          $('.rule-right .article-list .weui_cell .weui_icon_checked').remove();
          alert.css("top", "50px");
          setTimeout(function() {
            alert.remove();
          }, 300);
        });
        //编辑模式
        $('.rule-right .article-list .weui_cell').each(function(index, el) {
          $(this).unbind('tap')
          $(this).on('tap', function(event) {
            $(this).find('.weui_icon_checked').addClass('on');
            opts.compile($(this))
            topScroll.refresh(); //加载完数据后重新定义宽度
            rightScroll.refresh(); //加载完数据后重新定义宽度
          });
        });


      });




    }

  }


})(Zepto);
