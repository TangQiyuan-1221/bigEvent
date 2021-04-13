// 每次发起$.get/post/ajax请求时，都会先调用ajaxprefilter 这个函数
$.ajaxPrefilter(function (options) {
    // 在发起正真的ajax请求之前，会统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
    // console.log(options.url);

    // 统一为有权限的接口，设置headers 请求头

    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.token || ''
            // Authorization: localStorage.getItem('token') || ''
        }
    }

    options.complete = function ({ responseJSON: { status, message } }) {
        // 在complete 回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
        if (status === 1 && message === '身份认证失败！') {
            // 强制清空token
            localStorage.removeItem('token');
            // 强制跳转到登录页面
            location.href = '/login.html';
        }
    }


})