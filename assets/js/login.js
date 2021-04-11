$(function () {
    // 登录注册切换
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })

    $('#link_login').on('click', function () {
        $('.reg-box').hide();
        $('.login-box').show();
    })

    // const {form} = layui;
    const form = layui.form;
    const { layer } = layui;

    form.verify({
        // 自定义了一个叫做 pwd 校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })

    // 监听注册表单提交事件
    $('#form_reg').on('submit', function (e) {
        // 阻止默认的提交行为
        e.preventDefault();
        $.post('/api/reguser', {
            username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val()
        }, function (res) {
            if (res.status !== 0) {
                // return console.log(res.message);
                return layer.msg(res.message);
            }
            // console.log('注册成功！');
            layer.msg('注册成功,请登录！')
            // 自动触发一下登录链接的点击事件
            $('#link_login').click();
        })
    })

    // 实现登录，绑定表单的提交事件
    $('#form_login').submit(function (e) {
        // 阻止默认的提交行为
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            // 快速获取表单中数据 serialize()
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                // 将登录成功得到的 token 字符串，保存到localStorage中
                localStorage.setItem('token', res.token);
                // 跳到后台主页
                location.href = '/index.html';
            }
        })
    })
})