function updateList() {
    console.log("did i do this?")
    $.get(`https://api.persianlac.ir/servers/all`, function(data) {

        if(data) {     

            const onlines = data.servers.filter(sv => sv.online === true);
            if(onlines.length !== 0) $(".showOnExists").show();
              
            const onlinesContainer = document.getElementById("allSvList");
            onlinesContainer.innerHTML = "";

            onlines.forEach(sv => {

                const li = document.createElement('li');
                li.id = sv.id;
                li.innerHTML = `
                 <div class="card">
                                <img src="${sv.imageLink}" class="card-img-top" alt="server-image">
                                <div class="card-body pt-2">
                                    ${sv.name} | <span class="text-success blink_me">آنلاین</span> | ${sv.onlines} پلیر آنلاین
                                    <footer>${sv.id}</footer>
                                </div>
                    </div>
                `;

                onlinesContainer.appendChild(li);

            });


        }

    }).fail(function() {
        
    });

}


$(document).ready(function() {

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

    $(".toolsRedirector").on("touchend click", function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            const relink = $(this).attr("relink");
            location.replace(relink);
        }, 10);
        
    });

    updateList();

    setInterval(updateList, 30_000);

    $("#allSvList").on("touchend click", 'li:not(#ignore)', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            const itsID = $(this).attr("id");
            location.replace('./mapinfo?id=' + itsID);
        }, 10);
    });





});