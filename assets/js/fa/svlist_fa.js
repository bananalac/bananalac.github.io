
function updateList() {

    $.get(`https://api.persianlac.ir/servers/all`, function(data) {

        if(data) {

            $(".hideUntilLoad").show();
            $("#hideThis").hide();

            const onlines = data.servers.filter(sv => sv.online === true);
            const offlines = data.servers.filter(sv => sv.online === false);

            const onlinesContainer = document.getElementById("onlines");
            const offlinesContainer = document.getElementById("offlines");


            onlinesContainer.innerHTML = "";
            offlinesContainer.innerHTML = "";

            if(onlines.length === 0) onlinesContainer.innerHTML = `
             <li id="ignore">
                <a href="#" class="item">
                    <div class="in">
                        <div>
                            هیچ سروری آنلاین نیست!
                        </div>
                    </div>
                </a>
            </li>
            `;

            if(offlines.length === 0) offlinesContainer.innerHTML = `
             <li id="ignore">
                <a href="#" class="item">
                    <div class="in">
                        <div>
                            هیچ سروری آفلاین نیست!
                        </div>
                    </div>
                </a>
            </li>
            `;

            onlines.forEach(sv => {

                const li = document.createElement('li');
                li.id = sv.id;
                li.innerHTML = `
                <a href="javascript:void(0)" class="item">
                    <img src="${sv.imageLink}" alt="image" class="image">
                    <div class="in">
                        <div>
                            ${sv.name}
                            <footer class="text-success">آنلاین</footer>
                        </div>
                        <span class="text-muted">دیدن</span>
                    </div>
                </a>
                `;

                onlinesContainer.appendChild(li);

            });

            offlines.forEach(sv => {

                const li = document.createElement('li');
                li.id = sv.id;
                li.innerHTML = `
                <a href="javascript:void(0)" class="item">
                    <img src="${sv.imageLink}" alt="image" class="image">
                    <div class="in">
                        <div>
                           
                            ${sv.name}
                            <footer class="text-danger">آفلاین</footer>
                        </div>
                        <span class="text-muted">دیدن</span>
                    </div>
                </a>
                `;

                offlinesContainer.appendChild(li);

            });

        }

    });

}

$(document).ready(function() {
    const currentLink = window.location.href;
    const url = new URL(currentLink);
    const { searchParams: params } = url;
   
    if(params.get('err') === 'id') {
        toastbox('toast-noid', 3000);
    }

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
            a.href = 'rubika://l.rubika.ir/persianlac';
            a.target = '_blank';
            $(this).off("touchend click");
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }, 10);
    });
   

    updateList();

    setInterval(updateList, 30_000);


    $("#offlines, #onlines").on("touchend click", 'li:not(#ignore)', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            const itsID = $(this).attr("id");
            location.replace('./mapinfo?id=' + itsID);
        }, 10);
    });

})