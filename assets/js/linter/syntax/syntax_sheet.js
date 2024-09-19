const commandTypes = Object.freeze({
    SUBCOMMAND: 0,
    COMMAND_HAS_OPTION: 1,
    COMMAND_MULTI_OPTIONS: 2,
    COMMAND_FREE: 3,
    NO_OPTION: 4,
    NO_CHECK: 5,
  });
  const {
    SUBCOMMAND,
    NO_OPTION,
    NO_CHECK,
    COMMAND_FREE,
    COMMAND_HAS_OPTION,
    COMMAND_MULTI_OPTIONS,
  } = commandTypes;
  const optionTypes = Object.freeze({
    NUMBER_ANY: 0,
    NUMBER_RANGE: 1,
    NUMBER_SEPERATED: 2,
    NUM_CHANGABLE: 3,
    LIST: 4,
    STR: 5,
    BOOL: 6,
    CUSTOM: 7,
    INVENTORY: 9,
    CAM: 10,
  });
  const {
    NUMBER_ANY,
    NUMBER_SEPERATED,
    NUMBER_RANGE,
    NUM_CHANGABLE,
    LIST,
    STR,
    BOOL,
    CUSTOM,
    CONDITION,
    INVENTORY,
    CAM,
  } = optionTypes;
  export const AVAILABLE_OPTIONS = {
    mode: {
      canBeEmpty: false,
      commandType: COMMAND_HAS_OPTION,
      type: LIST,
      list: ["enter", "exit", "onclick", "loop", "stay"],
    },
    //#region subcommand
    player: {
      canBeEmpty: false,
      commandType: SUBCOMMAND,
      single: ["trap", "respawn", "nophone", "race"],
      subcommands: {
        trap: {},
        nophone: {},
        respawn: {},
        damage: {
          maxOptions: 2,
          type: NUMBER_RANGE,
          max: 100,
          min: 1,
        },
        heal: {
          maxOptions: 2,
          type: NUMBER_RANGE,
          max: 100,
          min: 1,
        },
        invincible: {
          maxOptions: 2,
          type: BOOL,
        },
        respawntimer: {
          maxOptions: 2,
          type: NUMBER_ANY,
        },
        cammode: {
          maxOptions: 2,
          type: LIST,
          list: ["0~3"],
        },
        race: {
          maxOptions: 2,
          type: LIST,
          list: ["foot"],
        },
        emote: { // SHOULD CHANGED TO LIST
            maxOptions: 2,
            type: LIST,
            list: ["ArmCross","Em_Agreeing","Em_AngryPoint","Em_Arguing1","Em_Arguing2","Em_Dance0","Em_Dance1","Em_Dance2","Em_Dance3","Em_Dance4","Em_Dance5","Em_Dance6","Em_Drinking","Em_GrabFromFloor","Em_Guitar","Em_Idle","Em_IdleToPushup","Em_IdleToSitups","Em_Injured","Em_KneelingDown","Em_KneelingDownThinking","Em_Leaning","Em_LeaningLegUp","Em_LeaningShoulder","Em_LeaningShoulderL","Em_Pain","Em_Rapping","Em_Run_Fast","Em_Run_Slow","Em_Salute","Em_SitKnee","Em_SitLay","Em_SitLay2","Em_SitThinking","Em_Thumbs","Em_Walk","Em_Whoop0","Em_Whoop1","Em_Whoop2","Em_WorkingOnDevice","HandCuffed","MidFinger","Surrender","UmbrellaOpen"]
        },
        team: {
          maxOptions: 2,
          type: STR,
        },
        role: {
          maxOptions: 2,
          type: STR,
        },
        mask: {
          maxOptions: 2,
          type: LIST,
          list: ["0~14"],
        },
      },
    },
    vehicle: {
      canBeEmpty: false,
      commandType: SUBCOMMAND,
      single: ["repair"],
      subcommands: {
        repair: {},
        paint: {
          maxOptions: 2,
          type: NUMBER_SEPERATED,
          length: 3,
        },
        damage: {
          maxOptions: 2,
          type: NUM_CHANGABLE,
          max: 1000,
          min: 0,
        },
        fuel: {
          maxOptions: 2,
          type: NUM_CHANGABLE,
          max: 1000,
          min: 0,
        },
        alwaysdrift: {
          maxOptions: 2,
          type: BOOL,
        },
        arcadedriving: {
          maxOptions: 2,
          type: BOOL,
        },
        downforce: {
          maxOptions: 2,
          type: NUMBER_RANGE,
          max: 100,
          min: 0,
        },
        headlights: {
          maxOptions: 2,
          type: LIST,
          list: ["on", "off"],
        },
        lock: {
          maxOptions: 2,
          type: BOOL,
        },
        alarm: {
          maxOptions: 2,
          type: NUMBER_ANY,
        },
      },
    },
    weapon: {
      canBeEmpty: false,
      commandType: SUBCOMMAND,
      single: ["1", "2", "3", "4", "5", "6", "refill", "empty"],
      subcommands: {
        1: {},
        2: {},
        3: {},
        4: {},
        4: {},
        5: {},
        6: {},
        refill: {
          maxOptions: 2,
          type: LIST,
          list: ["1", "2", "3", "4", "5", "6"],
        },
        empty: {
          maxOptions: 2,
          type: LIST,
          list: ["1", "2", "3", "4", "5", "6"],
        },
      },
    },
    effect: {
      canBeEmpty: false,
      commandType: SUBCOMMAND,
      single: ["flash", "steam", "steam_small", "drunk"],
      subcommands: {
        flash: {},
        steam: {},
        steam_small: {},
        reverbzone: {
          maxOptions: 3,
          type: CUSTOM,
          atLeast: 2,
          custom: [
            { type: NUMBER_ANY },
            {
              type: LIST,
              list: [
                "generic",
                "padded cell",
                "room",
                "bathroom",
                "livingroom",
                "stoneroom",
                "auditorium",
                "concerthall",
                "cave",
                "arena",
                "hangar",
                "carpetted hallway",
                "hallway",
                "stone corridor",
                "alley",
                "forest",
                "city",
                "mountains",
                "quarry",
                "plain",
                "parkinglot",
                "sewerpipe",
                "underwater",
                "drugged",
                "dizzy",
                "psychotic",
              ],
            },
          ],
        },
        camerashake: {
          maxOptions: 2,
          type: NUMBER_RANGE,
          max: 1,
          min: 0,
        },
        slowmo: {
          maxOptions: 2,
          type: NUMBER_ANY,
        },
        lookat: {
          maxOptions: 3,
          type: CUSTOM,
          atLeast: 2,
          custom: [{ type: NUMBER_SEPERATED, length: 3 }, { type: NUMBER_ANY }],
        },
        fog: {
          maxOptions: 2,
          type: NUMBER_RANGE,
          max: 100,
          min: 0,
        },
        skycolor: {
          maxOptions: 2,
          type: NUMBER_SEPERATED,
          length: 3,
        },
        drunk: {
          maxOptions: 2,
          type: "num_any",
        },
      },
    },
    draw: {
      canBeEmpty: false,
      commandType: SUBCOMMAND,
      single: [
        "dollar",
        "halo",
        "halo1",
        "halo2",
        "halo3",
        "house",
        "house1",
        "house2",
        "house3",
        "key",
        "car",
        "car1",
        "car2",
        "car3",
        "magic_smoke",
        "magic_smoke1",
        "magic_smoke2",
        "magic_smoke3",
        "wrench",
        "wrench1",
        "wrench2",
        "wrench3",
        "jerrycan",
        "health",
        "weapon1",
        "weapon2",
        "weapon3",
        "weapon4",
        "weapon5",
        "weapon6",
      ],
      subcommands: {
        dollar: {
          maxOptions: 2,
          type: NUMBER_ANY,
        },
        halo: {
          maxOptions: 2,
          type: NUMBER_ANY,
        },
        halo1: {
          maxOptions: 2,
          type: NUMBER_ANY,
        },
        halo2: {
          maxOptions: 2,
          type: NUMBER_ANY,
        },
        halo3: {
          maxOptions: 2,
          type: NUMBER_ANY,
        },
        house: {
          maxOptions: 2,
          type: NUMBER_ANY,
        },
        house1: {
          maxOptions: 2,
          type: NUMBER_ANY,
        },
        house2: {
          maxOptions: 2,
          type: NUMBER_ANY,
        },
        house3: {
          maxOptions: 2,
          type: NUMBER_ANY,
        },
        key: {
          maxOptions: 2,
          type: NUMBER_ANY,
        },
        car: {
          maxOptions: 2,
          type: NUMBER_ANY,
        },
        car1: {
          maxOptions: 2,
          type: NUMBER_ANY,
        },
        car2: {
          maxOptions: 2,
          type: NUMBER_ANY,
        },
        car3: {
          maxOptions: 2,
          type: NUMBER_ANY,
        },
        magic_smoke: {
          maxOptions: 2,
          type: NUMBER_ANY,
        },
        magic_smoke1: {
          maxOptions: 2,
          type: NUMBER_ANY,
        },
        magic_smoke2: {
          maxOptions: 2,
          type: NUMBER_ANY,
        },
        magic_smoke3: {
          maxOptions: 2,
          type: NUMBER_ANY,
        },
        wrench: {
          maxOptions: 2,
          type: NUMBER_ANY,
        },
        wrench1: {
          maxOptions: 2,
          type: NUMBER_ANY,
        },
        wrench2: {
          maxOptions: 2,
          type: NUMBER_ANY,
        },
        wrench3: {
          maxOptions: 2,
          type: NUMBER_ANY,
        },
        jerrycan: {
          maxOptions: 2,
          type: NUMBER_ANY,
        },
        health: {
          maxOptions: 2,
          type: NUMBER_ANY,
        },
        weapon1: {
          maxOptions: 2,
          type: NUMBER_ANY,
        },
        weapon2: {
          maxOptions: 2,
          type: NUMBER_ANY,
        },
        weapon3: {
          maxOptions: 2,
          type: NUMBER_ANY,
        },
        weapon4: {
          maxOptions: 2,
          type: NUMBER_ANY,
        },
        weapon5: {
          maxOptions: 2,
          type: NUMBER_ANY,
        },
        weapon6: {
          maxOptions: 2,
          type: NUMBER_ANY,
        },
      },
    },
    //#endregion
    //#region no_option
    npckill: {
      commandType: NO_OPTION,
    },
    //#endregion
    //#region command_free
    despawn: {
      canBeEmpty: false,
      commandType: COMMAND_FREE,
    },
    tip: {
      canBeEmpty: false,
      commandType: COMMAND_FREE,
    },
    header: {
      canBeEmpty: false,
      commandType: COMMAND_FREE,
    },
    outro: {
      canBeEmpty: false,
      commandType: COMMAND_FREE,
    },
    chat: {
      canBeEmpty: false,
      commandType: COMMAND_FREE,
    },
    //#endregion
    //#region command_has
    npcanimation: {
      canBeEmpty: false,
      commandType: COMMAND_HAS_OPTION,
      type: LIST,
      list: ["ArmCross","Em_Agreeing","Em_AngryPoint","Em_Arguing1","Em_Arguing2","Em_Dance0","Em_Dance1","Em_Dance2","Em_Dance3","Em_Dance4","Em_Dance5","Em_Dance6","Em_Drinking","Em_GrabFromFloor","Em_Guitar","Em_Idle","Em_IdleToPushup","Em_IdleToSitups","Em_Injured","Em_KneelingDown","Em_KneelingDownThinking","Em_Leaning","Em_LeaningLegUp","Em_LeaningShoulder","Em_LeaningShoulderL","Em_Pain","Em_Rapping","Em_Run_Fast","Em_Run_Slow","Em_Salute","Em_SitKnee","Em_SitLay","Em_SitLay2","Em_SitThinking","Em_Thumbs","Em_Walk","Em_Whoop0","Em_Whoop1","Em_Whoop2","Em_WorkingOnDevice","HandCuffed","MidFinger","Surrender","UmbrellaOpen"]
    },
    npcposition: {
      canBeEmpty: false,
      commandType: COMMAND_HAS_OPTION,
      type: NUMBER_SEPERATED,
      length: 3,
    },
    npcrotation: {
      canBeEmpty: false,
      commandType: COMMAND_HAS_OPTION,
      type: NUMBER_SEPERATED,
      length: 3,
    },
    interactionmenu: {
      canBeEmpty: false,
      commandType: COMMAND_HAS_OPTION,
      type: LIST,
      list: [
        "allow",
        "block",
        "mainmenu",
        "actions",
        "inventory",
        "accessories",
        "personalvehicle",
        "requestvehicle",
        "vehiclestatus",
        "serveroptions",
        "roleselect",
      ],
    },
    setspawn: {
      canBeEmpty: false,
      commandType: COMMAND_HAS_OPTION,
      type: NUMBER_SEPERATED,
      length: 3,
    },
    radius: {
      canBeEmpty: false,
      commandType: COMMAND_HAS_OPTION,
      type: NUMBER_ANY,
    },
    spread: {
      canBeEmpty: false,
      commandType: COMMAND_HAS_OPTION,
      type: NUMBER_ANY,
    },
    radius: {
      canBeEmpty: false,
      commandType: COMMAND_HAS_OPTION,
      type: NUMBER_ANY,
    },
    spread: {
      canBeEmpty: false,
      commandType: COMMAND_HAS_OPTION,
      type: NUMBER_ANY,
    },
    gravity: {
      canBeEmpty: false,
      commandType: COMMAND_HAS_OPTION,
      type: NUMBER_SEPERATED,
      length: 3,
    },
    time: {
      canBeEmpty: false,
      commandType: COMMAND_HAS_OPTION,
      type: LIST,
      list: ["0~360", "day", "night"],
    },
    weather: {
      canBeEmpty: false,
      commandType: COMMAND_HAS_OPTION,
      type: LIST,
      list: ["rain", "clear"],
    },
    executeplayer: {
      canBeEmpty: true,
      commandType: COMMAND_HAS_OPTION,
      type: STR,
    },
    explode: {
      canBeEmpty: true,
      commandType: COMMAND_HAS_OPTION,
      type: NUMBER_SEPERATED,
      length: 3,
    },
    cooldown: {
      canBeEmpty: false,
      commandType: COMMAND_HAS_OPTION,
      type: NUMBER_ANY,
    },
    deactivate: {
      canBeEmpty: false,
      commandType: COMMAND_HAS_OPTION,
      type: NUMBER_ANY,
    },
    //#region command_multi
    sound: {
      canBeEmpty: false,
      commandType: COMMAND_MULTI_OPTIONS,
      type: CUSTOM,
      atLeast: 3,
      custom: [
        { type: STR },
        { type: NUMBER_ANY },
        { type: NUMBER_ANY },
        { type: BOOL },
      ],
    },
    transform: {
      canBeEmpty: false,
      commandType: COMMAND_MULTI_OPTIONS,
      type: CUSTOM,
      atLeast: 3,
      custom: [
        { type: NUMBER_SEPERATED, length: 3 },
        { type: NUMBER_SEPERATED, length: 3 },
        { type: NUMBER_ANY },
        { type: BOOL },
      ],
    },
    rotate: {
      canBeEmpty: false,
      commandType: COMMAND_MULTI_OPTIONS,
      type: CUSTOM,
      atLeast: 3,
      custom: [
        { type: NUMBER_SEPERATED, length: 3 },
        { type: NUMBER_SEPERATED, length: 3 },
        { type: NUMBER_ANY },
        { type: BOOL },
        { type: NUMBER_ANY },
      ],
    },
    lookat: {
      canBeEmpty: false,
      commandType: COMMAND_MULTI_OPTIONS,
      type: CUSTOM,
      atLeast: 3,
      custom: [
        { type: NUMBER_SEPERATED, length: 3 },
        { type: NUMBER_SEPERATED, length: 3 },
        { type: NUMBER_ANY },
        { type: NUMBER_SEPERATED, length: 3 },
        { type: NUMBER_SEPERATED, length: 3 },
        { type: BOOL },
      ],
    },
    spawn: {
      canBeEmpty: false,
      commandType: COMMAND_MULTI_OPTIONS,
      type: CUSTOM,
      atLeast: 3,
      custom: [
        { type: STR },
        { type: NUMBER_SEPERATED, length: 3 },
        { type: NUMBER_SEPERATED, length: 3 },
      ],
    },
    scale: {
      canBeEmpty: false,
      commandType: COMMAND_MULTI_OPTIONS,
      type: CUSTOM,
      atLeast: 3,
      custom: [
        { type: NUMBER_SEPERATED, length: 3 },
        { type: NUMBER_SEPERATED, length: 3 },
        { type: NUMBER_ANY },
        { type: BOOL },
      ],
    },
    calltriggerbox: {
      canBeEmpty: false,
      commandType: COMMAND_MULTI_OPTIONS,
      type: CUSTOM,
      atLeast: 1,
      custom: [{ type: NUMBER_SEPERATED, length: 3 }, { type: NUMBER_ANY }],
    },
    inventory: {
      canBeEmpty: false,
      commandType: COMMAND_MULTI_OPTIONS,
      type: CUSTOM,
      atLeast: 3,
      custom: [
        { type: LIST, list: ["add", "del"] },
        { type: STR },
        { type: INVENTORY },
      ],
    },
    webrequest: {
      canBeEmpty: false,
      commandType: NO_CHECK,
      msg: `This command cannot be checked with this site (due to different behavior when dealing with POST and GET)`,
    },
  };
  