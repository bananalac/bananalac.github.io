import { blogItems as BLOG } from '../blogTexts/blog001.mjs';
import { profileItems as PROFILE } from '../blogTexts/profiles001.mjs';

$(document).ready(function() {

    if(!navigator.share) $('.shareHandler').hide();

    const currentUrl = window.location.href;
    const url = new URL(currentUrl);

    const params = new URLSearchParams(url.search);

    const userId = params.get('name');

    if(!userId) {
        location.replace('404');
    } else {

        const userInfo = PROFILE[userId];
        if(!userInfo) location.replace('404');

        let blogPosts = [];
        for (const [k, v] of Object.entries(BLOG)) {
            if(v.writer.name === userInfo.blName) blogPosts.push(v);
        }

        $(".pageTitle").html(`پروفایل ${userInfo.blName} `)
        $("#profileName").html(userInfo.namefa);
        $("#profileRole").html(userInfo.rolefa);
        $("#profilePicture").attr("src", userInfo.pic);
        $("#profilePhotos").html(`<strong>${userInfo.images.length}</strong>عکس`);
        $("#profileTools").html(`<strong>3</strong>ابزار`);
        $("#profileBlogs").html(`<strong>${blogPosts.length}</strong>نوشته`);
        $("#profileGithubFollowers").html(`<strong>32</strong>گیت هاب`);
        $("#profileBio").html(userInfo.biofa);
        userInfo.links.forEach((link) => {
            document.getElementById('profileLinks').innerHTML += `<a href=\"${link.url}\">${link.name}</a>,`;
        });
        userInfo.images.forEach((img) => {
            document.getElementById('imagesContainer').innerHTML += `<div class="col-4 mb-2"><img src="${img.link}" alt="${img.alt}" class="imaged w-100"></div>`;
        });
        blogPosts.forEach((blogpost) => {
            document.getElementById('blogPostsContainer').innerHTML += `<li><a href="/blog?name=${blogpost.keyItself}" class="item"><img src="${blogpost.image}" alt="image" class="image"><div class="in"><div>${blogpost.title}<div class="text-muted">${blogpost.desc}</div></div></div></a></li>`;
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


   



})

