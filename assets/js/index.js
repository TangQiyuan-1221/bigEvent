$(function () {
    getUserInfo();
    const layer = layui.layer;
    $('#btnLogOut').on('click', function () {
        // 弹出框
        layer.confirm('确定退出登录吗？', { icon: 6, title: '提示' },
            function (index) {
                // 删除本地存储的localStorage token值
                localStorage.removeItem('token');
                // 跳转到登录页面
                location.href = '/login.html';
                // 关闭confirm询问框
                layer.close(index);
            });
    });
})

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.token || ''
        //     // Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 渲染头像
            renderAvatar(res.data);
        },
        // complete: function ({ responseJSON: { status, message } }) {
        //     // 在complete 回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
        //     if (status === 1 && message === '身份认证失败！') {
        //         // 强制清空token
        //         localStorage.removeItem('token');
        //         // 强制跳转到登录页面
        //         location.href = '/login.html';
        //     }
        // }
    })
}

// 渲染头像
function renderAvatar(user) {
    // 1.获取用户的名称
    const name = user.nickname || user.username;
    // 2.设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 3、渲染头像
    if (user.user_pic !== null) {
        // 图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 文字头像
        $('.layui-nav-img').hide();
        // 获取用户名的第一个字  并转换为大写
        const first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }

}