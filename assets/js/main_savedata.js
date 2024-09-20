import { parse, write, inventoryWrite, inventoryParse } from './user-parser/index.js';

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
}



window.addEventListener("DOMContentLoaded", function() {

    $("#approveAll").prop("disabled", true);
    $("#denyAll").prop("disabled", true);
    $("#deleteAll").prop("disabled", true);
    $("#downloadButton").prop("disabled", true);

})



const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });

document.getElementById("fileUpload").addEventListener("change", function(event) {
    const file = event.target.files[0];
    
    if(!file) {
        $("#labelForUpload").text("No file Selected!");
    } else {
        $("#labelForUpload").text(`${file.name} (${Math.round(file.size / 1024)} KB)`);
    }

})


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
]


function addList(arr, newTime = false) {

    document.getElementById("usersList").innerHTML = "";

    if(newTime === true) {
        $("#userManagement").html(`User Management <span class="blinking-text">(Download edited file!)</span>`);
        $("#titleCheck").html(`Edited save-data.txt with ${cache.length} saved users.`);   
    }

    arr.forEach((member) => {

        const tr = document.createElement('tr');
        tr.id = `${member.user}-${member.password}`;

        const status = document.createElement('td');
        const converterItem = { 
            approved: `<i style=\"color:green;\" class=\"fas fa-check-square approvedMember\"></i> Approved`, 
            pending: `<i style=\"color:yellow;\" class=\"fas fa-spinner pendingMember\"></i> Pending` 
        };
        
        status.innerHTML = converterItem[member.status];
        tr.appendChild(status);

        const username = document.createElement('td');
        username.innerHTML = member.username;
        tr.appendChild(username);

        const password = document.createElement('td');
        password.innerHTML = `<span id=\"spoiler-${member.username}-${member.password}\">${member.password}</span>`;
        tr.appendChild(password);


        const role = document.createElement('td');
        const findDef = roles.find(o => o.name === extractBetweenTags(member.role) );
        if(findDef) {
            role.innerHTML = `<span class=\"no-select\" style=\"color:${findDef.color}\">${findDef.icon} ${extractBetweenTags(member.role)}</span>`;
        } else role.innerHTML = extractBetweenTags(member.role);
        tr.appendChild(role);

        const inventoryEditor = document.createElement('td');
        inventoryEditor.innerHTML = `<button id=\"${member.username}-${member.password}-editinv\" class=\"inv-button\"><i class="fas fa-edit"></i></button>`;

        tr.appendChild(inventoryEditor);

        const actions = document.createElement('td');

        if(member.status === 'approved') actions.innerHTML = `
        <button id=\"${member.username}-${member.password}-edit\" class=\"edit-button\"><i class="fas fa-edit"></i></button>
        <button id=\"${member.username}-${member.password}-deny\" class=\"deny-button\"><i class="fas fa-times"></i></button>
        <button id=\"${member.username}-${member.password}-del\" class=\"delete-button\"><i class="fas fa-trash"></i></button>
        `
        else  actions.innerHTML = `
        <button id=\"${member.username}-${member.password}-edit\" class=\"edit-button\"><i class="fas fa-edit"></i></button>
        <button id=\"${member.username}-${member.password}-appr\" class=\"approve-button\"><i class="fas fa-check"></i></button>
        <button id=\"${member.username}-${member.password}-del\" class=\"delete-button\"><i class="fas fa-trash"></i></button>
        `;
        tr.appendChild(actions);

        document.getElementById("usersList").appendChild(tr);

    });

    //revealAllPass
    $("#revealPasswords").on("click", function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(() => {
            $('[id^="spoiler-"]').each(function(e) {
                $(this).click();    
            });
        }, 10);
    });
    //? Password spoiler toggle
    $('[id^="spoiler-"]').each(function() {
        
        $(this).on("click touchstart", function(e) {
            
            e.preventDefault();
            e.stopImmediatePropagation();
            setTimeout(() => {
                if($(this).css("color") === 'rgba(0, 0, 0, 0)') {
                    $(this).css("color", "white");
                    $(this).css("background-color", 'rgba(0, 0, 0, 0)')
                } else {
                    $(this).css("color", "transparent");
                    $(this).css("background-color", 'black');
                }
            }, 10);
           
            
        });
    
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
        
            let usernameInput;
            let passwordInput;
            let roleInput;
        
            Swal.fire({
                title: `Edit ${username}'s Information`,
                html: `
                    <div style="display: flex; flex-direction: column;">
                        <label style="text-align:left" for="name">Name</label>
                        <input id="name" class="swal2-input" value="${user.username}" placeholder="Enter a new name">
                        <label style="text-align:left" for="pass">Password:</label>
                        <input id="pass" class="swal2-input" value="${user.password}" placeholder="Enter a new password">
                        <label style="text-align:left" for="role">Role</label>
                        <input id="role" class="swal2-input" value="${user.role}" placeholder="Enter a new role">
                    </div>
                `,
                focusConfirm: false,
                didOpen: () => {
                    const popup = Swal.getPopup();
                    usernameInput = popup.querySelector('#name');
                    passwordInput = popup.querySelector('#pass');
                    roleInput = popup.querySelector('#role')
                },
                preConfirm: () => {
                    const name = usernameInput.value;
                    const pass = passwordInput.value;
                    const role = roleInput.value;
        
                    if (!name || !pass || !role) {
                        Swal.showValidationMessage(`Please enter all fields`);
                    }
                    return { name: name, pass: pass, role: role };
                },
                showCancelButton: true,
                confirmButtonText: 'Save',
                cancelButtonText: 'Cancel',
            }).then((result) => {
                if (result.isConfirmed) {
                 
                    Swal.fire('Saved!', 'Information has been saved.', 'success');
        
                    cache[userIndex].username = result.value.name;
                    cache[userIndex].password = result.value.pass;
                    cache[userIndex].role = result.value.role;
        
                    
                    addList(cache, true);
                }
            });
        }
        }, 10);
       
        
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
        
            let invInput;
        
            Swal.fire({
                title: `Edit ${username}'s Inventory`,
                html: `
                    <div style="display: flex; flex-direction: column;">
                        <label style="text-align:left" for="inv">Name</label>
                        <input id="inv" class="swal2-input" value="${user.inventoryString}" placeholder="Enter new items">
            
                    </div>
                `,
                focusConfirm: false,
                didOpen: () => {
                    const popup = Swal.getPopup();
                    invInput = popup.querySelector('#inv');
                   
                },
                preConfirm: () => {
                    const inv = invInput.value;
        
        
                    if (!inv) {
                        Swal.showValidationMessage(`Please enter inventory`);
                    }
                    return { inv: inv };
                },
                showCancelButton: true,
                confirmButtonText: 'Save',
                cancelButtonText: 'Cancel',
            }).then((result) => {
                if (result.isConfirmed) {
                 
                    Swal.fire('Saved!', 'Inventory has been saved.', 'success');
                    const parsedInfo = inventoryParse(result.value.inv);
                    cache[userIndex].inventory = parsedInfo;
                    addList(cache, true);
                }
            });
        }
        }, 10);
       
        
    });
    //! Delete button handler
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
                addList(cache, true);
            }
        }, 10);
        
        
    });
    //! Deny button handler
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
               addList(cache, true);
            }
        }, 10);
        
        
    });
    //* Approve button handler
    $('button[id$="-appr"]').on('touchstart click', function(e) {
        
        e.preventDefault();
        e.stopImmediatePropagation();
        const username = $(this).attr("id").split("-")[0];
        const password = $(this).attr("id").split("-")[1];
        
        const user = cache.find(member => member.username === username && member.password === password);
        const userIndex = cache.findIndex(member => member.username === username && member.password === password);
   
        if(user) {
           cache[userIndex].status = 'approved';
           addList(cache, true);
        }
        
    });
}

