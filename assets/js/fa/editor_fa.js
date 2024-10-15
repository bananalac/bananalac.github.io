import { parse, write, inventoryWrite, inventoryParse } from '../user-parser/index.mjs';

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
    localStorage.setItem('AUTOSAVE-EDITOR', data);
};

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

    $.get("https://api.counterapi.dev/v1/PersianLACGithubIO/editorViewerCount/up", function(data) {
        $("#totalViewers").html(`تعداد بازدید : ${data.count}`)
    });

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
    
    if(localStorage.getItem('AUTOSAVE-EDITOR') === null) $("#autosaveButton").prop("disabled", true);
    if(!navigator.share) $("#shareButton").html('<ion-icon name="share-social"></ion-icon> اشتراک گذاری پشتیبانی نمی شود').prop("disabled", true);


    $("#autosaveButton").on("touchend click", function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            if(localStorage.getItem('AUTOSAVE-EDITOR') !== null) {
                const parsedItems = JSON.parse(localStorage.getItem('AUTOSAVE-EDITOR'));
                cache = parsedItems;
                closeUploadSectionManually();
                toastbox('toast-autosave', 3000);
                displayPage(currentPage);
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


    $('#searchBar').on('keyup', function(e) {

        e.preventDefault();
        e.stopImmediatePropagation();  
        const filter = $(this).val().trim();
        
        if(filter === '') {            
            displayPage(currentPage);
        } else {
            if(filter.startsWith('status:') && filter.split(":")[1].trim() !== '') {
                const statusFilter = cache.filter(mems => mems.status.toLowerCase().includes(filter.toLowerCase().replace('status:', '')));
                displayPageSearch(1, statusFilter);
            }
            if(filter.startsWith('user:') && filter.split(":")[1].trim() !== '') {
                const userFilter = cache.filter(mems => mems.username.toLowerCase().includes(filter.toLowerCase().replace('user:', '')));
                displayPageSearch(1, userFilter);
            }
            if(filter.startsWith('pass:') && filter.split(":")[1].trim() !== '') {
                const passFilter = cache.filter(mems => mems.password.toLowerCase().includes(filter.toLowerCase().replace('pass:', '')));
                displayPageSearch(1, passFilter);
            }
            if(filter.startsWith('role:') && filter.split(":")[1].trim() !== '') {
                const roleFilter = cache.filter(mems => mems.role.toLowerCase().includes(filter.toLowerCase().replace('role:', '')));
                displayPageSearch(1, roleFilter);
            }
        }
       
    });

    $("#uploadButton").on("touchend click", function(e) {
    
        e.preventDefault();
        e.stopImmediatePropagation();
    
        setTimeout(() => {
        
        const fileInput = document.getElementById("fileuploadInput");
    
        if(fileInput.files.length === 0) { 
            toastbox("toast-nosavedata", 3000);
            return;
        }
    
        const file = fileInput.files[0];
    
        if(file.type !== 'text/plain') {
            toastbox("toast-wtype", 3000);
            return;
        }
    
       
        const reader = new FileReader();
    
        reader.onload = function(event) {
        
            try {
            $(this).prop("disabled", true);
            const content = event.target.result;
            const parsedContent = parse(content);
            if(parsedContent.error) {
              
            }  
            if(parsedContent.members.length === 0) {
                toastbox("toast-emptysavedata", 3000);
                return;
            }  
            cache = parsedContent.members;
            autosave();
           
            $("#uploadSection").slideToggle();
            $("#editingSection").slideToggle();
            $(".appBottomMenu").hide();
            $("#fabNewUser").show();
            $("#editingTableTitle").html(`جدول ویرایش (با ${cache.length} کاربر)`);
    
            displayPage(currentPage);
                
            } catch (e) {
                toastbox("toast-notsavedata", 3000);
                return;
            }
            
        };
    
        reader.readAsText(file, 'utf-8');
            
        }, 10);
    
        
    
        
    
    });

    $("#approveAll").on("touchend click", function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            cache.forEach((mem, memIndex) => {
                cache[memIndex].status = 'approved';
            });
            toastbox("toast-approved", 3000);
            displayPage(currentPage);
            autosave();
        }, 10);   
    });
    
    $("#denyAll").on("touchend click", function(e) {    
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            cache.forEach((mem, memIndex) => {
                cache[memIndex].status = 'pending';
            });
            toastbox("toast-denied", 3000);
            displayPage(currentPage);
            autosave();
        }, 10);
    });
    

    $("#downloadButton").on("touchend click", function(e) {

    
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            $("#rating").show();
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
            $("#rating").show();
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

    $("#scanUsers").on("touchend click", function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            const scanBody = document.getElementById('scanBody');
            const builderUsers = cache.filter(member => member.role.toLowerCase().includes('builder'));
            const adminUsers = cache.filter(member => member.role.toLowerCase().includes('admin'));

            if(builderUsers.length > 0) {
                const p = document.createElement('p');
                p.innerHTML = `<span class=\"badge badge-warning\">[بیلدر]</span> تشخیص داده شد!<br>این رول به کاربران دسترسی ویرایش مپ میدهد،لذا میتواند برای مپ شما آسیب پذیری ایجاد کند.از همه ${builderUsers.length} نفری که آنرا دارند،رول را حذف کنید.`;
                scanBody.appendChild(p);
                scanBody.innerHTML += `<button id=\"removeAllBuilders\" type=\"button\" class=\"btn btn-danger btn-block\"><ion-icon name="close"></ion-icon> حذف</button>`;
            }

            if(adminUsers.length > 0) {
                const p = document.createElement('p');
                p.innerHTML = `<span class=\"badge badge-danger\">[ادمین]</span> تشخیص داده شد!<br>افرادی که این رول را دارند میتوانند افراد را کیک یا بن کرده ویا از امکانات مختص ادمین که خودتان در مپ تهیه کرده اید استفاده کنند.توصیه میشود از همه ${adminUsers.length} که آنرا دارند،رول را حذف کنید.`;
                scanBody.appendChild(p);
                scanBody.innerHTML += `<button id=\"removeAllAdmins\" type=\"button\" class=\"btn btn-danger btn-block\"><ion-icon name="close"></ion-icon> حذف</button>`;
            }

            if(scanBody.innerHTML === '') {
                const p = document.createElement('p');
                p.innerHTML = `عالی!<br>هیچ مورد حساسی یافت نشد!`;
                scanBody.appendChild(p);
            }

            $("#removeAllBuilders").on("touchend click", function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                setTimeout(() => {
                    cache = cache.filter(member => !member.role.toLowerCase().includes('builder'));
                    $(this).text("All removed!");
                    $(this).prop("disabled", true);
                    $(this).removeClass("btn-danger");
                    $(this).addClass("btn-success");
                    displayPage(currentPage);
                    autosave();
                }, 10);
            });

            $("#removeAllAdmins").on("touchend click", function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                setTimeout(() => {
                    cache = cache.filter(member => !member.role.toLowerCase().includes('admin'));
                    $(this).text("All removed!");
                    $(this).prop("disabled", true);
                    $(this).removeClass("btn-danger");
                    $(this).addClass("btn-success");
                    displayPage(currentPage);
                    autosave();
                }, 10);
            });

            $("#scanModal").modal("show");

        }, 10);
    });

    $("#scanModal").on("hidden.bs.modal", function(e) {
        $("#scanBody").html("");
    })
 
});

