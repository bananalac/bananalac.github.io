
let cache = { name: "", map: "" };



window.addEventListener("DOMContentLoaded", function() {

    $("#downloadButton").prop("disabled", true);
    $("#additionalRemove").prop("disabled", true)

})



const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });

document.getElementById("fileUpload").addEventListener("change", function(event) {
    const file = event.target.files[0];
    
    if(!file) {
        $("#labelForUpload").text("No file Selected!");
    } else {
        $("#labelForUpload").text(`${file.name} (${Math.round(file.size / 1024)} KB)`);
    }

})

function splitText(text, spliter) {
    return text.includes(spliter) ? text.split(spliter) : text;
}

$("#uploadButton").on("touchstart click", function(e) {
    
    e.preventDefault();
    e.stopImmediatePropagation();

    setTimeout(() => {

        const fileInput = document.getElementById("fileUpload");

    if(fileInput.files.length === 0) { 
        Toast.fire({
            icon: "error",
            title: "Upload a map"
        });
        return;
    }

    const file = fileInput.files[0];

    if(file.type !== 'text/plain') {
        Toast.fire({
            icon: "error",
            title: "Wrong format!"
        });
        return;
    }

   
    const reader = new FileReader();

    reader.onload = function(event) {
    
        
        const content = event.target.result;
        
        const lines = content.split("\n");
        const triggerboxesLength = lines.filter(line => line.startsWith('Trigger_Box_Editor')).length;
        const filteredItems = lines.filter(line => !line.startsWith('Trigger_Box_Editor'));
        cache.map = filteredItems.join("\n");
       

        
        $("#downloadButton").prop("disabled", false);
        
        $("#uploadButton").css("display", "none");
        $("#labelForUpload").css("display", "none");
        $("#newOne").css("display", "block");
        $("#fileUpload").css("display", "none");
        $("#titleCheck").html(`Found ${triggerboxesLength} Triggerbox`);



      
    
       
        
    };
    cache.name = file.name.replace('.txt', "");
    reader.readAsText(file, 'utf-8');
        
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

$(".helper").on("touchstart click", function(e) {

    e.preventDefault();
    e.stopImmediatePropagation();
    setTimeout(() => {  
        Swal.fire({
            title: "Additional Removal",
            // icon: "info",
            html: `
             <p style="text-align:left">Add other objects splited by , to remove them too.<br></p>
             <h3>Example :</h3>
             <p>Bridge_Chunk_Editor,Barrel_Editor</p>
            `,
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,  
    });
    }, 10);

})



$("#newOne").on("touchstart click", function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    setTimeout(() => {
        
        location.reload();
    }, 10);
   
})

