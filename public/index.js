(function() {
    function createCard(book) {
        var li = document.createElement('li');
        var img = document.createElement('img');
        var title = document.createElement('div');
        var author = document.createElement('div');
        var desc = document.createElement('div');
        var publisher = document.createElement('span');
        var price = document.createElement('span');
        title.className = 'title';
        author.className = 'author';
        desc.className = 'desc';
        img.src = book.image;
        title.innerText = book.title;
        author.innerText = book.author;
        publisher.innerText = book.publisher;
        price.innerText = book.price;

        book.publisher && desc.appendChild(publisher);
        book.price && desc.appendChild(price);
        li.appendChild(img);
        li.appendChild(title);
        li.appendChild(author);
        li.appendChild(desc);

        return li;
    }

    function fillList(list) {
        list.forEach(function (book) {
            var node = createCard(book);
            document.querySelector('#js-list').appendChild(node);
        });
    }

    function tip(text) {
        if (text === undefined) {
            document.querySelector('#js-tip').style = 'display: none';
        }
        else {
            document.querySelector('#js-tip').innerHTML = text;
            document.querySelector('#js-tip').style = 'display: block';
        }
    }

    function loading(isloading) {
        if (isloading) {
            tip();
            document.querySelector('#js-loading').style = 'display: block';
        }
        else {
            document.querySelector('#js-loading').style = 'display: none';
        }
    }

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
                }
            }
        };
        xhr.open('GET', url, true);
        xhr.send(null);
    }

    document.querySelector('#js-search-btn').addEventListener('click', function () {
        queryBook();
    });

    window.addEventListener('keypress', function (e) {
        if (e.keyCode === 13) {
            queryBook();
        }
    });
})();