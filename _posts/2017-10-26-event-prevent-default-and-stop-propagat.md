---
layout:     post
title:      "关于阻止事件默认行为及停止传播"
date:       2017-10-26 19:00
author:     "YM"
header-img: "img/posts/code.jpg"
header-mask: 0.3
catalog:    true
tags:
    - 前端开发
    - JavaScript
    - Event
---

> 讲这个主题的文章已经烂大街了，但是在调研过程中发现大部分文章描述得并不准确或不充分，故此整理出此文。

### `event.preventDefault()`

#### 1.1 含义

* `preventDefault`方法用于阻止浏览器的**默认行为**。何为默认行为？比如点击`a`标签，浏览器的默认行为是跳转新页面。
* 通过查看`event.cancelable`属性来判断一个事件的默认行为是否可以被取消。在`cancelable`属性为`false`的事件上调用`preventDefault`方法是没有任何效果的。
* 调用事件的`preventDefault`方法后，会引起该事件的`event.defaultPrevented`属性值变为`true`。
* 调用`preventDefault`方法并不会影响事件的进一步传播。

#### 1.2 兼容性 

对于`IE8`及更低版本的`IE`浏览器，是不存在`preventDefault`方法的。可以通过使用`IE`特有的`event.returnValue`属性来模拟。

```javascript
if (!Event.prototype.preventDefault) {
  Event.prototype.preventDefault = function() {
    this.returnValue = false;
  };
}
```

`jQuery`的事件对象`Event`同样有一个`preventDefault`方法。注意，下例中的`e`变量是一个`jQuery`对象，而不是原生的`JavaScript`对象。

```javascript
$('a').click(function(e){
    e.preventDefault();
});
```

对于`preventDefault`方法来说，在原生`JavaScript`和在`jQuery`中的作用是一样的，可以不做区分。

### `event.stopPropagation()`

#### 2.1 含义

* `stopPropagation`方法用于阻止事件的**传播**。需要注意的是，`stopPropagation`方法是用于阻止事件的**传播**的，而不仅仅是用于阻止事件的**冒泡**，很多文章都会混淆这两个概念。`stopPropagation`既可以阻止事件的**冒泡**，也可以阻止事件的**捕获**。
* 通过查看`event.bubbles`属性来判断一个事件是否会**冒泡**。对于不会冒泡的事件，调用`stopPropagation`方法来阻止事件的**冒泡**是没有必要的。

#### 2.2 兼容性

对于`IE8`及更低版本的`IE`浏览器，是不存在`stopPropagation`方法的。可以通过使用`IE`特有的`event.cancelBubble`属性来模拟。

```javascript
if (!Event.prototype.stopPropagation) {
  Event.prototype.stopPropagation = function() {
    this.cancelBubble = true;
  };
}
```

`jQuery`的事件对象`Event`同样有一个`stopPropagation`方法。对于`stopPropagation`方法来说，在原生`JavaScript`和在`jQuery`中的作用也是一样的，可以不做区分。

### `return false`

经常可以看到的一种写法是：在事件处理方法的最后调用`return false`。这里的`return false`有什么作用呢？

在原生`JavaScript`和在`jQuery`中，`return false`的作用是不一样的。

可以这样简单理解：

* 在原生`JavaScript`中，调用`return false`的作用与调用`preventDefault`的作用一样。
* 在`jQuery`中，调用`return false`的作用与同时调用`preventDefault`和`stopPropagation`的作用一样。
* 当然，`return false`还有一个副作用是立即返回。

在代码中**不建议**使用`return false`，这种写法既有平台问题也难于理解。建议根据需要使用`preventDefault`和`stopPropagation`。

### `stopImmediatePropagation` 

从名字可以看出，`stopImmediatePropagation`是一个比`stopPropagation`更强大的方法。这个方法除了具备`stopPropagation`的功能外，还会阻止当前元素上绑定的其他同类型事件监听函数的执行。

举个例子。

```javascript
$("p").click(function(event){
  event.stopImmediatePropagation();
});
$("p").click(function(event){
  // 这个函数不会执行
  $(this).css("background-color", "#f00");
});
```

`jQuery`的事件对象`Event`同样有一个`stopImmediatePropagation`方法。对于`stopImmediatePropagation`方法来说，在原生`JavaScript`和在`jQuery`中的作用也是一样的，可以不做区分。