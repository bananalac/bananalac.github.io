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
   
    $("#updateBoardcast").on("touchend click", function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            const secretVal = $("#boardcastSecret").val().trim();
            const textVal = $("#codebox").val().trim();

            if(secretVal === '' || textVal === '') {
              toastbox(`toast-nosecret`, 3000);
              return;
            }

            $.post(`https://api.persianlac.ir/boardcast/edit`, { secret: secretVal, text: textVal }, function(data) {
                if(data.ok === true) {
                    toastbox(`toast-success`, 3000);
                    return;
                }
            })

        }, 10);
    })


});