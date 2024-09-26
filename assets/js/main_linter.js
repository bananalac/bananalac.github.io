import {convertToHtml, colorize, typeChecker} from './linter/index.js';
import { AVAILABLE_OPTIONS as AO } from './linter/syntax/syntax_sheet.js';


const converterKeys = {
    bracketStart: "{",
    bracketEnd: "}",
    lt: "<",
    gt: ">",
    equals: "=",
    notequals: "!=",
    and: "&&",
    asterix: "*",
    colon: ":",
    comma: ","
};

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });

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
            $(".bulkDiv").hide();
            $("#inputPlace").hide();
            $(".resultsTitle").show();
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
});

$(".typers").each(function() {
    $(this).on("touchstart click", function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
    
        setTimeout(() => {
            let inputArea = $("#inputPlace");
            let itsId = $(this).attr("id");
            
    
            let start = inputArea[0].selectionStart;
            let end = inputArea[0].selectionEnd;
    
            let currentValue = inputArea.val();
            inputArea.val(currentValue.substring(0, start) + converterKeys[itsId] + currentValue.substring(end));
    
            inputArea[0].selectionStart = inputArea[0].selectionEnd = start + converterKeys[itsId].length;
            inputArea.focus();
    
        }, 10);
    })
});


$("#newcode").on("touchstart click", function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    location.reload();
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
    $(".bulkDiv").hide();
    $("#inputPlace").hide();
    $(".resultsTitle").show();
    $("#newcode").css('display', 'block');
    $("#codeShow").css('display', 'block');
    $("#descPlace").css('display', 'block');
    $("#descPlace2").css('display', 'block');

    const allErrors = convertToHtml($("#inputPlace").val());
    $("#inputPlace").val($("#inputPlace").val().replace(/}(?=[^\n])/g, '}\n'));
    $("#codeShow").html(colorize($("#inputPlace").val()));
    
    $("#descPlace").html(allErrors.fnl);
    $("#descPlace2").html(allErrors.warns);
}, 10);
   
   
});

// $("#inputPlace").on("input", function() {
//     const inputValue = $(this).val().toLowerCase();
//     let funcs = [];
//     funcs.push(...Object.keys(AO), "ifcondition");
//     $("#suggestor").html("").hide();
//     if(inputValue && !inputValue.includes('{')) {
//         const filteredOnes = funcs.filter(f => f.toLowerCase().startsWith(inputValue));

//         filteredOnes.forEach(sug => {
//             $("#suggestor").html(sug).show();
//             $("#suggestor").on("touchstart click", function(e) {
//                 e.preventDefault();
//                 e.stopImmediatePropagation();
//                 setTimeout(() => {
//                     $("#inputPlace").val(sug);
//                     $("#suggestor").html("").hide();
//                     $("#inputPlace").focus();
//                 }, 10);
//             })
//         })
//     }
// });

// let funcs = [];
// funcs.push(...Object.keys(AO), "ifcondition");

// $("#inputPlace").on("input", function() {
//     let inputValues = $(this).val().split('\n');
//     console.log(inputValues)
//     const currentLine = inputValues[inputValues.length - 1];
//     $("#sugggestor").html("");


//     if(currentLine) {
        
//         $("#suggestor").html("").hide();
//         const filteredOnes = funcs.filter(f => f.toLowerCase().startsWith(currentLine.toLowerCase()));
//         console.log(filteredOnes)
//         if(filteredOnes.length > 0) {
//         filteredOnes.forEach(sug => {
//             $("#suggestor").html(sug).show();
//             $("#suggestor").on("touchstart click", function(e) {
//                 e.preventDefault();
//                 e.stopImmediatePropagation();
//                 setTimeout(() => {
//                     inputValues[inputValues.length - 1] = sug + '{}';
//                     console.log(inputValues)
//                     $("#inputPlace").val(inputValues.join("\n"));
//                     $("#suggestor").html("").hide();
//                     $("#inputPlace").focus();
//                     return;
//                 }, 10);
//             })
//         })
//         } else {
//             $("#suggestor").html("").hide();
//         }
//         return;
//     } else {
//         $("#suggestor").html("").hide();
//         return;
//     }

// })



// // Hide suggestion box when clicking outside
// document.addEventListener('click', function(event) {
//     if (!inputField.contains(event.target) && !suggestionBox.contains(event.target)) {
//         suggestionBox.style.display = 'none';
//     }
// });




