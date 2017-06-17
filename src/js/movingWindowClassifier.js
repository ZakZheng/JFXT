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

      confirm: function(ret) {}, //普通模式点击回调当前选中对象
      compile: function(ret) {}, // 编辑模式选中回调当前选中对象
      submitChange: function(ret) {}, //提交编辑回调所有被选中对象
    }
    var opts = Zepto.extend({}, defaults, options);
    // 判断是否为编辑模式
    var editFlag = false;
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
      // 顶部事件
      $(opts.headBar).find('.breadcrumb a').each(function(index, el) {
        topScroll.scrollTo(topScroll.maxScrollX, 0)
        $(this).on('tap', function(event) {
          if (!editFlag) {
            $(this).addClass('on').siblings().removeClass('on');
            opts.confirm($(this))
            if (opts.contentBar) rightScroll.refresh(); //加载完数据后重新定义宽度
            if (opts.headBar) topScroll.refresh(); //加载完数据后重新定义宽度
          } else {
            return false;
          }
        });
      });
    }
    // 列表事件
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
          if (!editFlag) {
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
              // if(opts.contentBar) rightScroll.refresh(); 如果左边列表数据也需要刷新，则使用这个
            if (opts.headBar) topScroll.refresh(); //加载完数据后重新定义宽度
            if (opts.contentBar) rightScroll.refresh(); //加载完数据后重新定义宽度
          } else {
            return false;
          }
        });
      });
    }
    // 内容事件
    if (opts.contentBar) {
      $(opts.contentBar).height(opts.contentBarHeight);
      var rightScroll = new IScroll(opts.contentBar, {
          // bounce: false  取消弹性滚动
          tap: 'click',
          deceleration: .006,

        }),
        typeListItem = '.rule-right .type-list .weui_cell', // 不可编辑的内容列表
        articleListItem = '.rule-right .article-list .weui_cell'; // 可编辑的内容列表
      // 未进入编辑状态时,内容列表只返回当前点击对象
      var defaultsListEvent = function() {
        $(typeListItem).each(function(index, el) {
          $(this).on('tap', function(event) {
            if (!editFlag) {
              $(this).addClass('on').siblings().removeClass('on');
              opts.confirm($(this))
              if (opts.headBar) topScroll.refresh(); //加载完数据后重新定义宽度
              if (opts.contentBar) rightScroll.refresh(); //加载完数据后重新定义宽度
            } else {
              return false;
            }
          });
        });
        $(articleListItem).each(function(index, el) {
          $(this).on('tap', function(event) {
            if (!editFlag) {
              $(this).addClass('on').siblings().removeClass('on');
              opts.confirm($(this))
              if (opts.headBar) topScroll.refresh(); //加载完数据后重新定义宽度
              if (opts.contentBar) rightScroll.refresh(); //加载完数据后重新定义宽度
            } else {
              return false;
            }
          });
        });
      }
      defaultsListEvent();
      // 点击删除，进入编辑模式
      $('#delete').on('click', function(event) {
        event.preventDefault();
        // 进入编辑状态，取消与编辑无关点击事件
        editFlag = true;
        // 取消已有点击事件
        var abolishThatChange = function(that) {
            $(that).each(function(index, el) {
              $(this).unbind('tap');
            });
          }
          // 定义底部弹出的＇确定＇，＇取消＇
        var alertLayer = $('<ul class="alertLayer clearfix">' + '<li class="item" id="submitChange"><a href="javascript:;"><i class="icon icon-66 circle"></i>确定</a></li>' + '<li class="item" id="abolish"><a href="javascript:;"><i class="icon icon-95 circle"></i>取消</a></li>' + '</ul>');
        // 在底部前方插入编辑栏
        $('#footer').prepend(alertLayer)
        setTimeout(function() {
          alertLayer.css("top", "0");
        }, 0);
        // 取消可编辑列表的默认点击事件，并在每一项可编辑项后加入按钮
        $(articleListItem).each(function() {
          $(this).unbind('tap')
          var checked = $('<i class="weui_icon_checked"></i>');
          $(this).find('.weui_cell_bd').append(checked);
        })
        abolishThatChange(articleListItem);
        // 点击取消按钮时，隐藏编辑栏，删除编辑项按钮
        $("#abolish").on('click', function(event) {
          event.preventDefault();
          abolishThatChange(articleListItem);
          $(articleListItem).find($('.weui_icon_checked')).remove();
          alertLayer.css("top", "50px");
          setTimeout(function() {
            alertLayer.remove();
          }, 300);
          // 恢复未编辑状态的点击事件
          editFlag = false;
          defaultsListEvent();
        });

        var bar = $(''); //定义返回的选中标签
        // 点击确认按钮时,将选中的可编辑项的对象回调
        $("#submitChange").on('click', function(event) {
          event.preventDefault();
          abolishThatChange(articleListItem);
          $(articleListItem).find($('.weui_icon_checked')).remove();
          opts.submitChange(bar);
          alertLayer.css("top", "50px");
          setTimeout(function() {
            alertLayer.remove();
          }, 300);
          // 恢复未编辑状态的点击事件
          editFlag = false;
          if (opts.contentBar) rightScroll.refresh(); //加载完数据后重新定义宽度
          defaultsListEvent();
        });
        //编辑模式下，点击可编辑列表时回调被点击对象
        $(articleListItem).each(function(index, el) {
          $(this).unbind('tap')
          $(this).on('tap', function(event) {
            if (!$(this).find('.weui_icon_checked').hasClass('on')) {
              $(this).find('.weui_icon_checked').addClass('on');
              bar.push(this);
              opts.compile($(this))
            } else {
              $(this).find('.weui_icon_checked').removeClass('on');
              opts.compile($(this))
            }
          });
        });
      });
    }
  }
})(Zepto);
