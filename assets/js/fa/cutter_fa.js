
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
            a.href = 'rubika://l.rubika.ir/LAC_HOST';
            a.target = '_blank';
            $(this).off("touchend click");
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }, 10);
    });
    $(".sponsorLink2").on("touchend click", function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            let a = document.createElement('a');
            a.href = 'rubika://l.rubika.ir/LAC_HOST';
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }, 10);
    });

    if(!navigator.share) $("#shareButton").hide();


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
    
            
            cache.map = lines;
    
            
            $("#cropperSection").slideToggle();
            $("#coordinatesSection").slideToggle();
           
           
           
            
        };
    
        cache.filename = file.name.replace(".txt", "")
        reader.readAsText(file, 'utf-8');
            
        }, 10);
    
        
    
        
    
    });

    $("#proceed").on("touchstart click", function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        let thisMustBeCleaned = [];
        setTimeout(() => {

            if($("#topleftXZ").val().trim() === '' || $("#bottomrightXZ").val().trim() === '') {
                toastbox("toast-xz", 3000);
                return;
            }
    
            if(!$("#topleftXZ").val().trim().includes(',') || !$("#bottomrightXZ").val().trim().includes(',')) {
                toastbox("toast-xz", 3000);
                return;
            }
    
            const x1 = Number($("#topleftXZ").val().trim().split(",")[0]);
            const y1 = Number($("#topleftXZ").val().trim().split(",")[1]);
            const x2 = Number($("#bottomrightXZ").val().trim().split(",")[0]);
            const y2 = Number($("#bottomrightXZ").val().trim().split(",")[1]);

            cache.map.forEach((line, lineIndex) => {
                if(lineIndex > 14 && line.trim() !== '' && !line.trim().startsWith('Spawn_Point_Editor')) {
                  
                  const itemX = Number(line.split(":")[1].split(",")[0]);
                  const itemY = Number(line.split(":")[1].split(",")[2]);
  
                  if(isPointInRectangle(x1, y1, x2, y2, itemX, itemY) === false) {
                      thisMustBeCleaned.push(lineIndex);
                  }
  
                }
          });

            const isInverse = $("#toggleInverse").is(":checked");

            if(isInverse === true) {

                const cleanedOne = cache.map.filter((_, lineIndex) => thisMustBeCleaned.includes(lineIndex));
                cache.map = cleanedOne;

            } else {

                const cleanedOne = cache.map.filter((_, lineIndex) => !thisMustBeCleaned.includes(lineIndex));
                cache.map = cleanedOne;

            }
               
            if(navigator.share) $("#shareButton").show();
            $("#proceed").hide();
            $("#coordinatesSection").slideToggle();
            $("#resultsSection").slideToggle();
            
    
        }, 10);
    });

    $("#shareButton").on("touchstart click", function(e) {

        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
        if(navigator.share) {

            const blob = new Blob([cache.map.join("\n")], { type: 'text/plain' });

            navigator.share({
                title: 'مپ برش خورده',
                text: `cut-${cache.filename}.txt`,
                files: [
                    new File([blob], `cut-${cache.filename}.txt`, { type: "text/plain" })
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
            toastbox("toast-copied", 3000);
    
    
        }, 10);
       
    });
    
})









