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
        icon: `<i style=\"color: yellow\" class=\"fas fa-taxi\"></i>`
    },
    {
        name: "[POLICE]",
        color: "blue",
        icon: `<i style=\"color: lightblue\" class=\"fas fa-fighter-jet\"></i>`
    },
    {
        name: "[DOCTOR]",
        color: "green",
        icon: `<i style=\"color: green\" class=\"fas fa-user-md\"></i>`
    },
    {
        name: "[MECHANIC]",
        color: "orange",
        icon: `<i style=\"color: orange\" class=\"fas fa-wrench\"></i>`
    },
    {
        name: "[ADMIN]",
        color: "red",
        icon: `<i style=\"color: red\" class=\"fas fa-user-shield\"></i>`
    },
    {
        name: "[WORKER]",
        color: "#c7c",
        icon: `<i style=\"color: #c7c\" class=\"fas fa-hard-hat\"></i>`
    },
    {
        name: "[BUILDER]",
        color: "white",
        icon: `<i style=\"color: white\" class=\"fas fa-bible\"></i>`
    }
];

$(document).ready(function() {

    // $("#approveAll").prop("disabled", true);
    // $("#denyAll").prop("disabled", true);
    // $("#deleteAll").prop("disabled", true);
    // $("#downloadButton").prop("disabled", true);
    $('#searchBar').prop("disabled", true);

    // $('#searchBar').on('keyup', function(e) {

    //     e.preventDefault();
    //     e.stopImmediatePropagation();    
       
    // });

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
        inventoryEditor.innerHTML = `<button id=\"${member.username}-${member.password}-editinv\" class=\"btn btn-success btn-sm\"><ion-icon name="create"></ion-icon> Edit</button>`;

        tr.appendChild(inventoryEditor);

        const actions = document.createElement('td');
        //data-bs-toggle=\"modal\" data-bs-target=\"#editInventory\"
        if(member.status === 'approved') actions.innerHTML = `
        <button id=\"${member.username}-${member.password}-edit\" class=\"btn btn-light btn-sm\"><ion-icon name="create"></ion-icon> Edit</button>
        <button id=\"${member.username}-${member.password}-deny\" class=\"btn btn-danger btn-sm\"><ion-icon name="close-sharp"></ion-icon> Deny</button>
        <button id=\"${member.username}-${member.password}-del\"  class=\"btn btn-secondary btn-sm\"><ion-icon name="trash"></ion-icon> Delete</button>
        `
        else  actions.innerHTML = `
        <button id=\"${member.username}-${member.password}-edit\" class=\"btn btn-light btn-sm\"><ion-icon name="create"></ion-icon> Edit</button>
        <button id=\"${member.username}-${member.password}-appr\" class=\"btn btn-success btn-sm\"><ion-icon name="checkmark-circle"></ion-icon> Approve</button>
        <button id=\"${member.username}-${member.password}-del\" class=\"btn btn-secondary btn-sm\"><ion-icon name="trash"></ion-icon> Delete</button>
        `;
        tr.appendChild(actions);

        table.appendChild(tr);
    });

    $('button[id$="-edit"],button[id$="-editinv"]').on('touchstart click', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            toastbox("toast-coming", 3000);
        }, 10);
    })

    // //* Edit button handler
    // $('button[id$="-edit"]').on('touchstart click', function(e) {
        
    //     e.preventDefault();
    //     e.stopImmediatePropagation();
    //     setTimeout(() => {
    //         const username = $(this).attr("id").split("-")[0];
    //         const password = $(this).attr("id").split("-")[1];
            
    //         const user = cache.find(member => member.username === username && member.password === password);
    //         const userIndex = cache.findIndex(member => member.username === username && member.password === password);
    //     if(user) {
        

           
        
    //         Swal.fire({
    //             title: `Edit ${username}'s Information`,
    //             html: `
    //                 <div style="display: flex; flex-direction: column;">
    //                     <label style="text-align:left" for="name">Name</label>
    //                     <input id="name" class="swal2-input" value="${user.username}" placeholder="Enter a new name">
    //                     <label style="text-align:left" for="pass">Password:</label>
    //                     <input id="pass" class="swal2-input" value="${user.password}" placeholder="Enter a new password">
    //                     <label style="text-align:left" for="role">Role</label>
    //                     <input id="role" class="swal2-input" value="${user.role}" placeholder="Enter a new role">
    //                 </div>
    //             `,
    //             focusConfirm: false,
    //             didOpen: () => {
    //                 const popup = Swal.getPopup();
    //                 usernameInput = popup.querySelector('#name');
    //                 passwordInput = popup.querySelector('#pass');
    //                 roleInput = popup.querySelector('#role')
    //             },
    //             preConfirm: () => {
    //                 const name = usernameInput.value;
    //                 const pass = passwordInput.value;
    //                 const role = roleInput.value;
        
    //                 if (!name || !pass || !role) {
    //                     Swal.showValidationMessage(`Please enter all fields`);
    //                 }
    //                 return { name: name, pass: pass, role: role };
    //             },
    //             showCancelButton: true,
    //             confirmButtonText: 'Save',
    //             cancelButtonText: 'Cancel',
    //         }).then((result) => {
    //             if (result.isConfirmed) {
                 
    //                 Swal.fire('Saved!', 'Information has been saved.', 'success');
        
    //                 cache[userIndex].username = result.value.name;
    //                 cache[userIndex].password = result.value.pass;
    //                 cache[userIndex].role = result.value.role;
        
                    
    //                 addList(cache, true);
    //             }
    //         });
    //     }
    //     }, 10);
       
        
    // });
    // //* Edit inv button handler (needs more time)
    // $('button[id$="-editinv"]').on('touchstart click', function(e) {
        
    //     e.preventDefault();
    //     e.stopImmediatePropagation();
    //     setTimeout(() => {
    //         const username = $(this).attr("id").split("-")[0];
    //         const password = $(this).attr("id").split("-")[1];
            
    //         const user = cache.find(member => member.username === username && member.password === password);
    //         const userIndex = cache.findIndex(member => member.username === username && member.password === password);
    //     if(user) {
        
    //         $("#invEditorUsername").html(`Editing ${username} inventory.`);
           
        
    //         a.then((result) => {
    //             if (result.isConfirmed) {
                 
    //                 Swal.fire('Saved!', 'Inventory has been saved.', 'success');
    //                 const parsedInfo = inventoryParse(result.value.inv);
    //                 cache[userIndex].inventory = parsedInfo;
    //                 addList(cache, true);
    //             }
    //         });
    //     }
    //     }, 10);
       
        
    // });
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

    updatePagination(page);

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

