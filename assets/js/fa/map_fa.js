import { parse, write, objCount, vehCount } from '../map-parser/index.mjs';
//import { parse, write, inventoryWrite, inventoryParse } from '../user-parser/index.js';

let rowPerPage = 100;
let currentPage = 1;
let cache;

function extractBetweenTags(str) {
    const startIndex = str.indexOf('>') + 1; 
    const endIndex = str.indexOf('<', startIndex); // Start searching after '>'
    if (startIndex > 0 && endIndex > startIndex) {
        return str.substring(startIndex, endIndex);
    } else {
        return str;
    }
};



function autosave() {
    const data = JSON.stringify(cache);
    localStorage.setItem('AUTOSAVE-MAPEDITOR', data);
   // localStorage.setItem('AUTOSAVE-TIME', getNowTime());
}

function closeUploadSectionManually() {

    $("#uploadSection").slideToggle();
    $("#editingSection").slideToggle();
    $(".appBottomMenu").hide();
    $("#fabNewUser").show();
    $("#editingTableTitle").html(`جدول ویرایش (با ${cache.length} نفر)`)

    displayPage(currentPage);

}

const roles = [
    {
        name: "[TAXI]",
        color: "yellow",
        icon: `<ion-icon name=\"car\"></ion-icon>`
    },
    {
        name: "[POLICE]",
        color: "blue",
        icon: `<ion-icon name=\"shield-half\"></ion-icon>`
    },
    {
        name: "[DOCTOR]",
        color: "green",
        icon: `<ion-icon name=\"medkit\"></ion-icon>`
    },
    {
        name: "[MECHANIC]",
        color: "orange",
        icon: `<ion-icon name=\"build\"></ion-icon>`
    },
    {
        name: "[ADMIN]",
        color: "red",
        icon: `<ion-icon name=\"lock-closed\"></ion-icon>`
    },
    {
        name: "[WORKER]",
        color: "#c7c",
        icon: `<ion-icon name=\"body\"></ion-icon>`
    },
    {
        name: "[BUILDER]",
        color: "white",
        icon: `<ion-icon name=\"business\"></ion-icon>`
    },
    {
        name: "none",
        color: "white",
        icon: `<ion-icon name=\"man\"></ion-icon>`
    }
];

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
            a.href = 'rubika://l.rubika.ir/persianlac';
            a.target = '_blank';
            $(this).off("touchend click");
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }, 10);
    });
   
    // $.get("https://api.counterapi.dev/v1/PersianLACGithubIO/mapeditViewerCount/up", function(data) {
    //     $("#totalViewers").html(`تعداد بازدید : ${data.count}`)
    // });
    


    if(localStorage.getItem('AUTOSAVE-EDITOR') === null) $("#autosaveButton").prop("disabled", true);
    if(!navigator.share) $("#shareButton").html('<ion-icon name="share-social"></ion-icon> اشتراک گذاری پشتیبانی نمی شود').prop("disabled", true);

    

    $("#autosaveButton").on("touchend click", function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            if(localStorage.getItem('AUTOSAVE-EDITOR') !== null) {
                const parsedItems = JSON.parse(localStorage.getItem('AUTOSAVE-MAPEDITOR'));
                cache = parsedItems;
                $("#uploadSection").slideToggle();
                $("#editingSection").slideToggle();
              //  $(".appBottomMenu").hide();
               
                displayObjectsPage();
                displayRoles();
            }
        }, 10);
    });

    $(".btn-close").on("touchend click", function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            $("#alertBoxer").hide();
        }, 10);

    });



    $("#uploadButton").on("touchend click", function(e) {
    
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
        
     
            $(this).prop("disabled", true);
            const content = event.target.result;
            const parsedContent = parse(content);
            if(typeof parsedContent === 'undefined') {
                toastbox("toast-notmap", 3000);
                console.log("Catch?")
                return;
            }  
            
            cache = parsedContent;
            autosave();
           
            $("#uploadSection").slideToggle();
            $("#editingSection").slideToggle();
          //  $(".appBottomMenu").hide();
           
            displayObjectsPage();
            displayRoles();
           
            
        };
    
        reader.readAsText(file, 'utf-8');
            
        }, 10);
    
        
    
        
    
    });

   
    

    $("#downloadButton").on("touchend click", function(e) {

    
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
    
            const blob = new Blob([write(cache)], { type: 'text/plain' });
        
            const url = URL.createObjectURL(blob);
            const timestamp = new Date().getTime();
    
            const link = document.createElement('a');
           
            link.href = `${url}`;
            link.download = 'save-data.txt';
    
        
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
        }, 10);
        
    
    });

    $("#shareButton").on("touchend click", function(e) {

        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
        if(navigator.share) {

            const blob = new Blob([write(cache)], { type: 'text/plain' });

            navigator.share({
                title: 'سیو-دیتای ویرایش شده',
                text: 'save-data.txt',
                files: [
                    new File([blob], 'save-data.txt', { type: "text/plain" })
                ]
            }).catch(() => {
               
            })
        } else {
            toastbox('toast-noshare', 3000);
            return;
        }
            
        }, 10);
        
    
    });


 
});

function displayRoles() {

    const roleList = document.getElementById("roleList");
    const roles = cache.roles;
    
    roleList.innerHTML = "";
    roles.forEach((role) => {
    

        const tr = document.createElement('tr');
        
        const roleN = document.createElement('td');
        roleN.innerHTML = role;
        tr.appendChild(roleN);

        const roleN2 = document.createElement('td');
        roleN2.innerHTML = extractBetweenTags(role);
        tr.appendChild(roleN2);

    
        const acts = document.createElement('td');      
        acts.innerHTML = `
        <button id=\"${role}-acts\" type="button" class=\"btn btn-danger\"><ion-icon name=\"trash\"></ion-icon>ویرایش </button>`;
        tr.appendChild(acts);


        roleList.appendChild(tr);

    });

    
};

function displayObjectsPage() {

    const objList = document.getElementById("objList");
    const dataObjects = cache.objects;
    const eachCount = objCount(dataObjects);
    console.log(eachCount)
    objList.innerHTML = "";
    for (const [k, v] of Object.entries(eachCount)) {

        if(k === "") return;

        const tr = document.createElement('tr');
        
        const objN = document.createElement('td');
        objN.innerHTML = k;
        tr.appendChild(objN);

        const objAmount = document.createElement('td');
        objAmount.innerHTML = `${v}`;
        tr.appendChild(objAmount);

    
        const delButton = document.createElement('td');      
        delButton.innerHTML = `
        <button id=\"${k}-del\" type="button" class=\"btn btn-danger\"><ion-icon name=\"trash\"></ion-icon>حذف </button>`;
        tr.appendChild(delButton);


        objList.appendChild(tr);

    }

};








