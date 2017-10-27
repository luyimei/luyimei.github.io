---
layout:     post
title:      "为什么click事件在iPhone下不生效？"
date:       2017-10-27 17:20
author:     "YM"
header-img: "img/posts/crash.jpg"
header-mask: 0.3
catalog:    true
tags:
    - 前端开发
    - JavaScript
    - Event
    - 陨石坑
---

> 这个问题在stackoverflow上吵得不可开支，很多人给出了解决办法，但很少有人能说明为什么。
>
> 有幸找到了靠谱的答案，整理一下分享给大家。

### 问题

假设有如下代码：

```html
<span class="clicked">点我</span>
```

```javascript
$("span.clicked").click(function(){
  alert("span clicked");
});
```

上面的代码很简单，在`PC`上是可以正常工作的，在`Android`上也是正常的。但是在`iPhone`里却是**无效**的，没有弹出`alert`框。为什么？

### 原因

在说原因之前，先给出针对这个问题的最简单且无副作用的解决方法：

```css
.clicked{
  cursor: pointer;
}
```

给`span`元素增加一个样式即可解决该问题。黑人脸，为什么`css`会影响`JavaScript`的表现？不合理啊！

我们来看看`Apple`是怎么处理事件的。在`Apple`开发者中心的[处理事件](https://developer.apple.com/library/content/documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/HandlingEvents.html)这篇文章中，找到了如下说法：

> If the user taps a nonclickable element, no events are generated. If the user taps a clickable element, events arrive in this order: `mouseover`, `mousemove`, `mousedown`, `mouseup`, and `click`.

![单手指事件](/img/posts/event_finger.jpg)

上面的说法结合图片一起看，意思很明显：当用户点击**不可点击的元素**的时候，是不会触发事件的。

### 总结

由此可见，在`iPhone`里，`span`元素被当成了**不可点击的元素**。而加上`cursor: pointer;`之后，则会被当成**可点击的元素**。

也就是说，对于`iPhone`来说，这个特性并不是一个`bug`，而是`by design`。我猜测，设计这样的特性还是为了用户体验，避免出现太多事件需要处理从而影响性能。

但是对于开发者来说，这个特性，是个陨石坑无疑。

End.