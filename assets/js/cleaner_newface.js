
let cache = { name: "", map: "" };


$(document).ready(function() {


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
            $("#newOne").show();            
            $("#uploadButton").hide();
            $("#fileuploadInput").prop("disabled", true);
            $("#foundX").html(`Found ${triggerboxesLength} triggerboxes!`);
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
                title: 'Cleaned Map',
                text: `${cache.name}.txt`,
                files: [
                    new File([blob], `${cache.name}.txt`, { type: "text/plain" })
                ]
            }).catch(() => {
                toastbox('toast-noshare', 3000);
                return;
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






