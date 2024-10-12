let givenId = "";
let givenSecret = "";

$(document).ready(function() {
    // $("#loader").hide();
    const currentLink = window.location.href;
    const url = new URL(currentLink);
    const { searchParams: params } = url;
   
    if(params.has('id')) {
       givenId = params.get('id');

       $.get(`https://api.persianlac.ir/servers/get?id=${givenId.trim()}`, function(data) {
          if(data.noid) {
                toastbox('toast-wid', 3000);
                return;
          } else {

            
            $("#hideThis").hide();
            $(".hideUntilLoad").show();
            $("#titleEdit").html(`ویرایش اطلاعات سرور : ${givenId}`);

            $("#descriptionEdit").val(data.description);
            $("#imagelinkEdit").val(data.imageLink);
            $("#rulesEdit").val(data.rules);
            $("#linkEdit").val(data.link);
            $("#ipaddressEdit").val(data.ipaddress);
          


          }
       })

    } else {
        window.history.go(-1);
    }

    $("#openLock").on('touchend click', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            const secretVal = $("#secretEdit").val().trim();
            if(secretVal === '') {
                toastbox('toast-nosec', 3000);
                return;
            }

            $.get(`https://api.persianlac.ir/servers/auth?id=${givenId}&secret=${secretVal}`, function(data) {
                if(data.success) {
                    givenSecret = secretVal;
                    toastbox('toast-unlock', 3000);
                    $('#openLock').prop("disabled", true);
                    $("#secretEdit").prop("disabled", true);
                    $(".lockUntilAuth").prop("disabled", false);
                }
            })

        }, 10);
    });

    $("#resetUsers").on('touchend click', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            $.post(`https://api.persianlac.ir/servers/resetusers`, { secret: givenSecret }, function(data) {
                if(data.success) {
                    $(this).prop("disabled", true);
                }
            })
        }, 10);
    });

    $("#proceed").on('touchend click', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            const d = $("#descriptionEdit").val().trim();
            const img = $("#imagelinkEdit").val().trim();
            const ip = $("#ipaddressEdit").val().trim();
            const link = $("#linkEdit").val().trim();
            const rulz = $("#rulesEdit").val()
           
            
           
            $.post(`https://api.persianlac.ir/servers/edit`, { secret: givenSecret, link: link, rules: rulz, description: d, imageLink: img, ipaddress: ip, usersResetTimer: 60, links: ["test"] }, function(data) {
                if(data.success) {
                    toastbox('toast-proceed', 3000);
                    location.replace('./mapinfo?id=' + givenId);
                }
            })
        }, 10);
    });
})