$("#uploadButton").on("touchstart click", function(e) {
    
    e.preventDefault();
    e.stopImmediatePropagation();

    setTimeout(() => {

        const fileInput = document.getElementById("fileUpload");

    if(fileInput.files.length === 0) { 
        Toast.fire({
            icon: "error",
            title: "Upload save-data.txt!"
        });
        return;
    }

    const file = fileInput.files[0];

    if(file.type !== 'text/plain') {
        Toast.fire({
            icon: "error",
            title: "Wrong format!"
        });
        return;
    }

   
    const reader = new FileReader();

    reader.onload = function(event) {
    
        
        const content = event.target.result;
        const parsedContent = parse(content);
        if(parsedContent.error) {
            Toast.fire({
                icon: "error",
                title: "This is not a save-data file!"
            });
            return;
        }  
        if(parsedContent.members.length === 0) {
            Toast.fire({
                icon: "error",
                title: "Empty Save-data!"
            });
            return;
        }  
        cache = parsedContent.members;

       
        $("#approveAll").prop("disabled", false);
        $("#denyAll").prop("disabled", false);
        $("#deleteAll").prop("disabled", false);
        $("#downloadButton").prop("disabled", false);
        
        $("#uploadButton").css("display", "none");
        $("#labelForUpload").css("display", "none");
        $("#newOne").css("display", "block");
        $("#fileUpload").css("display", "none");
        $("#titleCheck").html(`Current save-data.txt with ${parsedContent.members.length} saved users.`);

      
        addList(parsedContent.members)
       
        
    };

    reader.readAsText(file, 'utf-8');
        
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

$("#approveAll").on("touchstart click", function(e) {
    
    e.preventDefault();
    e.stopImmediatePropagation();
    setTimeout(() => {
        cache.forEach((mem, memIndex) => {
            cache[memIndex].status = 'approved';
        });
        addList(cache, true);
    }, 10);
   
});

$("#denyAll").on("touchstart click", function(e) {
    
    e.preventDefault();
    e.stopImmediatePropagation();
    setTimeout(() => {
        cache.forEach((mem, memIndex) => {
            cache[memIndex].status = 'pending';
        });
        addList(cache, true);
    }, 10);
});

$("#deleteAll").on("touchstart click", function(e) {
    
    e.preventDefault();
    e.stopImmediatePropagation();
    setTimeout(() => {
        cache = [];
        addList(cache, true);
    }, 10);
})

$("#newOne").on("touchstart click", function(e) {
    
    e.preventDefault();
    e.stopImmediatePropagation();
    location.reload();
})

