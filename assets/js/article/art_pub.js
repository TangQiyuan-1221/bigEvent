$(function () {
    const { layer } = layui;
    const { form } = layui;

    initCate();

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取文章失败！')
                // layer.msg('获取文章成功！')
                // 获取模板引擎的数据
                const htmlStr = template('tpl-cate', res);
                // 渲染数据
                $('[name=cate_id]').html(htmlStr);
                // select  必须写 form.render()  不然数据渲染不上  这是layui 自己规定的
                form.render();
            }

        })
    }

    // 初始化富文本编辑器
    initEditor();

    // 1. 初始化图片裁剪器
    const $image = $('#image')

    // 2. 裁剪选项
    const options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 给选择封面按钮 绑定点击事件
    $('#btnChooseImage').on('click', function () {
        // 手动触发文件选择框的点击事件
        $('#coverFile').click()
    })

    // 监听 文件选择框的change事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        const files = e.target.files;
        // 判断用户是否选择了文件
        if (files.length === 0) return;
        // 根据文件，创建对应的URL地址
        const imageURL = URL.createObjectURL(files[0]);
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imageURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义全局变量发布状态
    let art_state = '已发布';

    // 监听 存为草稿的点击事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿';
    })

    // 监听表单的submit事件
    $('#form-pub').on('submit', function (e) {
        // 阻止默认行为
        e.preventDefault();
        // 创建FormData 对象
        const fd = new FormData(this);
        // 在fd中在添加一个数据,把状态添加进去
        fd.append('state', art_state);

        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd);

            })
        // 测验  看看fd里存的数据
        // fd.forEach(function (value, k) {
        //     console.log(k, value);
        // })
    })

    //发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })

    }

})