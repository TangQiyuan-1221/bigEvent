$(function () {

    const { form } = layui;
    const { layer } = layui;

    // 获取文章列表数据
    getArtList();
    function getArtList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                const htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }

    let indexAdd = null;
    // 为添加类别按钮绑定点击事件
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })
    // 添加分类 到数据库中
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg(res.message)
                }
                getArtList();
                layer.msg('添加成功！')
                // 根据索引，关闭对应的弹出层
                layer.close(indexAdd);
            }
        })
    })

    // 编辑文章分类弹出层
    let indexEdit = null;
    $('tbody').on('click', '.btn-edit', function () {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        // 把编辑后的数据传到数据库中
        const id = $(this).attr('data-id');
        console.log(id);
        // 在展示弹出层之后，根据 `id` 的值发起请求获取文章分类的数据，并填充到表单中
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })
    // 发起请求获取对应分类的数据
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！');
                }
                layer.msg('更新分类数据成功！');
                // 关闭弹出框
                layer.close(indexEdit);
                // 重新渲染
                getArtList();
            }
        })
    })

    // 通过事件代理的的方式给删除按钮绑定点击事件
    $('tbody').on('click', '.btn-del', function () {
        const id = $(this).attr('data-id');
        // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index);
                    //渲染
                    getArtList();
                }
            })
        })
    })
})