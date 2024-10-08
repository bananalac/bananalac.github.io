/**
 * Parses Map String
 * @param {String} mapText 
 */
function parse(mapText) {

    if(!mapText.startsWith('Map Name:')) return undefined;

    let mapOptions = {
       mapName: "",
       mapType: "",
       holoSign: {
        position: "",
        text: ""
       },
       cameraPos: {
        position: "",
        rotation: ""
       },
       maxVehicleCount: "",
       fuelConsumeRate: "",
       deleteIdleVehicle: "",
       healthRegeneration: "",
       hideNames: "",
       allowRespawn: "",
       voiceChat: "",
       voteForRole: "",
       rolePlay: "",
       approveOnRegister: ""
    };

    let roles = [];
    let objects = [];
    let vehicles = [];

    const lines = mapText.split("\n");
    //! OPTIONS
    mapOptions.mapName = lines[0].split(": ")[1];
    mapOptions.mapType = lines[1].split(":")[1];
    mapOptions.holoSign.position = lines[2].split("*")[0].replace("Holo Sign:", "");
    mapOptions.holoSign.text = lines[2].split("*")[1];
    mapOptions.cameraPos.position = lines[3].split(":")[1];
    mapOptions.cameraPos.rotation = lines[3].split(":")[2];
    mapOptions.maxVehicleCount = lines[4].split(": ")[1];
    mapOptions.fuelConsumeRate = lines[5].split(": ")[1];
    mapOptions.deleteIdleVehicle = lines[6].split(": ")[1];
    mapOptions.healthRegeneration = lines[7].split(": ")[1];
    mapOptions.hideNames = lines[8].split(": ")[1];
    mapOptions.allowRespawn = lines[9].split(": ")[1];
    mapOptions.voiceChat = lines[10].split(": ")[1];
    mapOptions.voteForRole = lines[11].split(": ")[1];
    mapOptions.rolePlay = lines[12].split(": ")[1];
    mapOptions.approveOnRegister = lines[13].split(": ")[1];
    //* ROLES
    roles.push(...lines[14].replace('Roles List:', '').split(","));
    roles.pop();
    mapOptions.roles = roles;
    //OBJECTS
    lines.splice(0, 15);
    lines.forEach(line => {
       
        if(!line.startsWith('Vehicle_')) {
            let baseObj = {
                objName: '',
                position: '',
                rotation: '',
                scale: '',
                options: ''
            };
            const lineOpts = line.trim().split(":");
            baseObj.objName = lineOpts[0];
            baseObj.position = lineOpts[1];
            baseObj.rotation = lineOpts[2];
            baseObj.scale = lineOpts[3];
            baseObj.options = lineOpts[4];

            objects.push(baseObj);
        } else {
            let vehObj = {
                carName: '',
                position: '',
                rotation: '',
                scale: '',
                options: ''
            };
            const vehOpts = line.trim().split(":");
            vehObj.carName = vehOpts[0].replace('Vehicle_', '');
            vehObj.position = vehOpts[1];
            vehObj.rotation = vehOpts[2];
            vehObj.scale = vehOpts[3];
            vehObj.options = vehOpts[4];

            vehicles.push(vehObj);
        }
    });
    mapOptions.objects = objects;
    mapOptions.vehicles = vehicles;


    return mapOptions;


};

/**
 * Convert map object to text
 * @param {Object} mapObj 
 */
function write(mapObj) {

    const { vehicles, objects, roles, approveOnRegister, rolePlay, voteForRole, voiceChat, hideNames, allowRespawn, healthRegeneration, deleteIdleVehicle, fuelConsumeRate, mapName, mapType, holoSign, cameraPos, maxVehicleCount } = mapObj;

let mapBaseText = 
`Map Name: ${mapName}
Map Type:${mapType}
Holo Sign:${holoSign.position}*${holoSign.text}
Camera Pos:${cameraPos.position}:${cameraPos.rotation}
Max Vehicle Count: ${maxVehicleCount}
Fuel Consume Rate: ${fuelConsumeRate}
Delete Idle Vehicle: ${deleteIdleVehicle}
Health Regeneration: ${healthRegeneration}
Hide Names: ${hideNames}
Allow Respawn: ${allowRespawn}
Voice-Chat: ${voiceChat}
Vote For Role: ${voteForRole}
Role-play: ${rolePlay}
Approve On Register: ${approveOnRegister}
Role List:${roles.join(",")},\n`;

objects.forEach((obj) => {
    mapBaseText += `${obj.objName}:${obj.position}:${obj.rotation}:${obj.scale}:${obj.options}\n`;
});

vehicles.forEach((veh) => {
    mapBaseText += `Vehicle_${veh.carName}:${veh.position}:${veh.rotation}:${veh.scale}:${veh.options}\n`;
});


return mapBaseText;

}

/**
 * Get count of every object
 * @param {any[]} mapObjects 
 */
function objCount(mapObjects) {

    let count = {};

    mapObjects.forEach((obj) => {

       if(!count[obj.objName]) count[obj.objName] = 0;
       count[obj.objName]++;

    });

    return count;

}

/**
 * Get count of vehicles
 * @param {any[]} vehObjects 
 */
function vehCount(vehObjects) {

    let count = {};

    vehObjects.forEach((veh) => {

       if(!count[veh.carName]) count[veh.carName] = 0;
       count[veh.carName]++;

    });

    return count;

}

export { parse, write, objCount, vehCount };