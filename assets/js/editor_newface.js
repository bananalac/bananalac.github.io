import { parse, write, inventoryWrite, inventoryParse } from './user-parser/index.js';

let rowPerPage = 100;
let currentPage = 1;
let cache;

function extractBetweenTags(str) {
    // Find the index of the '>' character
    const startIndex = str.indexOf('>') + 1; // Adding 1 to start after '>'
    
    // Find the index of the '<' character
    const endIndex = str.indexOf('<', startIndex); // Start searching after '>'
    
    // Check if both indices are valid
    if (startIndex > 0 && endIndex > startIndex) {
        // Extract and return the substring
        return str.substring(startIndex, endIndex);
    } else {
        // Return an empty string if no valid substring is found
        return str;
    }
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

    //$("#scanModal").modal('toggle');
    
   // $('#searchBar').prop("disabled", true);

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
           
           
            $("#uploadSection").slideToggle();
            $("#editingSection").slideToggle();
            //$("#searchBar").prop("disabled", false);
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
        }, 10);
    });
    
    $("#deleteAllAcceptor").on("touchstart click", function(e) {
        
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            cache = [];
            displayPage(currentPage);
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
                }, 10);
            });

            $("#scanModal").modal("show");

        }, 10);
    });

    $("#scanModal").on("hidden.bs.modal", function(e) {
        $("#scanBody").html("");
    })

   

    

    
})
/**
 * 
 * @param {Number} page 
 */
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

        const inventoryEditor = document.createElement('td');
        //data-bs-toggle=\"modal\" data-bs-target=\"#editInventory\"
        inventoryEditor.innerHTML = `<button id=\"${member.username}-${member.password}-editinv\" data-bs-toggle=\"modal\" data-bs-target=\"#editInventory\" class=\"btn btn-success btn-sm\"><ion-icon name="create"></ion-icon> Edit</button>`;

        tr.appendChild(inventoryEditor);

        const actions = document.createElement('td');      
        if(member.status === 'approved') actions.innerHTML = `
        <button id=\"${member.username}-${member.password}-edit\" data-bs-toggle=\"modal\" data-bs-target=\"#editInfo\" class=\"btn btn-light btn-sm\"><ion-icon name="create"></ion-icon> Edit</button>
        <button id=\"${member.username}-${member.password}-deny\" class=\"btn btn-danger btn-sm\"><ion-icon name="close-sharp"></ion-icon> Deny</button>
        <button id=\"${member.username}-${member.password}-del\"  class=\"btn btn-secondary btn-sm\"><ion-icon name="trash"></ion-icon> Delete</button>
        `
        else  actions.innerHTML = `
        <button id=\"${member.username}-${member.password}-edit\" data-bs-toggle=\"modal\" data-bs-target=\"#editInfo\" class=\"btn btn-light btn-sm\"><ion-icon name="create"></ion-icon> Edit</button>
        <button id=\"${member.username}-${member.password}-appr\" class=\"btn btn-success btn-sm\"><ion-icon name="checkmark-circle"></ion-icon> Approve</button>
        <button id=\"${member.username}-${member.password}-del\" class=\"btn btn-secondary btn-sm\"><ion-icon name="trash"></ion-icon> Delete</button>
        `;
        tr.appendChild(actions);

        table.appendChild(tr);
    });
     
    //* Edit button handler
    $('button[id$="-edit"]').on('touchstart click', function(e) {
        
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            const username = $(this).attr("id").split("-")[0];
            const password = $(this).attr("id").split("-")[1];
            
            const user = cache.find(member => member.username === username && member.password === password);
            const userIndex = cache.findIndex(member => member.username === username && member.password === password);
        if(user) {        
            $("#editUsername").html(`Editing ${username}'s Info`);
            $("#usr1").val(user.username);
            $("#pass1").val(user.password);           
            $("#role1").val(user.role);
            $(".userEditFinder").attr("id", `${userIndex}`);                                                        
        }
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
            displayPage(currentPage);     
        }, 10);
    });
    $('#editInfo').on('hidden.bs.modal', function () {
        $('#usr1').val("");
        $('#role1').val("");
        $('#pass1').val("");
        $("#editUsername").html("");
        $('.inventoryFinder').removeAttr('id');
    });
    //* Edit inv button handler
    $('button[id$="-editinv"]').on('touchstart click', function(e) {
        
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            const username = $(this).attr("id").split("-")[0];
            const password = $(this).attr("id").split("-")[1];
            
            const user = cache.find(member => member.username === username && member.password === password);
            const userIndex = cache.findIndex(member => member.username === username && member.password === password);
        if(user) {        
            $("#invEditorUsername").html(`Editing ${username}'s Inventory`);
            $("#inv1").val(user.inventoryString);
            $(".inventoryFinder").attr("id", `${userIndex}`);
        }
       
        }, 10);
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
            $('#inv1').val("");
            $("#invEditorUsername").html("");
            $('.inventoryFinder').removeAttr('id');
            displayPage(currentPage);      
        }, 10);
    });
    $('#editInventory').on('hidden.bs.modal', function () {
        $('#inv1').val("");
        $("#invEditorUsername").html("");
        $('.inventoryFinder').removeAttr('id');
    });
    //! Delete button handler (OK)
    $('button[id$="-del"]').on('touchstart click', function(e) {
        
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            const username = $(this).attr("id").split("-")[0];
            const password = $(this).attr("id").split("-")[1];
            
            const user = cache.find(member => member.username === username && member.password === password);
            const userIndex = cache.findIndex(member => member.username === username && member.password === password);
       
            if(user) {
                cache.splice(userIndex, 1);
                displayPage(page);
            }
        }, 10);
        
        
    });
    //! Deny button handler (OK)
    $('button[id$="-deny"]').on('touchstart click', function(e) {
        
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            const username = $(this).attr("id").split("-")[0];
            const password = $(this).attr("id").split("-")[1];
            
            const user = cache.find(member => member.username === username && member.password === password);
            const userIndex = cache.findIndex(member => member.username === username && member.password === password);
       
            if(user) {
               cache[userIndex].status = 'pending';
               displayPage(page);
            }
        }, 10);
        
        
    });
    //* Approve button handler (OK)
    $('button[id$="-appr"]').on('touchstart click', function(e) {
        
        e.preventDefault();
        e.stopImmediatePropagation();
        const username = $(this).attr("id").split("-")[0];
        const password = $(this).attr("id").split("-")[1];
        
        const user = cache.find(member => member.username === username && member.password === password);
        const userIndex = cache.findIndex(member => member.username === username && member.password === password);
   
        if(user) {
           cache[userIndex].status = 'approved';
           displayPage(page);
        }
        
    });

    currentPage = page;
    updatePagination(page);

}

