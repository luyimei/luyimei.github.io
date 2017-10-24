function BackToTop(){
  this.timer = null; // 定时器
  this.backTopBtn = $('[js="back-top"]');
  this.render();
}
BackToTop.prototype = {
  isShowHandler: function() {
    const toTop = $(window).scrollTop();
    if (toTop > 300) {
      this.backTopBtn[0].style.display = 'block';
    } else {
      this.backTopBtn[0].style.display = 'none';
    }
  },
  scrollToTop: function(e) {
    e.preventDefault();
    var self = this;
    let speed = 50;
    self.timer = setInterval(function() {
      const toTop = $(window).scrollTop();
      const speed = Math.ceil(toTop / 2);
      $(window).scrollTop(toTop - speed);;
      if (toTop === 0) {
        clearInterval(self.timer);
      }
    }, speed);
  },
  listen: function() {
    var self = this;
    $(window).on('scroll', this.isShowHandler.bind(this));
    this.backTopBtn.on('click', this.scrollToTop.bind(this));
  },
  render: function() {
    if (!this.backTopBtn.length) {
      $('body').append('<div style="display:none;" js="back-top" class="m-back-top"></div>');
      this.backTopBtn = $('[js="back-top"]');
    }
    this.listen();
  }
};
new BackToTop();