function displayPage(page) {

    const table = document.getElementById("usersList");
    const startIndex = (page - 1) * rowPerPage;
    const endIndex = startIndex + rowPerPage;
    const slicedData = cache.slice(startIndex, endIndex);
    $("#editingTableTitle").html(`جدول ویرایش (با ${cache.length} کاربر)`);

    table.innerHTML = "";
    slicedData.forEach((member) => {

        const tr = document.createElement('tr');
        tr.id = `${member.user}-${member.password}`;

        const status = document.createElement('td');
        const converterItem = { 
            approved: `<ion-icon name=\"checkmark-done-outline\"></ion-icon> تایید شده`, 
            pending: `<ion-icon name=\"time-outline\"></ion-icon> در انتظار` 
        };
        
        status.innerHTML = converterItem[member.status];
        tr.appendChild(status);

        const username = document.createElement('td');
        username.innerHTML = member.username;
        tr.appendChild(username);

        const password = document.createElement('td');
        password.innerHTML = member.password;
        tr.appendChild(password);


        const role = document.createElement('td');
        const findDef = roles.find(o => o.name === extractBetweenTags(member.role) );
        if(findDef) {
            role.innerHTML = `<span style=\"color:${findDef.color}\">${findDef.icon} ${extractBetweenTags(member.role)}</span>`;
        } else role.innerHTML = extractBetweenTags(member.role);
        tr.appendChild(role);

        const action = document.createElement('td');      
        action.innerHTML = `
        <div class="dropdown">
        <button id=\"${member.username}-${member.password}-opts\" type="button" data-bs-toggle="dropdown" class=\"btn btn-info dropdown-toggle\">
        <ion-icon name=\"apps-sharp\"></ion-icon>
        تنظیمات
        </button>
          <div class="dropdown-menu">
                        <h6 class="dropdown-header">${member.username} تنظیمات :</h6> 
                        <a id=\"${member.username}-${member.password}-edit-optionHandler\" class="dropdown-item" href="#">
                            <ion-icon name="create"></ion-icon>
                            ویرایش اطلاعات
                        </a>
                        <a id=\"${member.username}-${member.password}-inv-optionHandler\" class="dropdown-item" href="#">
                            <ion-icon name="create"></ion-icon>
                            ویرایش آیونتوری
                        </a>
                        <a id=\"${member.username}-${member.password}-sts-optionHandler\" class="dropdown-item" href="#">
                            <ion-icon name="invert-mode-outline"></ion-icon>
                            قبول/رد
                        </a>
                        <div class="dropdown-divider"></div>
                        <a id=\"${member.username}-${member.password}-delete-optionHandler\" class="dropdown-item text-danger" href="#">
                            <ion-icon class="text-danger" name="trash"></ion-icon>
                            حذف
                        </a>
                    </div>
        </div>
        `;
        tr.appendChild(action);


        table.appendChild(tr);
    });

    $('a[id$="-optionHandler"]').on('touchend click', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            const username = $(this).attr("id").split("-")[0];
            const password = $(this).attr("id").split("-")[1];
            const type = $(this).attr("id").split("-")[2];
            
            const user = cache.find(member => member.username === username && member.password === password);
            const userIndex = cache.findIndex(member => member.username === username && member.password === password);
            if(user) {

                $(".dropdown-menu").removeClass("show");

                if(type === 'edit') {
                    $("#editInfo").modal('show');
                    $("#editUsername").html(`ویرایش اطلاعات ${cache[userIndex].username}`);
                    $("#usr1").val(cache[userIndex].username);
                    $("#pass1").val(cache[userIndex].password);           
                    $("#role1").val(cache[userIndex].role);
                    $(".userEditFinder").attr("id", `${userIndex}`);          
                }
                else if(type === 'inv') {
                    $("#editInventory").modal('show');
                    $("#invEditorUsername").html(`ویرایش آیونتوری ${cache[userIndex].username}`);
                    $("#inv1").val(user.inventoryString);
                    $(".inventoryFinder").attr("id", `${userIndex}`);    
                }
                else if(type === 'sts') {
                    if(user.status === 'approved') cache[userIndex].status = 'pending'
                    else cache[userIndex].status = 'approved'; 
                    displayPage(page);
                    autosave();
                }
                else if(type === 'delete') {
                    cache.splice(userIndex, 1);
                    displayPage(page);
                    autosave();
                }

                
                        
            }
            
        }, 10);

    });


    $('#editInfo').on('hidden.bs.modal', function () {
        $('#usr1').val("");
        $('#role1').val("");
        $('#pass1').val("");
        $("#editUsername").html("");
        $('.inventoryFinder').removeAttr('id');
    });
    $('#editInventory').on('hidden.bs.modal', function () {
        $('#inv1').val("");
        $("#invEditorUsername").html("");
        $('.inventoryFinder').removeAttr('id');
    });
    $("#acceptEdits").on('touchend click', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            if($("#inv1").val().trim() === '') {
                alert('Provide An Inventory!');
                return;
            }
            const selectedIndex = Number($(".inventoryFinder").attr("id"));
            const parsedInfo = inventoryParse($("#inv1").val().trim());
            cache[selectedIndex].inventory = parsedInfo;
            cache[selectedIndex].inventoryString = $("#inv1").val().trim();
            toastbox('toast-invedit', 3000);
            $("#editInventory").modal("hide");
            displayPage(currentPage); 
            autosave();     
        }, 10);
    });
    $("#acceptEdits2").on('touchend click', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            const selectedIndex = Number($(".userEditFinder").attr("id"));
            const username = $("#usr1").val().trim();
            const password = $("#pass1").val().trim();
            const role = $("#role1").val().trim();
            if(username === '' || password === '' || role === '') {
                alert('Don\'t leave any input empty!');
                return;
            }
            cache[selectedIndex].username = username;
            cache[selectedIndex].password = password;
            cache[selectedIndex].role = role;
            toastbox("toast-invedit", 3000);
            $("#editInfo").modal("hide");
            displayPage(currentPage); 
            autosave();    
        }, 10);
    });
    
   

    currentPage = page;
    updatePagination(page);

}