function displayPageSearch(page, arr) {

    const table = document.getElementById("usersList");
    const startIndex = (page - 1) * rowPerPage;
    const endIndex = startIndex + rowPerPage;
    const slicedData = arr.slice(startIndex, endIndex);
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

        const inventoryEditor = document.createElement('td');
        //data-bs-toggle=\"modal\" data-bs-target=\"#editInventory\"
        inventoryEditor.innerHTML = `<button id=\"${member.username}-${member.password}-editinv\" data-bs-toggle=\"modal\" data-bs-target=\"#editInventory\" class=\"btn btn-success btn-sm\"><ion-icon name="create"></ion-icon> Edit</button>`;

        tr.appendChild(inventoryEditor);

        const actions = document.createElement('td');      
        if(member.status === 'approved') actions.innerHTML = `
        <button id=\"${member.username}-${member.password}-edit\" data-bs-toggle=\"modal\" data-bs-target=\"#editInfo\" class=\"btn btn-light btn-sm\"><ion-icon name="create"></ion-icon> Edit</button>
        <button id=\"${member.username}-${member.password}-deny\" class=\"btn btn-danger btn-sm\"><ion-icon name="close-sharp"></ion-icon> Deny</button>
        <button id=\"${member.username}-${member.password}-del\"  class=\"btn btn-secondary btn-sm\"><ion-icon name="trash"></ion-icon> Delete</button>
        `
        else  actions.innerHTML = `
        <button id=\"${member.username}-${member.password}-edit\" data-bs-toggle=\"modal\" data-bs-target=\"#editInfo\" class=\"btn btn-light btn-sm\"><ion-icon name="create"></ion-icon> Edit</button>
        <button id=\"${member.username}-${member.password}-appr\" class=\"btn btn-success btn-sm\"><ion-icon name="checkmark-circle"></ion-icon> Approve</button>
        <button id=\"${member.username}-${member.password}-del\" class=\"btn btn-secondary btn-sm\"><ion-icon name="trash"></ion-icon> Delete</button>
        `;
        tr.appendChild(actions);

        table.appendChild(tr);
    });
     
    //* Edit button handler
    $('button[id$="-edit"]').on('touchstart click', function(e) {
        
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            const username = $(this).attr("id").split("-")[0];
            const password = $(this).attr("id").split("-")[1];
            
            const user = cache.find(member => member.username === username && member.password === password);
            const userIndex = cache.findIndex(member => member.username === username && member.password === password);
        if(user) {        
            $("#editUsername").html(`Editing ${username}'s Info`);
            $("#usr1").val(user.username);
            $("#pass1").val(user.password);           
            $("#role1").val(user.role);
            $(".userEditFinder").attr("id", `${userIndex}`);                                                        
        }
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
            displayPageSearch(currentPage, arr);     
        }, 10);
    });
    $('#editInfo').on('hidden.bs.modal', function () {
        $('#usr1').val("");
        $('#role1').val("");
        $('#pass1').val("");
        $("#editUsername").html("");
        $('.inventoryFinder').removeAttr('id');
    });
    //* Edit inv button handler
    $('button[id$="-editinv"]').on('touchstart click', function(e) {
        
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            const username = $(this).attr("id").split("-")[0];
            const password = $(this).attr("id").split("-")[1];
            
            const user = cache.find(member => member.username === username && member.password === password);
            const userIndex = cache.findIndex(member => member.username === username && member.password === password);
        if(user) {        
            $("#invEditorUsername").html(`Editing ${username}'s Inventory`);
            $("#inv1").val(user.inventoryString);
            $(".inventoryFinder").attr("id", `${userIndex}`);
        }
       
        }, 10);
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
            $('#inv1').val("");
            $("#invEditorUsername").html("");
            $('.inventoryFinder').removeAttr('id');
            displayPageSearch(currentPage, arr);
        }, 10);
    });
    $('#editInventory').on('hidden.bs.modal', function () {
        $('#inv1').val("");
        $("#invEditorUsername").html("");
        $('.inventoryFinder').removeAttr('id');
    });
    //! Delete button handler (OK)
    $('button[id$="-del"]').on('touchstart click', function(e) {
        
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            const username = $(this).attr("id").split("-")[0];
            const password = $(this).attr("id").split("-")[1];
            
            const user = cache.find(member => member.username === username && member.password === password);
            const userIndex = cache.findIndex(member => member.username === username && member.password === password);
       
            if(user) {
                cache.splice(userIndex, 1);
                displayPageSearch(currentPage, arr);
            }
        }, 10);
        
        
    });
    //! Deny button handler (OK)
    $('button[id$="-deny"]').on('touchstart click', function(e) {
        
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            const username = $(this).attr("id").split("-")[0];
            const password = $(this).attr("id").split("-")[1];
            
            const user = cache.find(member => member.username === username && member.password === password);
            const userIndex = cache.findIndex(member => member.username === username && member.password === password);
       
            if(user) {
               cache[userIndex].status = 'pending';
               displayPageSearch(currentPage, arr);
            }
        }, 10);
        
        
    });
    //* Approve button handler (OK)
    $('button[id$="-appr"]').on('touchstart click', function(e) {
        
        e.preventDefault();
        e.stopImmediatePropagation();
        const username = $(this).attr("id").split("-")[0];
        const password = $(this).attr("id").split("-")[1];
        
        const user = cache.find(member => member.username === username && member.password === password);
        const userIndex = cache.findIndex(member => member.username === username && member.password === password);
   
        if(user) {
           cache[userIndex].status = 'approved';
           displayPageSearch(currentPage, arr);
        }
        
    });

    currentPage = page;
    updatePaginationSearch(page, arr);

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








