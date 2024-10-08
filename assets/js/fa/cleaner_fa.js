
let cache = { name: "", map: "" };


$(document).ready(function() {

    $.get("https://api.counterapi.dev/v1/PersianLACGithubIO/cleanerViewerCount/up", function(data) {
        $("#totalViewers").html(`تعداد بازدید کل : ${data.count}`)
    });

    $.get("https://api.counterapi.dev/v1/PersianLACGithubIO/cleanerUpVotes/", function(data) {
        $("#upVote").html(`<ion-icon name="thumbs-up"></ion-icon> راضی (${data.count})`)
    });

    $.get("https://api.counterapi.dev/v1/PersianLACGithubIO/cleanerDownVotes/", function(data) {
        $("#downVote").html(`<ion-icon name="thumbs-down"></ion-icon> ناراضی (${data.count})`)
    });

    $("#upVote").on("touchend click", function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            $.get("https://api.counterapi.dev/v1/PersianLACGithubIO/cleanerUpVotes/up", function(data) {
                $("#rateTitle").html("از نظر شما متشکریم!");
                $(".btn-group").slideUp();
                $("#upVote").html(`<ion-icon name="thumbs-up"></ion-icon> راضی (${data.count})`).prop("disabled", true);
            });
        }, 10);
    });

    $("#downVote").on("touchend click", function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            $.get("https://api.counterapi.dev/v1/PersianLACGithubIO/cleanerDownVotes/up", function(data) {
                $("#rateTitle").html("از نظر شما متشکریم!");
                $(".btn-group").slideUp();
                $("#downVote").html(`<ion-icon name="thumbs-down"></ion-icon> ناراضی (${data.count})`).prop("disabled", true);
            });
        }, 10);
    });

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


    $(".btn-close").on("touchstart click", function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            $("#alertBoxer").hide();
        }, 10);

    });

    $("#uploadButton").on("touchstart click", function(e) {
    
        e.preventDefault();
        e.stopImmediatePropagation();
    
        setTimeout(() => {
    
            const fileInput = document.getElementById("fileuploadInput");

            if(fileInput.files.length === 0) { 
              toastbox("toast-nomap", 3000);
              return;
            }
    
            const file = fileInput.files[0];
    
            if(file.type !== 'text/plain') {
            toastbox("toast-wtype", 3000);
            return;
            }
    
       
        const reader = new FileReader();
    
        reader.onload = function(event) {
                    
            const content = event.target.result;
            
            const lines = content.split("\n");
            const triggerboxesLength = lines.filter(line => line.startsWith('Trigger_Box_Editor')).length;
            const filteredItems = lines.filter(line => !line.startsWith('Trigger_Box_Editor'));
            cache.map = filteredItems.join("\n");
           
    
            if(navigator.share) $("#shareButton").show();
            $("#downloadButton").show(); 
            $("#adCont").show();  
            $("#newOne").show();     
            $("#rating").show();       
            $("#uploadButton").hide();
            $("#fileuploadInput").prop("disabled", true);
            $("#foundX").html(`${triggerboxesLength} تا تریگرباکس پیدا شد!`);
            toastbox("toast-found", 5000);

            
        };
        cache.name = file.name.replace('.txt', "");
        reader.readAsText(file, 'utf-8');
            
        }, 10);
    
        
    
        
    
    });

    $("#shareButton").on("touchstart click", function(e) {

        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
        if(navigator.share) {

            const blob = new Blob([cache.map], { type: 'text/plain' });

            navigator.share({
                title: 'مپ پاک شده',
                text: `${cache.name}.txt`,
                files: [
                    new File([blob], `${cache.name}.txt`, { type: "text/plain" })
                ]
            }).catch(() => {
               
            })
        } else {
            toastbox('toast-noshare', 3000);
            return;
        }
            
        }, 10);
        
    
    });

    $("#downloadButton").on("touchstart click", function(e) {

    
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
    
            const blob = new Blob([cache.map], { type: 'text/plain' });
        
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
           
            link.href = `${url}`;
            link.download = `clean-${cache.name}.txt`;
    
        
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
        }, 10);
        
    
    });
    
    
    $("#newOne").on("touchstart click", function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {

           location.reload();


        }, 10);
       
    })
    
})