function displayPageSearch(page, arr) {

    const table = document.getElementById("usersList");
    const startIndex = (page - 1) * rowPerPage;
    const endIndex = startIndex + rowPerPage;
    const slicedData = arr.slice(startIndex, endIndex);
    $("#editingTableTitle").html(`Found ${arr.length} user.`);

    table.innerHTML = "";
    slicedData.forEach((member) => {

        const tr = document.createElement('tr');
        tr.id = `${member.user}-${member.password}`;

        const status = document.createElement('td');
        const converterItem = { 
            approved: `<ion-icon name=\"checkmark-done-outline\"></ion-icon> تائید شده`, 
            pending: `<ion-icon name=\"time-outline\"></ion-icon> در انتظار` 
        };
        
        status.innerHTML = converterItem[member.status];
        tr.appendChild(status);

        const username = document.createElement('td');
        username.innerHTML = member.username;
        tr.appendChild(username);

        const password = document.createElement('td');
        password.innerHTML = member.password;
        tr.appendChild(password);


        const role = document.createElement('td');
        const findDef = roles.find(o => o.name === extractBetweenTags(member.role) );
        if(findDef) {
            role.innerHTML = `<span style=\"color:${findDef.color}\">${findDef.icon} ${extractBetweenTags(member.role)}</span>`;
        } else role.innerHTML = extractBetweenTags(member.role);
        tr.appendChild(role);

        const action = document.createElement('td');      
        action.innerHTML = `
        <div class="dropdown">
        <button id=\"${member.username}-${member.password}-opts\" type="button" data-bs-toggle="dropdown" class=\"btn btn-info dropdown-toggle\">
        <ion-icon name=\"apps-sharp\"></ion-icon>
        تنظیمات
        </button>
          <div class="dropdown-menu">
                        <h6 class="dropdown-header">${member.username} Options :</h6> 
                        <a id=\"${member.username}-${member.password}-edit-optionHandler\" class="dropdown-item" href="#">
                            <ion-icon name="create"></ion-icon>
                            ویرایش اطلاعات
                        </a>
                        <a id=\"${member.username}-${member.password}-inv-optionHandler\" class="dropdown-item" href="#">
                            <ion-icon name="create"></ion-icon>
                            ویرایش آیونتوری
                        </a>
                        <a id=\"${member.username}-${member.password}-sts-optionHandler\" class="dropdown-item" href="#">
                            <ion-icon name="invert-mode-outline"></ion-icon>
                            قبول/رد
                        </a>
                        <div class="dropdown-divider"></div>
                        <a id=\"${member.username}-${member.password}-delete-optionHandler\" class="dropdown-item text-danger" href="#">
                            <ion-icon class="text-danger" name="trash"></ion-icon>
                            حذف
                        </a>
                    </div>
        </div>
        `;
        tr.appendChild(action);

        table.appendChild(tr);
    });

   
    $('a[id$="-optionHandler"]').on('touchend click', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            const username = $(this).attr("id").split("-")[0];
            const password = $(this).attr("id").split("-")[1];
            const type = $(this).attr("id").split("-")[2];
            
            const user = cache.find(member => member.username === username && member.password === password);
            const userIndex = cache.findIndex(member => member.username === username && member.password === password);
            if(user) {

                $(".dropdown-menu").removeClass("show");

                if(type === 'edit') {
                    $("#editInfo").modal('show');
                    $("#editUsername").html(`ویرایش اطلاعات ${cache[userIndex].username}`);
                    $("#usr1").val(cache[userIndex].username);
                    $("#pass1").val(cache[userIndex].password);           
                    $("#role1").val(cache[userIndex].role);
                    $(".userEditFinder").attr("id", `${userIndex}`);          
                }
                else if(type === 'inv') {
                    $("#editInventory").modal('show');
                    $("#invEditorUsername").html(`ویرایش آیونتوری ${cache[userIndex].username}`);
                    $("#inv1").val(user.inventoryString);
                    $(".inventoryFinder").attr("id", `${userIndex}`);    
                }
                else if(type === 'sts') {
                    if(user.status === 'approved') cache[userIndex].status = 'pending'
                    else cache[userIndex].status = 'approved'; 
                    displayPage(page);
                    autosave();
                }
                else if(type === 'delete') {
                    cache.splice(userIndex, 1);
                    displayPage(page);
                    autosave();
                }

                
                        
            }
            
        }, 10);

    });
    

    $('#editInfo').on('hidden.bs.modal', function () {
        $('#usr1').val("");
        $('#role1').val("");
        $('#pass1').val("");
        $("#editUsername").html("");
        $('.inventoryFinder').removeAttr('id');
    });
    $('#editInventory').on('hidden.bs.modal', function () {
        $('#inv1').val("");
        $("#invEditorUsername").html("");
        $('.inventoryFinder').removeAttr('id');
    });
    $("#acceptEdits").on('touchend click', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            if($("#inv1").val().trim() === '') {
                alert('Provide An Inventory!');
                return;
            }
            const selectedIndex = Number($(".inventoryFinder").attr("id"));
            const parsedInfo = inventoryParse($("#inv1").val().trim());
            cache[selectedIndex].inventory = parsedInfo;
            cache[selectedIndex].inventoryString = $("#inv1").val().trim();
            toastbox('toast-invedit', 3000);
            $("#editInventory").modal("hide");
            displayPage(currentPage, arr);    
            autosave();  
        }, 10);
    });
    $("#acceptEdits2").on('touchend click', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            const selectedIndex = Number($(".userEditFinder").attr("id"));
            const username = $("#usr1").val().trim();
            const password = $("#pass1").val().trim();
            const role = $("#role1").val().trim();
            if(username === '' || password === '' || role === '') {
                alert('Don\'t leave any input empty!');
                return;
            }
            cache[selectedIndex].username = username;
            cache[selectedIndex].password = password;
            cache[selectedIndex].role = role;
            toastbox("toast-invedit", 3000);
            $("#editInfo").modal("hide");
            displayPage(currentPage, arr);     
            autosave();
        }, 10);
    });
   
   

    currentPage = page;
    updatePaginationSearch(page);

}

