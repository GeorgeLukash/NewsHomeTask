function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

var numb = 10;
var first = 0;
var data = [];
var filterList = [];
var flag = true;
var main;
var blockContent;
var locale_HTML;

var LoadContent1 = function (first, numb, data, valueV) {
    main = document.getElementById('main');
    for (var j = first; j < numb; j++) {

        blockContent = document.createElement('div');
        blockContent.className = "block-content";
        blockContent.id = "b" + j;
        blockContent.style.display = valueV;
        main.appendChild(blockContent);

        /*====Head====*/

        var head = document.createElement('div');
        head.className = "head-news";

        var headNews = document.createElement('h1');
        headNews.className = "title-text";
        headNews.innerHTML = data[j].title;

        var createDate = document.createElement('span');
        createDate.className = "create-data";
        createDate.innerHTML = new Date(data[j].createdAt);

        var settings = document.createElement('button');
        settings.className = "settings";
        settings.title = "Delete from DOM";
        settings.id = j;

        settings.addEventListener('click', function () {
            var ind = (this).id;
            var elementID = document.getElementById("b" + ind);
            elementID.style.display = "none";

        });

        var imgSett = document.createElement('IMG');
        imgSett.src = "css/img/settings.png"
        settings.appendChild(imgSett);

        head.appendChild(headNews);
        head.appendChild(createDate);
        head.appendChild(settings);

        head.insertBefore(settings, headNews, createDate);

        blockContent.appendChild(head);

        /*====.Head====*/

        /*====Content====*/

        var content = document.createElement('div');
        content.className = "content-holder";

        var description = document.createElement('p');
        var img = document.createElement('IMG');

        description.className = "description";
        description.innerHTML = data[j].description;
        img.src = data[j].image;

        content.appendChild(img);
        content.appendChild(description);

        content.insertBefore(img, description);

        blockContent.appendChild(content);

        /*====.Content====*/

        /*====Tags====*/

        var ulist = document.createElement('ul');
        ulist.className = "tags-list";

        for (var i = 0; i < data[j].tags.length; i++) {
            var listEl = document.createElement('li');
            listEl.innerHTML = data[j].tags[i];
            ulist.appendChild(listEl);
        }
        blockContent.appendChild(ulist);

        /*====.Tags====*/
    }

    //var temp = document.getElementById('idS').addEventListener('click', remove);
    //for (var t = 0; t < temp.length; t++) {
    //    temp[t].addEventListener('click', remove());
    //}
};

readTextFile("js/data.json", function (text) {

    /*===Load JSON===*/

    data = JSON.parse(text).sort(function (a, b) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    /*===.Load JSON===*/
    window.onload = LoadContent1(0, 50, data, "none");
    for (var k = 0; k < 10; k++) {
        var temp = document.getElementById("b" + k);
        temp.style.display = "block";
    }
    /*===Infinite Scroll===*/

    var listElm = document.querySelector('#main');

    listElm.addEventListener('scroll', function () {
        if ((listElm.scrollTop + listElm.clientHeight >= listElm.scrollHeight) && (data.length != null) && (first != 40) && (flag)) {
            first = numb;
            numb = numb + 10;
            for (var k = first; k < numb; k++) {
                var temp = document.getElementById("b" + k);
                temp.style.display = "block";
            }
        }
    });

    /*===.Infinite Scroll===*/
    locale_HTML = document.body.innerHTML;
});

function FindOnPage(name, status) {
    flag = false;
    var input, search, pr, result, result_arr, result_store;

    console.log(locale_HTML);
    input = document.getElementById(name).value.toLowerCase();

    if (input.length < 3 && status == true) {
        alert('For search you need to enter at least three chars');
        function FindOnPageBack() {
            document.getElementById('main').innerHTML = locale_HTML;
            flag = true; var text_holder = document.getElementById('text-to-find');
            text_holder.nodeValue = "";
        }
    }

    if (input.length >= 3) {

        function FindOnPageGo() {
            search = '/' + input + '/g';
            pr = data;
            var warning = true;
            for (var i = 0; i < pr.length; i++) {
                if (pr[i].title.toLowerCase().match(eval(search)) != null) {
                    warning = false;

                    var tmp = document.getElementById('b' + i);
                    tmp.style.display = "block";

                } else {

                    var tmp = document.getElementById('b' + i);
                    tmp.style.display = "none";

                }
            }

            if (warning == true) {
                alert('Nothing Found');
            }
        };

    }

    function FindOnPageBack() {
        document.body.innerHTML = locale_HTML;
        flag = true;
    }
    if (status) { FindOnPageBack(); FindOnPageGo(); }
    if (!status) { FindOnPageBack(); }
};

function ChangeState(tagId) {
    var check = document.getElementById(tagId);

    var data_copy = data;
    var iter = 0;
    if (check.checked) {

        filterList.push(tagId);

        for (var j = 0; j < data.length; j++) {

            for (var i = 0; i < filterList.length; i++) {
                if (data[j].tags.indexOf(filterList[i]) === -1) {

                    var tmp = document.getElementById('b' + j);                    
                    tmp.style.display = "none";                    
                    break;                   

                } else {

                    var tmp = document.getElementById('b' + j);                    
                    tmp.style.display = "block";
                    flag = false;                    
                    iter++;

                }
            }

        }

    } else {

        var pos = filterList.indexOf(tagId);
        filterList.splice(pos, 1);

        for (var j = 0; j < data.length; j++) {

            for (var i = 0; i < filterList.length; i++) {
                if (data[j].tags.indexOf(filterList[i]) === -1) {

                    var tmp = document.getElementById('b' + j);
                    tmp.style.display = "none";
                    break;

                } else {

                    var tmp = document.getElementById('b' + j);
                    tmp.style.display = "block";
                    flag = false;
                    iter++;

                }
            }

        }

    }

    if (filterList.length == 0) {
        document.body.innerHTML = locale_HTML;
        flag = true;
    }
};