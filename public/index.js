(function() {
    /**
     * 生成书籍列表卡片（dom元素）
     * @param {Object} book 书籍相关数据
     */
    function createCard(book) {
        var li = document.createElement('li');
        // var img = document.createElement('img');
        var title = document.createElement('div');
        var author = document.createElement('div');
        var desc = document.createElement('div');
        var publisher = document.createElement('span');
        var price = document.createElement('span');
        title.className = 'title';
        author.className = 'author';
        desc.className = 'desc';
        // img.src = book.image;
        title.innerText = book.title;
        author.innerText = book.author;
        publisher.innerText = book.publisher;
        price.innerText = book.price;

        book.publisher && desc.appendChild(publisher);
        book.price && desc.appendChild(price);
        // li.appendChild(img);
        li.appendChild(title);
        li.appendChild(author);
        li.appendChild(desc);

        return li;
    }

    /**
     * 根据获取的数据列表，生成书籍展示列表
     * @param {Array} list 书籍列表数据
     */
    function fillList(list) {
        list.forEach(function (book) {
            var node = createCard(book);
            document.querySelector('#js-list').appendChild(node);
        });
    }

    /**
     * 控制tip展示与显示的内容
     * @param {string | undefined} text tip的提示内容
     */
    function tip(text) {
        if (text === undefined) {
            document.querySelector('#js-tip').style = 'display: none';
        }
        else {
            document.querySelector('#js-tip').innerHTML = text;
            document.querySelector('#js-tip').style = 'display: block';
        }
    }

    /**
     * 控制loading动画的展示
     * @param {boolean | undefined} isloading 是否展示loading
     */
    function loading(isloading) {
        if (isloading) {
            tip();
            document.querySelector('#js-loading').style = 'display: block';
        }
        else {
            document.querySelector('#js-loading').style = 'display: none';
        }
    }
    
    /**
     * 根据用户输入结果
     * 使用XMLHttpRequest查询并展示数据列表
     */
    function queryBook() {
        var input = document.querySelector('#js-search-input');
        var query = input.value;
        var xhr = new XMLHttpRequest();
        var url = '/book?q=' + query + '&fields=id,title,image,author,publisher,price';
        if (query === '') {
            tip('请输入关键词');
            return;
        }
        document.querySelector('#js-list').innerHTML = '';
        document.querySelector('#js-thanks').style = 'display: none';
        loading(true);
        xhr.timeout = 60000;
        xhr.onreadystatechange = function () {
            var response = {};
            if (xhr.readyState === 4 && xhr.status === 200) {
                loading(false);
                try {
                    response = JSON.parse(xhr.responseText);
                }
                catch (e) {
                    response = xhr.responseText;
                }
                tip();
                if (response.books.length === 0) {
                    tip('无结果');
                }
                else {
                    input.blur();
                    fillList(response.books);
                    document.querySelector('#js-thanks').style = 'display: block';
                }
            }
        };
        xhr.open('GET', url, true);
        xhr.send(null);
    }

    /**
     * 监听“搜索”按钮点击事件
     */
    document.querySelector('#js-search-btn').addEventListener('click', function () {
        queryBook();
    });

    /**
     * 监听“回车”事件
     */
    window.addEventListener('keypress', function (e) {
        if (e.keyCode === 13) {
            queryBook();
        }
    });
})();