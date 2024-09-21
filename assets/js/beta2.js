

let cache = {name: "", map: "", firstFifteenLines: ""};
let storedItems = [];

$(document).ready(function() {
    Swal.fire({
        title: "This is a BETA",
        text: "Some buttons or functions may not work.",
        icon: "warning"
    }).then((result) => {
        if(result.isConfirmed) {
            $(".overlay").slideUp();
        }
    });
})

window.addEventListener("DOMContentLoaded", function() {

    $("#deleteAll").prop("disabled", true);
    $("#downloadButton").prop("disabled", true);
    $('#searchBar').prop("disabled", true);

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

/**
 * @param {String} input 
 */
function processString(input) {
    // Step 1: Split the string by new lines
    let lines = input.trim().split('\n');
    
    cache.firstFifteenLines = lines.splice(0, 15).join("\n");
    lines.splice(0, 15);
     
    let firstItems = lines.map(line => line.split(':')[0]);
 
     let groupedItems = {};
     firstItems.forEach((item, itemIndex) => {
         if (!groupedItems[item]) {
             groupedItems[item] = [];
         }
         groupedItems[item].push(itemIndex + 16);
    });

    return groupedItems;
}

function addList(cacheMap, newTime = false) {

    document.getElementById("usersList").innerHTML = "";

    if(newTime === true) {     
        $("#titleCheck").html(`(Edited) Found ${Object.keys(processString(cacheMap)).length} Objects in map.`); 
    }
    
    for (const [k, v] of Object.entries(processString(cacheMap))) {

       storedItems.push({ objName: k, lines: v, amount: v.length });


    }
    storedItems.sort((a, b) => b.amount - a.amount);
    
    storedItems.forEach((item) => {

    const tr = document.createElement('tr');
    tr.id = item.objName;

    const objName = document.createElement('td');
    objName.innerHTML = item.objName; 
    tr.appendChild(objName);

    const amount = document.createElement('td');
    amount.innerHTML = item.amount; 
    tr.appendChild(amount);

    const delButt = document.createElement('td');
    delButt.innerHTML = `<button id=\"${item.objName}-remv\" class=\"delete-button\"><i class="fas fa-trash"></i></button>`;

    tr.appendChild(delButt);

    document.getElementById("usersList").appendChild(tr);

    })

   
    
   
    //! Delete button handler
    $('button[id$="-del"]').on('touchstart click', function(e) {
        
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            const objName = $(this).attr("id").split("-")[0];
           
            
            const obj = storedItems.find(obj => obj.objName === objName);
            const cacheLines = cache.map.split("\n")
            obj.lines.forEach(line => {

            })
           
        }, 10);
        
        
    });
   
}

$("#uploadButton").on("touchstart click", function(e) {
    
    e.preventDefault();
    e.stopImmediatePropagation();

    setTimeout(() => {

        const fileInput = document.getElementById("fileUpload");

    if(fileInput.files.length === 0) { 
        Toast.fire({
            icon: "error",
            title: "Upload a map!"
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

        let lines = content.split("\n");
        lines.splice(0, 15);
    

        cache.map = content;
        addList(content)
       
       


        $("#deleteAll").prop("disabled", false);
        $("#downloadButton").prop("disabled", false);
       
        
        $("#uploadButton").css("display", "none");
        $("#labelForUpload").css("display", "none");
        $("#newOne").css("display", "block");
        $("#fileUpload").css("display", "none");
        $("#titleCheck").html(`Found ${Object.keys(processString(content)).length} Objects in map.`);

       
        
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


$("#newOne").on("touchstart click", function(e) {
    
    e.preventDefault();
    e.stopImmediatePropagation();
    setTimeout(() => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert edited players!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, exit!"
          }).then((result) => {
            if (result.isConfirmed) {
                location.reload();
            }
          });
    }, 10);
   
});

