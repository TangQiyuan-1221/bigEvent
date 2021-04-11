// 每次发起$.get/post/ajax请求时，都会先调用ajaxprefilter 这个函数
$.ajaxPrefilter(function (options) {
    // 在发起正真的ajax请求之前，会统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
    console.log(options.url);
})