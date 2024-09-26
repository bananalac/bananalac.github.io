
function isPointInRectangle(x1, y1, x2, y2, x, y) {

    const left = Math.min(x1, x2);
    const right = Math.max(x1, x2);
    const bottom = Math.min(y1, y2);
    const top = Math.max(y1, y2);

    if(x >= left && x <= right && y >= bottom && y <= top) {
        return true;
    } else {
        return false;
    }

}



let cache = { map: [], filename: "" };


$(document).ready(function() {
    $(".overlay").slideUp();
})

window.addEventListener("DOMContentLoaded", function() {

   

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



$("#uploadButton").on("touchstart click", function(e) {
    
    e.preventDefault();
    e.stopImmediatePropagation();

    setTimeout(() => {

        const fileInput = document.getElementById("fileUpload");

    if(fileInput.files.length === 0) { 
        Toast.fire({
            icon: "error",
            title: "Upload save-data.txt!"
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

        
        cache.map = lines;

        
        $("#uploadButton").hide();
        $("#labelForUpload").hide();
        $("#titleCheck").show();
        $("#proceed").show();
        $(".rectangle").show();
       
       
        
    };

    cache.filename = file.name.replace(".txt", "")
    reader.readAsText(file, 'utf-8');
        
    }, 10);

    

    

});

$("#proceed").on("touchstart click", function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    setTimeout(() => {
        
        if($("#top-left").val().trim() === '' || $("#bottom-right").val().trim() === '') {
            Toast.fire({
                icon: "error",
                title: "Provide x,z !"
            });
            return;
        }

        if(!$("#top-left").val().trim().includes(',') || !$("#bottom-right").val().trim().includes(',')) {
            Toast.fire({
                icon: "error",
                title: "Provide x,z !"
            });
            return;
        }

        const x1 = Number($("#top-left").val().trim().split(",")[0]);
        const y1 = Number($("#top-left").val().trim().split(",")[1]);
        const x2 = Number($("#bottom-right").val().trim().split(",")[0]);
        const y2 = Number($("#bottom-right").val().trim().split(",")[1]);


        cache.map.forEach((line, lineIndex) => {
              if(lineIndex > 14 && line.trim() !== '') {
                
                const itemX = Number(line.split(":")[1].split(",")[0]);
                const itemY = Number(line.split(":")[1].split(",")[2]);

                if(isPointInRectangle(x1, y1, x2, y2, itemX, itemY) === false) {
                    cache.map.splice(lineIndex, 1);
                }

              }
        });

        $("#proceed").hide();
        $("#downloadButton").show();
        $("#copyToClipboard").show();
        $("#top-left").prop("disabled", true);
        $("#bottom-right").prop("disabled", true);


    }, 10);
});

$("#downloadButton").on("touchstart click", function(e) {

    
    e.preventDefault();
    e.stopImmediatePropagation();
    setTimeout(() => {

        const mapFinal = cache.map.join("\n");

        const blob = new Blob([mapFinal], { type: 'text/plain' });
    
        const url = URL.createObjectURL(blob);        
        const link = document.createElement('a');
       
        link.href = `${url}`;
        link.download = `cut-${cache.filename}.txt`;

    
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
    }, 10);
    

});




$("#copyToClipboard").on("touchstart click", function(e) {
    
    e.preventDefault();
    e.stopImmediatePropagation();
    setTimeout(() => {
       
        navigator.clipboard.writeText(cache.map.join("\n"));
        Toast.fire({
            icon: "success",
            title: "Copied to clipboard!"
        });


    }, 10);
   
})

