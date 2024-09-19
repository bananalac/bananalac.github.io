const optionTypes = Object.freeze({
    NUM_CHECK: 0,
    LIST_CHECK: 1,
    RANGE_CHECK: 2,
    BOOL_CHECK: 3,
    INV: 4,
    ANY: 5,
})
const { NUM_CHECK, LIST_CHECK, RANGE_CHECK, BOOL_CHECK, INV, ANY } = optionTypes;
export const CONDITIONS = {
   time: {
    accepted: [">", "<", "=", "!="],
    type: RANGE_CHECK,
    min: 0,
    max: 360,
    add: ["day", "night"]
   },
   weather: {
    accepted: ["=", "!="],
    type: LIST_CHECK,
    list: ["rain", "clear"]
   },
   radius: {
    accepted: [">", "<", "=", "!="],
    type: RANGE_CHECK,
    min: 0,
    max: 999
   },
   chat: {
    accepted: ["="],
    type: ANY
   },
   playerheight: {
    accepted: [">", "<", "=", "!="],
    type: RANGE_CHECK,
    min: 0,
    max: 999
   },
   playerrotation: {
    accepted: [">", "<", "=", "!="],
    type: RANGE_CHECK,
    min: 0,
    max: 360
   },
   team: {
    accepted: ["=", "!="],
    type: ANY
   },
   mask: {
    accepted: ["=", "!="],
    type: RANGE_CHECK,
    min: 0,
    max: 14
   },
   isinvehicle: {
    accepted: ["=", "!="],
    type: BOOL_CHECK
   },
   ishonking: {
    accepted: ["=", "!="],
    type: BOOL_CHECK
   },
   isfemale: {
    accepted: ["=", "!="],
    type: BOOL_CHECK
   },
   islocal: {
    accepted: ["=", "!="],
    type: BOOL_CHECK
   },
   ishost: {
    accepted: ["=", "!="],
    type: BOOL_CHECK
   },
   isstting: {
    accepted: ["=", "!="],
    type: BOOL_CHECK
   },
   iscrouching: {
    accepted: ["=", "!="],
    type: BOOL_CHECK
   },
   isdrunk: {
    accepted: ["=", "!="],
    type: BOOL_CHECK
   },
   isholdingphone: {
    accepted: ["=", "!="],
    type: BOOL_CHECK
   },
   isragdoll: {
    accepted: ["=", "!="],
    type: BOOL_CHECK
   },
   ispointing: {
    accepted: ["=", "!="],
    type: BOOL_CHECK
   },
   isaiming: {
    accepted: ["=", "!="],
    type: BOOL_CHECK
   },
   isintaxi: {
    accepted: ["=", "!="],
    type: BOOL_CHECK
   },
   hassiren: {
    accepted: ["=", "!="],
    type: BOOL_CHECK
   },
   isdriver: {
    accepted: ["=", "!="],
    type: BOOL_CHECK
   },
   isshooting: {
    accepted: ["=", "!="],
    type: BOOL_CHECK
   },
   isreloading: {
    accepted: ["=", "!="],
    type: BOOL_CHECK
   },
   isvehicleowner: {
    accepted: ["=", "!="],
    type: BOOL_CHECK
   },
   hasheistbag: {
    accepted: ["=", "!="],
    type: BOOL_CHECK
   },
   emote: {
    accepted: ["=", "!="],
    type: ANY
   },
   role: {
    accepted: ["=", "!="],
    type: ANY
   },
   objectname: {
    accepted: ["=", "!="],
    type: ANY
   },
   cargoname: {
    accepted: ["=", "!="],
    type: ANY
   },
   interactionmenuclick: {
    accepted: ["=", "!="],
    type: ANY
   },
   playername: {
    accepted: ["=", "!="],
    type: ANY
   },
   dial: {
    accepted: [">", "<", "=", "!="],
    type: NUM_CHECK
   },
   kills: {
    accepted: [">", "<", "=", "!="],
    type: NUM_CHECK
   },
   speed: {
    accepted: [">", "<", "=", "!="],
    type: NUM_CHECK
   },
   playercount: {
    accepted: [">", "<", "=", "!="],
    type: NUM_CHECK
   },
   vehiclecount: {
    accepted: [">", "<", "=", "!="],
    type: NUM_CHECK
   },
   solidercount: {
    accepted: [">", "<", "=", "!="],
    type: NUM_CHECK
   },
   zombiecount: {
    accepted: [">", "<", "=", "!="],
    type: NUM_CHECK
   },
   magcount: {
    accepted: [">", "<", "=", "!="],
    type: NUM_CHECK
   },
   ammocount: {
    accepted: [">", "<", "=", "!="],
    type: NUM_CHECK
   },
   framerate: {
    accepted: [">", "<", "=", "!="],
    type: NUM_CHECK
   },
   ping: {
    accepted: [">", "<", "=", "!="],
    type: NUM_CHECK
   },
   flytimer: {
    accepted: [">", "<", "=", "!="],
    type: NUM_CHECK
   },
   weapon: {
    accepted: [">", "<", "=", "!="],
    type: RANGE_CHECK,
    min: 0,
    max: 6
   },
   health: {
    accepted: [">", "<", "=", "!="],
    type: RANGE_CHECK,
    min: 0,
    max: 100
   },
   cammode: {
    accepted: [">", "<", "=", "!="],
    type: RANGE_CHECK,
    min: 0,
    max: 3
   },
   phonemenu: {
    accepted: ["=", "!="],
    type: LIST_CHECK,
    list: ["home","dial","call","contacts","settings"]
   }
   
}