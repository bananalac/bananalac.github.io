
let rateOnSession = false;

function updateInfo() {
    const currentLink = window.location.href;
    const url = new URL(currentLink);
    const { searchParams: params } = url;

    if(params.has('id')) {

        $.get(`https://api.persianlac.ir/servers/get?id=${params.get('id').trim()}`, function(data) {
            if(data.noid) location.replace('./svlist?err=id')
            else {

                const conv1 = {
                    true: `<span class="badge badge-success">آنلاین</span>`,
                    false: `<span class="badge badge-secondary">آفلاین</span>`
                };

                const conv2 = {
                    clear: "پاک",
                    rainy: "بارانی"
                };

                if(rateOnSession === true) $("#rating").hide();
                $(".hideUntilLoad").show();
                $("#hideThis").hide();
                $(".pageTitle").html(`مشخصات سرور`)
                $("#serverName").html(data.name.trim());
                $("#serverId").html(data.id);
                $("#svSt").html(`<ion-icon name="information-circle-outline"></ion-icon> وضعیت سرور : ${conv1[data.online]}`);
                if(data.ipaddress.trim() !== "") $("#svIP").show().html(`<ion-icon name="hardware-chip-outline"></ion-icon> آدرس سرور : ${data.ipaddress.trim()}`);
                if(data.online === true) {
                    $("#svOns").show().html(`<ion-icon name="people-outline"></ion-icon> تعداد پلیر در حال بازی : ${data.onlines}`);
                    $("#svW").show().html(`<ion-icon name="rainy-outline"></ion-icon> آب و هوا : ${conv2[data.weather]}`);
                } 
                
                if(data.description !== "") $("#svbio").html(data.description);

                document.getElementById("usersList").innerHTML = "";

                if(data.users.length !== 0) $("#usersAcco").show();

                data.users.forEach(usr => {
                    const timeJoined = new persianDate(usr.timeJoined).format(`"dddd ، Dام MMMM ماه"`);
                    const li = document.createElement('li');
                    li.className = `no-select`;
                    li.innerHTML = `
                                    <div class="item">
                                        <div class="icon-box bg-success">
                                            <ion-icon name="arrow-down"></ion-icon>
                                        </div>
                                        <div class="in">
                                            <div> [${usr.id}] ${usr.name}</div>
                                            <span class="text-muted">${timeJoined}</span>
                                        </div>
                                    </div>
                    `;

                    document.getElementById("usersList").appendChild(li);
                });

                if(data.rules !== "") {
                    $("#rulesAcco").show();
                    const rulesList = document.getElementById("rulesList");
                    rulesList.innerHTML = "";
                    data.rules.split("\n").forEach((rule) => {
                        const li = document.createElement('li');
                        li.innerHTML = rule;
                        rulesList.appendChild(li);
                    });
                }

                if(data.link !== "") {
                    const linkList = document.getElementById("linkList");
                    linkList.innerHTML = "";
                    data.link.split(" ").forEach((lin) => {
                        const a = document.createElement('a');
                        a.href = lin;
                        a.innerHTML = lin;
                        linkList.appendChild(a);
                    });
                }

                

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

                $("#editButt").on("touchend click", function(e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    setTimeout(() => {
                        location.replace(`./editsv?id=${params.get('id').trim()}`)
                    }, 10);
                });

            }
        }).fail(function() {
            location.replace('./svlist?err=id');
        });

    } else {
        location.replace('./svlist?err=id');
    }
}

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

    updateInfo();

    setInterval(updateInfo, 30_000);

   


});