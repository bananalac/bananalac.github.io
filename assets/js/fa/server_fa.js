

$(document).ready(function() {

    const degrees = ['0', '45', '90', '130', '180', '225', '270', '315', '360'];
    setInterval(() => {
        const rnd = degrees[Math.floor(Math.random() * degrees.length)];
        $(".adHue img").css("filter", `hue-rotate(${rnd}deg)`);
    }, 1000);

    $(".sponsorLink").on("touchend click", function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            let a = document.createElement('a');
            a.href = 'rubika://l.rubika.ir/LAC_HOST';
            a.target = '_blank';
            $(this).off("touchend click");
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }, 10);
    });
    $(".sponsorLink2").on("touchend click", function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            let a = document.createElement('a');
            a.href = 'rubika://l.rubika.ir/LAC_HOST';
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }, 10);
    });

    const currentLink = window.location.href;
    const url = new URL(currentLink);
    const { searchParams: params } = url;

    if(params.has('id')) {

        $.get(`https://api.persianlac.ir/servers/get?id=${params.get('id').trim()}`, function(data) {
            if(data.noid) location.replace('404')
            else {

                const conv1 = {
                    true: `<span class="badge badge-success">آنلاین</span>`,
                    false: `<span class="badge badge-secondary">آفلاین</span>`
                };

                const conv2 = {
                    clear: "پاک",
                    rainy: "بارانی"
                };

                $(".pageTitle").html()
                $("#serverName").html(data.name);
                $("#serverId").html(data.id);
                $("#svSt").html(`وضعیت سرور : ${conv1[data.online]}`);
                if(data.online === true) $("#svOns").html(`تعداد پلیر آنلاین : ${conv1[data.onlines]}`)
                else $("#svOns").html(`تعداد پلیر آنلاین : سرور آفلاین است`);
                $("#svW").html(`آب و هوا : ${conv2[data.weather]}`);
                $("#svLike").html(`تعداد لایک : ${data.rate.up}`);

                $("#upVote").on("touchend click", function(e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    setTimeout(() => {
                        $.post(`https://api.persianlac.ir/servers/upvote`, { id: params.get('id').trim() }, function(data2) {

                            if(data2.success === true) {
                                $("#upVote").hide();
                                $("rateTitle").html(`از نظر شما متشکریم!`);
                            } else {

                            }
                        });
                    }, 10);
                });

                $("#shareSv").on("touchend click", function(e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    setTimeout(() => {
                      if(navigator.share) {
                        navigator.share({
                            title: `Sharing ${data.name} server`,
                            url: `https://persianlac.ir/server?id=${params.get('id').trim()}`
                        });
                      }
                    }, 10);
                });

            }
        }).fail(function() {
            location.replace('404');
        });

    } else {
        location.replace('404');
    }


});