$(function () {
    //   获取裁剪区域的DOM元素
    const $image = $('#image');
    // 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 创建裁剪区域
    $image.cropper(options);

    // 为上传按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        // 手动触发input 的点击事件
        $('#file').click();
    })

    // 监听上传input的change事件
    $('#file').on('change', function (e) {
        //获取用户选择的文件
        const [file] = e.target.files;
        // var file = e.target.files[0];
        // 将文件转化为路径
        const imgURL = URL.createObjectURL(file);
        // 重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })


    $('#btnUpload').on('click', function () {
        const dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')

        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败！')
                }
                layer.msg('更换头像成功！')
                // 再次渲染头像
                window.parent.getUserInfo()
            }
        })
    })
})