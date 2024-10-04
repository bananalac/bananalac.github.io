import {convertToHtml, colorize, typeChecker, convertToShare} from '../linter/index.js';


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

    const degrees = ['0', '45', '90', '130', '180', '225', '270', '315', '360'];
    setInterval(() => {
        const rnd = degrees[Math.floor(Math.random() * degrees.length)];
        $(".adHue img").css("filter", `hue-rotate(${rnd}deg)`);
    }, 1000);

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
         $("#resultsSection").html("خطا ها اینجا نمایش داده می شوند!")
         $("#warningsSection").html("هشدار ها اینجا نمایش داده می شوند!")
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
                title: 'نتایج خطایاب',
                text: `Code: ${code}\n${errs.fnl}\n${errs.warns}\nخطایابی توسط :\nhttps://bananalac.github.io/linter-fa`
            })
        }, 10);
    })

    
        
});









