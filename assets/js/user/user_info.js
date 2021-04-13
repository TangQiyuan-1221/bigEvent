$(function () {
    const { form } = layui;
    const { layer } = layui;

    form.verify({
        // 校验表单数据 判断用户昵称是否满足规则
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！';
            }
        }
    })
    // 获取用户信息
    initUserInfo();

    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！');
                }
                // console.log(res);
                form.val('formUserInfo', res.data);
            }
        })
    }

    // 重置
    $('#btnReset').on('click', function (e) {
        //阻止默认行为
        e.preventDefault();
        // 数据覆盖成原始的
        initUserInfo();
    })

    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('信息更新成功！');
                // 渲染头像
                window.parent.getUserInfo();
            }
        })
    })
})