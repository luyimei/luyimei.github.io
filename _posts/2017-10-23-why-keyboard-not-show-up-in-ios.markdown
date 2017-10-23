---
layout:     post
title:      "为什么js的focus()方法在iOS下拉不起键盘"
subtitle:   "记一次踩坑的经历"
date:       2017-10-23
author:     "YM"
header-img: "img/sky.jpg"
header-mask: 0.3
catalog:    true
tags:
    - 前端开发
    - JavaScript
    - 陨石坑
---

> 观吾之一生，纵横跋扈，踩坑无数。

## 背景

在做h5开发的时候，一个常见的需求是点击某个按钮，显示隐藏的文本输入框（`input`或`textarea`），并使输入框**获取焦点**，同时**拉起键盘**。如博主最近在做的企鹅优品项目中的[写留言功能](http://youpin.qq.com/h5/article/detail?id=224748681000)。

讲到这里大家伙就该喷了：就这种小功能还写篇文章？老子复制粘贴分分钟给你写出来：

```html
<!-- 样式参考上面的“写留言功能” -->
<button id="button">写留言</button>
<div id="modal" style="display:none;">
  <textarea id="textarea"/>
</div>
```

```javascript
// 这是个反例
$('#button').tap(function(){
  $('#modal').show(function(){
    $('#textarea').focus();
  });
});
```

上面的代码，是**有问题的**。这段代码在pc上、在安卓设备上都可以完美运行。但是在iOS设备上，是**拉不起键盘**的。

## 原因

先介绍`safari`的`webkit`所**特有的**一个属性[keyboardDisplayRequiresUserAction](https://developer.apple.com/documentation/uikit/uiwebview/1617967-keyboarddisplayrequiresuseractio)。

> A Boolean value indicating whether web content can programmatically display the keyboard.
>
> When this property is set to `true`, the user must explicitly tap the elements in the web view to display the keyboard (or other relevant input view) for that element. When set to `false`, a focus event on an element causes the input view to be displayed and associated with that element automatically.
>
> The default value for this property is `true`.

从这个属性的名字，我们能猜出来它表示的意思：**键盘显示是否需要用户动作**。会有这么一个属性当然是因为Apple考虑到用户体验，为了尽量不打扰用户（比如进一个辣鸡页面，啥都没干就嗷嗷给你弹键盘，点都点不下去）。

上面那串英文可以这么理解：当这个属性是`true`的时候，用户必须主动触发事件（通过点击等动作触发事件）才能拉起键盘；当这个属性是`false`的时候，通过`focus`事件即可拉起键盘，而不管这个`focus`事件是来自于用户的动作还是来自于代码；这个属性默认是`true`。

那为啥背景里的例子是错的？看着似乎没什么问题啊：点击“写留言”的时候才去拉起键盘，有用户动作啊，即便`keyboardDisplayRequiresUserAction`是`true`也应该能拉起键盘吧？

莫急，这个例子错的地方有点多，一时半会说不清，我们先看几个其它示例，再回头来分析。

## 示例

下面的几个示例统一采用如下html结构：

```html
<textarea id="textarea" />
<button id="button">写留言</button>
```

#### 1、使用`$.ready`方法，不能拉起键盘

```javascript
$.ready(function(){
  $('#textarea').focus();
});
```

无论是`$.ready`还是`window.onload`，都是不能拉起键盘的。因为这些事件都不是用户的主动动作触发的。

#### 2、使用`$('#textarea').trigger`方法，不能拉起键盘

```javascript
$.ready(function(){
  $('#textarea').trigger('click');
});
```

这种做法依然是不能拉起键盘的，这里的`click`事件是代码生成的，而不是用户的主动动作触发的。

#### 3、使用`click`事件，能拉起键盘

```javascript
$('#button').click(function(e){
  $('#textarea').focus();
});
```

为什么这么写可以拉起键盘？因为这里的`click`事件是用户的主动动作触发的。

#### 4、使用`click`事件，并结合`setTimeout`，不能拉起键盘

```javascript
$('#button').click(function(e){
  setTimeout(function(){
    $('#textarea').focus();
  }, 100);
});
```

这里仅仅是多了一个`setTimeout`，为什么就不能拉起键盘了？

讲真，我搜遍`Google`，也没找到一个有说服力的解释。不过后来我想通了，我觉得可以这样理解：js代码是按照任务队列的方式执行的。当`$('#textarea').focus()`执行的时候，已经不在 `click`的回调函数所对应的任务里了，而是在一个新的任务里。`keyboardDisplayRequiresUserAction`不认`setTimeout`的回调部分了。

#### 5、使用`tap`，不能拉起键盘

```javascript
$('#button').tap(function(e){
  $('#textarea').focus();
});
```

为什么用`tap`不能拉起键盘？因为`tap`不是一个原生的事件，浏览器里压根就没这事件。`tap`是`jquery`、`zepto`等库利用`touch`事件模拟的。在模拟`tap`的过程中应该是用到了`setTimeout`，拉不起来键盘也就可以理解了。具体怎么模拟的可以去翻翻这些库的源码。

#### 6、使用`touch`事件，能不能拉起键盘？

```javascript
$('#button').on('touchstart', function(e){ // 或touchend
  $('#textarea').focus();
});
```

这个没有去验证，场景太多太繁琐。不过我认为能，因为想不到不能的理由。

#### 7、有`ajax`请求，怎么办？

```javascript
$('#button').click(function(e){
  $.ajax({
     url: 'xxx',
     data: {},
     success: function(res){
       $('#textarea').focus();
     }
  });
});
```

将`focus`写在`ajax`的回调里是不能拉起键盘的，原因同`setTimeout`。

但是有时候确实有这种场景，怎么办？要么换种方式做（把这个需求怼回去），要么给`ajax`请求加个参数`async: false`吧。`ajax`是同步的话`keyboardDisplayRequiresUserAction`是会认的，因为都在一个任务里。

#### 8、用了`fastclick`，能拉起键盘么？ 

经过实验，`fastclick`并不会对这个问题造成影响。也就是说，直接用`click`时候的写法能拉起键盘的话，引人`fastclick`后依然能拉起键盘。

## 总结

最后我们看回一开始的例子，就知道存在什么问题了：

1. 用了`tap`
2. `show`包了一层，用了回调

怎么改？

```javascript
// 可以引入fastclick，来提高click的性能
$('#button').click(function(){
  $('#modal').show();
  $('#textarea').focus();
});
```

END.