function updatePagination(currentPage) {
    const pageCount = Math.ceil(cache.length / rowPerPage);
    const paginationContainer = document.getElementsByClassName("pagination")[0];
    paginationContainer.innerHTML = "";

    for (let i = 1; i <= pageCount; i++) {
        const innerLi = document.createElement('li');
        const innerAnchor = document.createElement('a');
        
        innerAnchor.className = "page-link";
        innerAnchor.innerText = i;
        innerAnchor.href = "javascript:void(0)";

        if(i === currentPage) {
            innerAnchor.className += ' bg-success';
        };

        innerLi.appendChild(innerAnchor);
        innerLi.className = "page-item";

        innerLi.onclick = () => {
            displayPage(i);
        };

       

        paginationContainer.appendChild(innerLi);
    }
}

function updatePaginationSearch(currentPage, arr) {
    const pageCount = Math.ceil(arr.length / rowPerPage);
    const paginationContainer = document.getElementsByClassName("pagination")[0];
    paginationContainer.innerHTML = "";

    for (let i = 1; i <= pageCount; i++) {
        const innerLi = document.createElement('li');
        const innerAnchor = document.createElement('a');
        
        innerAnchor.className = "page-link";
        innerAnchor.innerText = i;
        innerAnchor.href = "javascript:void(0)";

        if(i === currentPage) {
            innerAnchor.className += ' bg-success';
        };

        innerLi.appendChild(innerAnchor);
        innerLi.className = "page-item";

        innerLi.onclick = () => {
            displayPageSearch(i, arr);
        };

       

        paginationContainer.appendChild(innerLi);
    }
}








