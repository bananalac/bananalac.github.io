import { blogItems as BLOG } from '../blogTexts/blog001.mjs';

$(document).ready(function() {

    if(!navigator.share) $(".shareHandler").hide();
    
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);

    const params = new URLSearchParams(url.search);

    const blogId = params.get('name');

    if(!blogId) {
        location.replace('404');
    } else {

        const postInfo = BLOG[blogId];
        if(!postInfo) location.replace('404');

        $("#blogTitleText").html(postInfo.title);
        $("#imgOfPost").attr("src", postInfo.image);
        $("#writerInfo").html(` <div>
            ${postInfo.date}
                    <a id="blogWriterName" href="#">
                        <img src=\"${postInfo.writer.image}\" alt="avatar" class="imaged w24 rounded me-05">
                        نویسنده : ${postInfo.writer.name}
                    </a></div>`);

        $("#writerInfo").on("touchstart click", function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            setTimeout(() => {
                window.location.href = postInfo.writer.clicker;
            }, 10);
        });

        postInfo.body.forEach((element) => {
            const el = document.createElement(element.el);
            if(element.el === 'p') el.style = 'color:white;'
            el.innerHTML = element.vl;

            document.getElementsByClassName('post-body')[0].appendChild(el);
        })


    }

    

    $("#advGoBack").on("touchstart click", function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            const referrer = document.referrer;
            const currentOrigin = window.location.origin;

            if(referrer && referrer.startsWith(currentOrigin)) {
                window.history.back();
            } else {
                window.location.href = '/';
            }

        }, 10);
    });


    $(".shareHandler").on("touchstart click", function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            navigator.share({
                title: 'نکات امنیتی بنانا ال ای سی',
                url: `https://bananalac.github.io/blog-fa?name=amniat`
            })
        }, 10);
    })



})

