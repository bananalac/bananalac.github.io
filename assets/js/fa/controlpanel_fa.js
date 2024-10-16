let linkTo = `http://localhost:3000`;

$(document).ready(function() {

    const serial = localStorage.getItem(`CP_SERIAL`);

    if(!serial) $("#ModalForm").modal("show")
    else {


    }

    $("#loginButton").on("touchend click", function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            const seri = $("#serialInput").val().trim();
            if(seri === '') {
                $("#serialInput").val("");
                $("#serialInput").attr("placeholder", `یک سریال وارد کنید!`);
                return;
            };

            $.get(`${linkTo}/premiums/get?=name`, function(data) {

            });

        }, 10);
    })

    

});