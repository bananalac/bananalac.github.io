import {convertToHtml, colorize, typeChecker, convertToShare} from './linter/index.js';
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
    comma: ",",
    true: "true",
    false: "false"
};

$(document).ready(function() {

    $(".btn-close").on("touchstart click", function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            $("#alertBoxer").hide();
        }, 10);

    });

    const currentLink = window.location.href;
    const url = new URL(currentLink);
    const { searchParams: params } = url;

    if(params.has('code')) {

        if(params.get('code').trim() === '') {

            toastbox('toast-wquery', 5000);
            return;
        }

        setTimeout(() => {
    
            $("#codebox").prop('disabled', true);
            $(".typers").prop("disabled", true);
            $("#findMistakesButton").hide();
            $("#newOne").show();
        
            const allErrors = convertToHtml(params.get('code'));
            $("#codebox").val(params.get('code').replace(/}(?=[^\n])/g, '}\n'));
             
            $("#resultsSection").html(allErrors.fnl);
            $("#warningsSection").html(allErrors.warns);
        }, 10);

    }


    $(".typers").each(function() {
        $(this).on("touchstart click", function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
        
            setTimeout(() => {
                let inputArea = $("#codebox");
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
    
    $("#newOne").on("touchstart click", function(e) {
    
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
         //$("#codebox").val("");
         $("#codebox").prop('disabled', false);
         $("#resultsSection").html("Errors will appear here!")
         $("#warningsSection").html("Warnings will appear here!")
         $("#newOne").hide();
         $(".typers").prop("disabled", false);
         $("#findMistakesButton").show();
        }, 10);
       
       
    });
    
    $("#findMistakesButton").on("touchstart click", function(e) {
    
        e.preventDefault();
        e.stopImmediatePropagation();
        if($("#codebox").val().trim() === '') {
    
            toastbox("toast-nocode", 3000);
            return;
        }
    
    setTimeout(() => {
    
        $("#codebox").prop('disabled', true);
        $("#newOne").show();
        $(".typers").prop("disabled", true);
        $("#findMistakesButton").hide();
        if(navigator.share) $("#shareButton").show();
       
       
    
        const allErrors = convertToHtml($("#codebox").val());
        $("#codebox").val($("#codebox").val().replace(/}(?=[^\n])/g, '}\n'));
        
        $("#resultsSection").html(allErrors.fnl);
        $("#warningsSection").html(allErrors.warns);
    }, 10);
       
       
    });

    $("#shareButton").on("touchstart click", function(e) {
        const code = $("#codebox").val().replace(/}(?=[^\n])/g, '}\n')
        const errs = convertToShare(code);
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            navigator.share({
                title: 'Lint Results',
                text: `Code: ${code}\n${errs.fnl}\n${errs.warns}`
            })
        }, 10);
    })

    
        
});









