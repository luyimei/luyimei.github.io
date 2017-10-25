---
layout:     post
title:      "[译]事件顺序"
subtitle:   "关于事件模型、事件冒泡、事件捕获等"
date:       2017-10-25 22:00
author:     "YM"
header-img: "img/posts/love.jpg"
header-mask: 0.3
catalog:    true
tags:
    - 前端开发
    - JavaScript
    - Event
    - 翻译
---
> 这篇文章是在了解JavaScript的事件模型的时候看到的，是一篇好文，故此翻译回来。[原文地址](https://www.quirksmode.org/js/events_order.html)

**在[Introduction to events](https://www.quirksmode.org/js/introevents.html)这篇文章中，我问了一个问题，这个问题乍一看有点让人费解：“如果页面上的一个元素和它的祖先元素都监听了同一个事件，哪个元素的事件处理方法会先执行？”。 毫无疑问，这取决于浏览器。**

这个问题很简单，假设你有两个嵌套的元素

```
-----------------------------------
| element1                        |
|   -------------------------     |
|   |element2               |     |
|   -------------------------     |
|                                 |
-----------------------------------
```

并且这两个元素都有一个`onClick`事件处理方法。当用户点击`element2`的时候，在两个元素上都会触发`click`事件。但是先触发的是哪个元素上的`click`事件？哪个元素的事件处理方法应该先执行？也就是说，事件顺序是怎么样的？

### 1 两种模型

在网景和微软纷争不断的那个年代，对这个问题，他们给出了不同的结论。

* 网景说`element1`上的事件会先触发。这种说法被称为**事件捕获**。
* 微软则认为`element2`上的事件应该优先。这种说法被称为**事件冒泡**。

这两种事件顺序是完全相反的。`Explorer`只支持事件冒泡。`Mozilla`、 `Opera 7` 和 `Konqueror`两种都支持。老版本的 `Opera`和`iCab`两种都不支持。

#### 1.1 事件捕获

当你使用事件捕获的时候，

```
               | |
---------------| |-----------------
| element1     | |                |
|   -----------| |-----------     |
|   |element2  \ /          |     |
|   -------------------------     |
|        Event CAPTURING          |
-----------------------------------
```

`element1`的事件处理方法会先执行，`element2`的事件处理方法后执行。

#### 1.2 事件冒泡

当你使用事件冒泡的时候，

```
               / \
---------------| |-----------------
| element1     | |                |
|   -----------| |-----------     |
|   |element2  | |          |     |
|   -------------------------     |
|        Event BUBBLING           |
-----------------------------------
```

`element2`的事件处理方法会先执行，`element1`的事件处理方法后执行。

### 2 W3C模型

在这场争论中，`W3C`非常明智地保持了中立。在`W3C模型`中，事件首先会被捕获，直到事件到达目标元素（`target element`）的时候，再往上冒泡。

```
                 | |  / \
-----------------| |--| |-----------------
| element1       | |  | |                |
|   -------------| |--| |-----------     |
|   |element2    \ /  | |          |     |
|   --------------------------------     |
|        W3C event model                 |
------------------------------------------
```

对于web开发者来说，你可以选择使用事件冒泡模型还是事件捕获模型。这是通过`addEventListener()`方法来实现的，这个方法在[Advanced models](https://www.quirksmode.org/js/events_advanced.html) 这篇文章中进行了讲解。在调用`addEventListener()`方法的时候，如果最后一个参数是`true`，则表示使用事件捕获模型；如果是`false`，则表示使用事件冒泡模型。

---

假设代码是这样，

```javascript
element1.addEventListener('click',doSomething2,true)
element2.addEventListener('click',doSomething,false)
```

当用户点击`element2`的时候，会发生如下事情：

1. `click`事件首先进入捕获阶段。事件先判断`element2`有没有哪个祖先元素使用事件捕获的语法监听了事件。
2. 在`element1`上找到了使用捕获语法注册的监听器，`doSomething2()`执行。
3. 事件继续往下走，直到抵达目标元素（`element2`），这个过程中没有再找到使用捕获语法注册的监听器。事件进入冒泡阶段，在`element2`上找到了使用冒泡语法注册的监听器，`doSomething()`执行。
4. 事件继续掉头往上走，判断`element2`有没有哪个祖先元素使用事件冒泡的语法监听了事件。没有找到，没有方法执行。

---

反之亦然，再看下面这个例子，

```javascript
element1.addEventListener('click',doSomething2,false)
element2.addEventListener('click',doSomething,false)
```

现在当用户点击`element2`的时候，会发生如下事情：

1. `click`事件首先进入捕获阶段。事件先判断`element2`有没有哪个祖先元素使用事件捕获的语法监听了事件，没有找到。
2. 事件继续往下走，抵达目标元素（`element2`）。这时候事件进入冒泡阶段，在`element2`上找到了使用冒泡语法注册的监听器，`doSomething()`执行。
3. 事件继续掉头往上走，判断`element2`有没有哪个祖先元素使用事件冒泡的语法监听了事件。
4. 在`element1`上找到了使用冒泡语法注册的监听器，`doSomething2()`执行。

#### 2.1 与传统模式（traditional model）兼容

在支持`W3C DOM`的浏览器中，传统的注册事件写法

```javascript
element1.onclick = doSomething2;
```

被认为是使用事件冒泡的语法注册的。

### 3 事件冒泡的用途

很少有web开发者会有意识地使用事件捕获或者事件冒泡。在现在的网页里，根本没必要使用几个不同的事件处理程序来处理一个冒泡事件。点击一次鼠标却发生几件事情会让用户感到困惑，并且通常来说你会希望将事件处理脚本分开。当用户点击一个元素时，会发生一些事情，当他点击另一个元素时，会发生其他事情。

当然在未来这可能会发生变化，并且选择可以向前兼容的模型是好的。 但是现在事件捕获和冒泡的主要实际应用是用来注册默认事件处理器。

### 4 事件捕获或冒泡总是在发生

你首先需要知道的是，事件捕获或冒泡总是在发生。 如果你为整个文档定义一个通用的`onclick`事件处理器

```javascript
document.onclick = doSomething;
/* 译者注:
我猜测下面的代码是为了兼容老浏览器
这个方法不是标准的，我觉得可以不写*/
if (document.captureEvents){
  document.captureEvents(Event.CLICK);
}
```

文档上任何元素的点击事件最终都会冒泡到`document`上，从而触发该通用事件处理器。 只有当前面的事件处理器明确地让事件停止冒泡时，它才不会冒泡到`document`上。

### 5 用途

任何事件（*译者注：我认为这里的**任何**不对，有些事件是不冒泡的*）最终都会回到`document`上，于是默认事件处理器成为可能。 假设你有这样的页面：

```
------------------------------------
| document                         |
|   ---------------  ------------  |
|   | element1    |  | element2 |  |
|   ---------------  ------------  |
|                                  |
------------------------------------
```

```javascript
element1.onclick = doSomething;
element2.onclick = doSomething;
document.onclick = defaultFunction;
```

现在如果用户点击`element1`或`element2`，`doSomething()`会执行。 如果你愿意，你可以在这里停止事件传播，否则的话事件会冒泡到`document`上执行`defaultFunction()`。 用户点击这俩元素之外的任何其他地方，也会执行`defaultFunction()`。 有时候这种做法是很有用的。

实现拖拽功能时，在`document`上注册事件是必要的。通常，被拖拽元素的`mousedown`事件会选中该元素并使它响应`mousemove`事件。虽然`mousedown`事件一般是在被拖拽元素上注册来避免浏览器bug，但其他事件都必须在`document`上注册。

请记住浏览器第一法则：任何事情都有可能发生，尤其是在你没有做好准备时。所以可能会出现这样的情况：用户非常疯狂地移动鼠标，然后脚本跟不上了，这时候鼠标就不是在被拖拽元素的上方了。

* 如果将`onmousemove`事件注册到被拖拽元素上，则该元素不再对鼠标移动作出响应，引发错误。
* 如果将`onmouseup`事件注册到被拖拽元素上，则该事件也不会被触发。这样的话即使在用户松开了元素之后，元素依然会对鼠标移动做出响应。这会导致更严重的错误。

在这种情况下，事件冒泡就非常有用了。在`document`上注册事件可以确保它们总是被执行。

### 6 停止事件传播

但是通常来说你会想把所有事件捕获和冒泡都停止，来保证功能不会互相影响。此外，如果你的文档结构非常复杂（大量嵌套表格等），可以通过停止冒泡来节省系统资源。浏览器必须遍历事件目标元素的每个祖先元素，来查看它是否监听了该事件。即便没有找到，遍历搜索也是需要时间的。

在`微软模型`里（*译者注：这里指旧版本的IE*），通过设置事件的`cancelBubble`属性为`true`来停止事件传播。

```javascript
window.event.cancelBubble = true
```

在`W3C模型`里，通过调用事件的`stopPropogation()`方法来停止事件传播.

```javascript
e.stopPropagation()
```

这样可以阻止事件在冒泡阶段的所有传播。 完整的跨浏览器写法可以是这样

```javascript
function doSomething(e)
{
  if (!e) var e = window.event;
  e.cancelBubble = true;
  if (e.stopPropagation) e.stopPropagation();
}
```

*在不支持它的浏览器中设置`cancelBubble`属性不会引发错误。 浏览器只会简单地创建该属性。当然这个属性做不到取消冒泡，但是这个赋值本身是安全的。*

### 7 currentTarget

如前所述，事件有一个`target`属性或`srcElement`属性，这个属性指向触发事件的那个元素。 在我们的例子中，这个元素是`element2`，因为用户点击的是它。

在事件捕获和冒泡阶段（如果有的话），这个属性是不会改变的，它始终指向`element2`。理解这一点非常重要。

假设我们这样注册事件处理器：

```javascript
element1.onclick = doSomething;
element2.onclick = doSomething;
```

如果用户点击`element2`，`doSomething()`会执行两次。但是怎么才能知道当前是哪个元素在处理事件？从`target` 或`srcElement`看不出来，因为它们是事件的原始来源，总是指向`element2`。

为了解决这个问题，`W3C`增加了`currentTarget`属性。它包含对当前正在处理事件的元素的引用，这正是我们所需要的。不幸的是，`微软模型`中没有类似的属性。

也可以使用[`this`](https://www.quirksmode.org/js/this.html)关键字来替代`currentTarget`。 在上面的例子中，`this`关键字也指向当前正在处理事件的元素。

### 8 微软模型存在的问题

但是在微软事件注册模型里，`this`关键字不指向当前正在处理事件的元素。考虑到`微软模型`中还缺少类似`currentTarget`这样的属性，这意味着如果你这样做

```javascript
element1.attachEvent('onclick',doSomething)
element2.attachEvent('onclick',doSomething)
```

你将**无法**知道当前正在处理事件的元素是哪个。这是微软事件注册模型中最严重的问题，对我而言，这已经是足够的理由，永远不要用它。

我希望微软尽快添加一个类似`currentTarget`的属性 ，或者直接遵循标准？web开发者需要这些信息。

### 9 后续

如果想按顺序浏览所有事件相关的文章，现在可以继续阅读[Mouse events](https://www.quirksmode.org/js/events_mouse.html)这篇文章。