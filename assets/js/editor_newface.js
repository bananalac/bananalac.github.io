import { parse, write, inventoryWrite, inventoryParse } from './user-parser/index.js';

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

function getNowTime() {
    const date = new Date();

    let weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let dateString = weekdayNames[date.getDay()] + " " 
        + date.getHours() + ":" + ("00" + date.getMinutes()).slice(-2) + " " 
        + date.getDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear();
    
    return dateString;
}

function autosave() {
    const data = JSON.stringify(cache);
    localStorage.setItem('AUTOSAVE-EDITOR', data);
    localStorage.setItem('AUTOSAVE-TIME', getNowTime());
}

function closeUploadSectionManually() {

    $("#uploadSection").slideToggle();
    $("#editingSection").slideToggle();
    $(".appBottomMenu").hide();
    $("#fabNewUser").show();
    $("#editingTableTitle").html(`Editing Table (With ${cache.length} users.)`)

    displayPage(currentPage);

};

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


    if(localStorage.getItem('AUTOSAVE-EDITOR') === null) $("#autosaveButton").prop("disabled", true);
    if(!navigator.share) $("#shareButton").html('<ion-icon name="share-social"></ion-icon> Share isn\'t supported').prop("disabled", true);

    $("#autosaveButton").on("touchstart click", function(e) {
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

    $(".btn-close").on("touchstart click", function(e) {
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

    $("#uploadButton").on("touchstart click", function(e) {
    
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
            $("#editingTableTitle").html(`Editing Table (With ${cache.length} users.)`)
    
            displayPage(currentPage);
                
            } catch (e) {
                toastbox("toast-notsavedata", 3000);
                return;
            }
            
        };
    
        reader.readAsText(file, 'utf-8');
            
        }, 10);
    
        
    
        
    
    });

    $("#approveAll").on("touchstart click", function(e) {
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
    
    $("#denyAll").on("touchstart click", function(e) {    
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

    $("#downloadButton").on("touchstart click", function(e) {

    
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

    $("#shareButton").on("touchstart click", function(e) {

        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
        if(navigator.share) {

            const blob = new Blob([write(cache)], { type: 'text/plain' });

            navigator.share({
                title: 'Edited SaveData',
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

    $("#scanUsers").on("touchstart click", function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            const scanBody = document.getElementById('scanBody');
            const builderUsers = cache.filter(member => member.role.toLowerCase().includes('builder'));
            const adminUsers = cache.filter(member => member.role.toLowerCase().includes('admin'));

            if(builderUsers.length > 0) {
                const p = document.createElement('p');
                p.innerHTML = `<span class=\"badge badge-warning\">[BUILDER]</span> Detected!<br>This role gives users access to map editing and is a very sensitive role, so it is recommended to remove this role from the ${builderUsers.length} users who have it.`;
                scanBody.appendChild(p);
                scanBody.innerHTML += `<button id=\"removeAllBuilders\" type=\"button\" class=\"btn btn-danger btn-block\"><ion-icon name="close"></ion-icon> Remove</button>`;
            }

            if(adminUsers.length > 0) {
                const p = document.createElement('p');
                p.innerHTML = `<span class=\"badge badge-danger\">[ADMIN]</span> Detected!<br>Those who have this role have the ability to fire and ban people and generally have admin access, so it is recommended to remove this role from the ${adminUsers.length} people who have it.`;
                scanBody.appendChild(p);
                scanBody.innerHTML += `<button id=\"removeAllAdmins\" type=\"button\" class=\"btn btn-danger btn-block\"><ion-icon name="close"></ion-icon> Remove</button>`;
            }

            if(scanBody.innerHTML === '') {
                const p = document.createElement('p');
                p.innerHTML = `Excellent!<br>No sensitive items were found`;
                scanBody.appendChild(p);
            }

            $("#removeAllBuilders").on("touchstart click", function(e) {
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

            $("#removeAllAdmins").on("touchstart click", function(e) {
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
    $("#editingTableTitle").html(`Editing Table (With ${cache.length} users.)`);

    table.innerHTML = "";
    slicedData.forEach((member) => {

        const tr = document.createElement('tr');
        tr.id = `${member.user}-${member.password}`;

        const status = document.createElement('td');
        const converterItem = { 
            approved: `<ion-icon name=\"checkmark-done-outline\"></ion-icon> Approved`, 
            pending: `<ion-icon name=\"time-outline\"></ion-icon> Pending` 
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
        Options
        </button>
          <div class="dropdown-menu">
                        <h6 class="dropdown-header">${member.username} Options :</h6> 
                        <a id=\"${member.username}-${member.password}-edit-optionHandler\" class="dropdown-item" href="#">
                            <ion-icon name="create"></ion-icon>
                            EDIT
                        </a>
                        <a id=\"${member.username}-${member.password}-inv-optionHandler\" class="dropdown-item" href="#">
                            <ion-icon name="create"></ion-icon>
                            Inventory
                        </a>
                        <a id=\"${member.username}-${member.password}-sts-optionHandler\" class="dropdown-item" href="#">
                            <ion-icon name="invert-mode-outline"></ion-icon>
                            Approve/Deny
                        </a>
                        <div class="dropdown-divider"></div>
                        <a id=\"${member.username}-${member.password}-delete-optionHandler\" class="dropdown-item text-danger" href="#">
                            <ion-icon class="text-danger" name="trash"></ion-icon>
                            Delete
                        </a>
                    </div>
        </div>
        `;
        tr.appendChild(action);


        table.appendChild(tr);
    });

    $('a[id$="-optionHandler"]').on('touchstart click', function(e) {
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
                    $("#editUsername").html(`Editing ${cache[userIndex].username}'s Info`);
                    $("#usr1").val(cache[userIndex].username);
                    $("#pass1").val(cache[userIndex].password);           
                    $("#role1").val(cache[userIndex].role);
                    $(".userEditFinder").attr("id", `${userIndex}`);          
                }
                else if(type === 'inv') {
                    $("#editInventory").modal('show');
                    $("#invEditorUsername").html(`Editing ${username}'s Inventory`);
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
    $("#acceptEdits").on('touchstart click', function(e) {
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
    $("#acceptEdits2").on('touchstart click', function(e) {
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
            approved: `<ion-icon name=\"checkmark-done-outline\"></ion-icon> Approved`, 
            pending: `<ion-icon name=\"time-outline\"></ion-icon> Pending` 
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
        Options
        </button>
          <div class="dropdown-menu">
                        <h6 class="dropdown-header">${member.username} Options :</h6> 
                        <a id=\"${member.username}-${member.password}-edit-optionHandler\" class="dropdown-item" href="#">
                            <ion-icon name="create"></ion-icon>
                            EDIT
                        </a>
                        <a id=\"${member.username}-${member.password}-inv-optionHandler\" class="dropdown-item" href="#">
                            <ion-icon name="create"></ion-icon>
                            Inventory
                        </a>
                        <a id=\"${member.username}-${member.password}-sts-optionHandler\" class="dropdown-item" href="#">
                            <ion-icon name="invert-mode-outline"></ion-icon>
                            Approve/Deny
                        </a>
                        <div class="dropdown-divider"></div>
                        <a id=\"${member.username}-${member.password}-delete-optionHandler\" class="dropdown-item text-danger" href="#">
                            <ion-icon class="text-danger" name="trash"></ion-icon>
                            Delete
                        </a>
                    </div>
        </div>
        `;
        tr.appendChild(action);

        table.appendChild(tr);
    });

   
    $('a[id$="-optionHandler"]').on('touchstart click', function(e) {
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
                    $("#editUsername").html(`Editing ${cache[userIndex].username}'s Info`);
                    $("#usr1").val(cache[userIndex].username);
                    $("#pass1").val(cache[userIndex].password);           
                    $("#role1").val(cache[userIndex].role);
                    $(".userEditFinder").attr("id", `${userIndex}`);          
                }
                else if(type === 'inv') {
                    $("#editInventory").modal('show');
                    $("#invEditorUsername").html(`Editing ${username}'s Inventory`);
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
    $("#acceptEdits").on('touchstart click', function(e) {
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
    $("#acceptEdits2").on('touchstart click', function(e) {
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








