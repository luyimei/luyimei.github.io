---
layout:     post
title:      "JavaScript的Event对象常被忽略的几个属性"
date:       2017-10-25 12:00
author:     "YM"
header-img: "img/posts/sea.jpg"
catalog:    true
tags:
    - 前端开发
    - JavaScript
    - Event
---
最近无意中翻到[Event对象的API文档](https://developer.mozilla.org/en-US/docs/Web/API/Event)，发现其中有几个属性还是颇为重要的，但之前一直没怎么注意过，故此记录下来。

#### Event.bubbles

> [`Event.bubbles`](https://developer.mozilla.org/en-US/docs/Web/API/Event/bubbles) Read only
>
> A Boolean indicating whether the event bubbles up through the DOM or not.

这是一个只读属性，该属性指明这个事件是否会冒泡。对于不会冒泡的事件，调用`event.stopPropogation()`是没有意义的。

在`stackoverflow`查了查，翻到一个[问题](https://stackoverflow.com/questions/5574207/html-dom-which-events-do-not-bubble)，以下这些事件是不会冒泡的。

> Any events specific to one element do not bubble: submit, focus, blur, load, unload, change, reset, scroll, most of the DOM events (DOMFocusIn, DOMFocusOut, DOMNodeRemoved, etc), mouseenter, mouseleave, etc

####  Event.cancelable

> [`Event.cancelable`](https://developer.mozilla.org/en-US/docs/Web/API/Event/cancelable) Read only
>
> A Boolean indicating whether the event is cancelable.

这也是一个只读属性，该属性指明这个事件是否可以被取消。对于`cancelable`属性是`false`的事件，调用`event.preventDefault()`是没有效果的。

没有查到哪篇文章把事件按照这个属性进行了分类。有需要的话可以在各事件的API文档上查询该事件的`cancelable`属性默认值。

#### Event.defaultPrevented

> [`Event.defaultPrevented`](https://developer.mozilla.org/en-US/docs/Web/API/Event/defaultPrevented) Read only
>
> Indicates whether or not [`event.preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) has been called on the event.

这也是一个只读属性，该属性指明这个事件上是否已经调用了`event.preventDefault()`。调用`event.preventDefault()`后会改变该属性的值（但是不能直接去改变它的值，因为是只读的）。该属性一般用于了解事件的状态。

End.