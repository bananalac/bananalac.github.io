
let cache = { name: "", map: "" };


$(document).ready(function() {

    $.get("https://api.counterapi.dev/v1/PersianLACGithubIO/cleanerViewerCount/up", function(data) {
        $("#totalViewers").html(`تعداد بازدید : ${data.count}`);
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
            a.href = 'rubika://l.rubika.ir/persianlac';
            a.target = '_blank';
            a.rel = 'nofollow';
            $(this).off("touchend click");
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


    $("#fileuploadInput").on("change", function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            $("#filteringItems").attr("disabled", false);
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
            const additionalFilter = $("#filteringItems").val().trim()
            if(additionalFilter === '') {
                const triggerboxesLength = lines.filter(line => line.startsWith('Trigger_Box_Editor')).length;
                const filteredItems = lines.filter(line => !line.startsWith('Trigger_Box_Editor'));
                cache.map = filteredItems.join("\n");
               
        
               
                $("#foundX").html(`${triggerboxesLength} تریگرباکس پیدا شد!`);
                toastbox("toast-found", 5000);
      
            } else {
                const triggerboxesLength = lines.filter(line => line.startsWith('Trigger_Box_Editor') && line.includes(additionalFilter)).length;
                const filteredItems = lines.filter(line => !line.startsWith('Trigger_Box_Editor') && !line.includes(additionalFilter));
                cache.map = filteredItems.join("\n");
               
        
               
                $("#foundX").html(`${triggerboxesLength} تریگرباکس با فیلتر خواسته شده پیدا شد!`);
                toastbox("toast-found", 5000);
         
            }

            if(navigator.share) $("#shareButton").show();
            $("#downloadButton").show(); 
            $("#hideDivFilter").slideUp();
            $("#newOne").show();           
            $("#uploadButton").hide();
            $("#fileuploadInput").prop("disabled", true);
           

            
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
       
    });
    
});






