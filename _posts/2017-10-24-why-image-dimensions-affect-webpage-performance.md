---
layout:     post
title:      "图片的尺寸为什么会影响网页性能？"
subtitle:   "几十张图片就能把微信整crash？"
date:       2017-10-24 11:28
author:     "YM"
header-img: "img/posts/crash.jpg"
header-mask: 0.3
catalog:    true
tags:
    - 前端开发
    - 性能优化
    - 陨石坑
---

> 这其实也是一个客户端相关的问题，感谢我对象静静，深层的原因是她调研得到的。
>
> 面向对象开发，效率会更高。

## 背景

问题源于之前做的一个投票h5（下线了，没链接），页面很简单，投票功能是通过接入[磐石投票](http://panshi.qq.com/v2/10)实现的。

投票候选人有几十人，也即一个投票页里得放几十张头像。从产品处拿到头像图片资源后，第一时间用[tinypng](https://tinypng.com/)做了图片压缩。

开发过程中一切顺利，在PC上用chrome调试也没什么问题。但是在测试阶段发现了一个严重bug，在微信里打开投票页有很大概率会crash。在QQ、手机浏览器上打开，性能表现也很一般。

于是开始了漫长的调试，经过排除最后发现问题出在图片这，把图片全删了之后一切正常。

那为什么多了这几十张图片微信就crash了？明明已经用tinypng做了压缩，最大的一张图片大小也就100多KB，不至于crash吧？

## 分析

通过查看图片信息，发现图片普遍尺寸（像素）都很大，部分图片的尺寸高达4000 x 2000，于是结论也就呼之欲出了。

1. 图片尺寸太大的时候，浏览器渲染需要缩放图片，这样是会造成一定的性能损失的。

2. 图片被读到**内存**的时候，所占**内存**大小与图片的大小（KB）无关，而只与图片的尺寸有关。这是做客户端开发的我对象告诉我的。

   ```mathematica
   // 一个像素占的byte数与图片格式有关
   byteCount = (width * scale + 0.5) * (height * scale + 0.5) * (一个像素占的byte数)
   scale = targetDensity ／ density
   ```

   由此可见，图片读到**内存**中时，所占**内存**大小是随着图片的尺寸增加而增加的。而客户端分配给webview的内存资源一定是有限的，故此crash了。据说在客户端开发中也经常会遇到此问题。

## 总结

问题的解决很简单，让设计帮忙把图片尺寸缩小即可。

从中可以得出结论，前端开发在处理图片的时候，不仅需要处理图片的大小（KB），同时也应该处理图片的尺寸（像素），并使得图片的原始尺寸与在页面上的尺寸相差不大，从而避免过度缩放影响性能。