import {convertToHtml, colorize, typeChecker} from './linter/index.js';

$(document).ready(function() {
    $(".overlay").slideUp();
});

window.addEventListener("DOMContentLoaded", function() {

    $("#descriptionSelector").prop('disabled', true);
    $("#defE").prop('selected', true);

    const currentLink = window.location.href;
    const url = new URL(currentLink);
    const { searchParams: params } = url;

    if(params.has('code')) {

        if(params.get('code').trim() === '') {

            Toast.fire({
                icon: "error",
                title: "Wrong query!"
              });
            return;
        }

        setTimeout(() => {
    
            $("#inputPlace").prop('disabled', true);
            $("#descriptionSelector").prop('disabled', false);
            $("#findMistakesButton").css('display', 'none');
            $("#newcode").css('display', 'block');
            $("#codeShow").css('display', 'block');
            $("#descPlace").css('display', 'block');
        
            const allErrors = convertToHtml(params.get('code'));
            $("#inputPlace").val(params.get('code').replace(/}(?=[^\n])/g, '}\n'));
            $("#codeShow").html(colorize(params.get('code')));
            
            $("#descPlace").html(allErrors.fnl);
            $("#descPlace2").html(allErrors.warns);
        }, 10);

    }
})

$("#newcode").on("touchstart click", function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    location.reload();
})

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });

$("#findMistakesButton").on("touchstart click", function(e) {

    e.preventDefault();
    e.stopImmediatePropagation();
    if($("#inputPlace").val().trim() === '') {

        Toast.fire({
            icon: "error",
            title: "Provide a code!"
          });
        return;
    }

setTimeout(() => {

    
    
    $("#inputPlace").prop('disabled', true);
    $("#descriptionSelector").prop('disabled', false);
    $("#findMistakesButton").css('display', 'none');
    $("#newcode").css('display', 'block');
    $("#codeShow").css('display', 'block');
    $("#descPlace").css('display', 'block');

    const allErrors = convertToHtml($("#inputPlace").val());
    $("#inputPlace").val($("#inputPlace").val().replace(/}(?=[^\n])/g, '}\n'));
    $("#codeShow").html(colorize($("#inputPlace").val()));
    
    $("#descPlace").html(allErrors.fnl);
    $("#descPlace2").html(allErrors.warns);
}, 10);
   
   
})