function generateSingleTableRow(member) {
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
    inventoryEditor.innerHTML = `<button id=\"${member.username}-${member.password}-editinv\" class=\"btn btn-success btn-sm\"><ion-icon name="create"></ion-icon> Edit</button>`;

    tr.appendChild(inventoryEditor);

    const actions = document.createElement('td');
    //data-bs-toggle=\"modal\" data-bs-target=\"#editInventory\"
    if(member.status === 'approved') actions.innerHTML = `
    <button id=\"${member.username}-${member.password}-edit\" class=\"btn btn-light btn-sm\"><ion-icon name="create"></ion-icon> Edit</button>
    <button id=\"${member.username}-${member.password}-deny\" class=\"btn btn-danger btn-sm\"><ion-icon name="close-sharp"></ion-icon> Deny</button>
    <button id=\"${member.username}-${member.password}-del\"  class=\"btn btn-secondary btn-sm\"><ion-icon name="trash"></ion-icon> Delete</button>
    `
    else  actions.innerHTML = `
    <button id=\"${member.username}-${member.password}-edit\" class=\"btn btn-light btn-sm\"><ion-icon name="create"></ion-icon> Edit</button>
    <button id=\"${member.username}-${member.password}-appr\" class=\"btn btn-success btn-sm\"><ion-icon name="checkmark-circle"></ion-icon> Approve</button>
    <button id=\"${member.username}-${member.password}-del\" class=\"btn btn-secondary btn-sm\"><ion-icon name="trash"></ion-icon> Delete</button>
    `;
    tr.appendChild(actions);

    document.getElementById("usersList").appendChild(tr);


}






