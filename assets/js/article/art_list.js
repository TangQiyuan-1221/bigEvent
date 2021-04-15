$(function () {

    const { layer } = layui;
    const { form } = layui;
    const { laypage } = layui;

    // 定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
    let q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(data);

        const y = dt.getFullYear();
        const m = padZero(dt.getMonth() + 1);
        const d = padZero(dt.getDate());

        const hh = padZero(dt.getHours());
        const mm = padZero(dt.getMinutes());
        const ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }
    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 获取文章列表数据的方法
    initTable();
    // 初始化文章分类的方法
    initCate()


    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // console.log(res);
                // 使用模板引擎渲染页面的数据
                const htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total);
            }
        })
    }
    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }
    // 监听筛选表单的submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        q.cate_id = $('[name=cate_id]').val();
        q.state = $('[name=state]').val();
        // 重新渲染页面
        initTable();
    })
    // 定义渲染分页的方法，接收一个总数量的参数
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            limits: [2, 4, 6, 8, 10],
            // 分页发生切换的时候，触发 jump 回调
            jump: function (page, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                // console.log(first);
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                // console.log(page.curr);
                q.pagenum = page.curr;
                // 把最新的条目数，赋值到q这个查询参数对象的pagesize中
                q.pagesize = page.limit;
                // 根据最新的 q 获取对应的数据列表，并渲染表格
                // initTable()
                if (!first) {
                    initTable()
                }
            },
            // 自定义排版。可选值有：count（总条目输区域）、prev（上一页区域）、page（分页区域）、next（下一页区域）、limit（条目选项区域）、refresh（页面刷新区域。注意：layui 2.3.0 新增） 、skip（快捷跳页区域）
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip', 'refresh'],

        })
    }

    // 给删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除按钮的个数
        const length = $('.btn-delete').length;
        // 获取到文章的 id
        const id = $(this).attr('data-id');
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！');
                    // 实现删除时 页码值的变化
                    if (length === 1 || q.pagenum === 1) {
                        q.pagenum--;
                    }
                    initTable();
                }
            })
            layer.close(index);
        })

    })

})


