

window.addEventListener("DOMContentLoaded", function() {
   
    
})

$("#newmap").on("touchstart click", function(e) {
    e.stopPropagation();
    location.reload();
})

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });

$("#clearAllButton").on("touchstart click", function(e) {

    e.stopPropagation();
    if($("#inputPlace").val().trim() === '') {

        Toast.fire({
            icon: "error",
            title: "Provide a map text!"
          });
        return;
    }

setTimeout(() => {

    const pattern = /Trigger_Box_Editor(.*?)}/igm;
    const map = $("#inputPlace").val().trim();

    
    $("#inputPlace").prop('disabled', true);
    $("#clearAllButton").css('display', 'none');
    $("#newmap").css('display', 'block');
    $("#mapShow").css('display', 'block');
    $("#copy").css('display', 'block');

    $("#mapShow").text(map.replace(pattern, ""));
    

   
}, 10);
   
   
});

$("#copy").on("touchstart click", function(e) {
    e.stopPropagation();
    navigator.clipboard.writeText($("#mapShow").text()).then(() => {
        Toast.fire({
            icon: "success",
            title: "Copied to clipboard!"
          });
    }).catch(() => {
        Toast.fire({
            icon: "error",
            title: "Failed to copy!"
        });
    })
})


