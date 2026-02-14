// 地图配置数据（新手村8张地图 + 剧情相关地图）

import type { GameMap } from '@/types';

/** 地图配置列表 */
export const MAPS: Record<string, GameMap> = {
  // ==================== 第一章：东海村区域 ====================

  // 东海村（起始村庄）
  map_donghai_village: {
    id: 'map_donghai_village',
    name: '东海村',
    description: '东海边的一个宁静小渔村，是许多冒险者的起点。',
    type: 'town',
    region: 'newbie',
    levelRange: { min: 1, max: 5 },
    size: { width: 10, height: 10 },
    connections: [
      { direction: 'east', targetMapId: 'map_donghai_beach' },
      { direction: 'north', targetMapId: 'map_tidal_cave' },
    ],
    npcs: [
      {
        id: 'npc_village_chief',
        name: '村长',
        avatar: '👴',
        type: 'quest',
        position: { x: 5, y: 5 },
        dialogues: {
          default: ['年轻人，村子外面最近有些危险...', '如果有困难，尽管来找我。'],
          greeting: '你好啊，年轻人！'
        },
        questIds: ['main_1_2', 'main_1_3']
      },
      {
        id: 'npc_donghai_merchant',
        name: '渔夫',
        avatar: '🎣',
        type: 'merchant',
        position: { x: 3, y: 7 },
        dialogues: {
          default: ['今天打了好多鱼，要不要买点？', '新鲜的海鱼，便宜卖了！'],
          greeting: '要买鱼吗？'
        },
        shopId: 'shop_fish'
      },
      {
        id: 'npc_donghai_healer',
        name: '村医',
        avatar: '👨‍⚕️',
        type: 'healer',
        position: { x: 7, y: 3 },
        dialogues: {
          default: ['海边风大，小心着凉。', '受伤了就来找我。'],
          greeting: '哪里不舒服？'
        },
        healCost: 5,
        services: ['治疗', '解毒']
      },
    ],
    events: [],
    teleporters: [],
    icon: '🏘️',
  },

  // 东海沙滩
  map_donghai_beach: {
    id: 'map_donghai_beach',
    name: '东海沙滩',
    description: '东海边的沙滩，螃蟹横行。',
    type: 'field',
    region: 'newbie',
    levelRange: { min: 1, max: 3 },
    size: { width: 15, height: 10 },
    connections: [
      { direction: 'west', targetMapId: 'map_donghai_village' },
    ],
    npcs: [],
    events: [],
    teleporters: [],
    encounterConfig: {
      rate: 0.15,
      enemyGroups: ['enemy_group_crabs'],
      stepTrigger: 8,
    },
    icon: '🏖️',
  },

  // 潮水洞穴
  map_tidal_cave: {
    id: 'map_tidal_cave',
    name: '潮水洞穴',
    description: '海边的神秘洞穴，传说里面有蟹精出没。',
    type: 'dungeon',
    region: 'newbie',
    levelRange: { min: 2, max: 5 },
    size: { width: 12, height: 12 },
    connections: [
      { direction: 'south', targetMapId: 'map_donghai_village' },
    ],
    npcs: [],
    events: [
      {
        id: 'event_crab_spirit',
        type: 'battle',
        position: { x: 6, y: 6 },
        trigger: 'step',
        data: { enemyGroupId: 'enemy_group_crab_spirit' },
        oneTime: false,
      },
    ],
    teleporters: [],
    encounterConfig: {
      rate: 0.18,
      enemyGroups: ['enemy_group_crabs', 'enemy_group_crab_spirit'],
      stepTrigger: 6,
    },
    icon: '🕳️',
  },

  // 码头（通往长安）
  map_dock: {
    id: 'map_dock',
    name: '东海码头',
    description: '东海村的码头，可以乘船前往长安城。',
    type: 'town',
    region: 'newbie',
    levelRange: { min: 1, max: 10 },
    size: { width: 8, height: 8 },
    connections: [
      { direction: 'west', targetMapId: 'map_donghai_village' },
    ],
    npcs: [
      {
        id: 'npc_boatman',
        name: '船夫',
        avatar: '🚢',
        type: 'teleporter',
        position: { x: 6, y: 4 },
        dialogues: {
          default: ['要去长安城吗？只要你有船票，我就能送你去！', '长安城可是个繁华的大地方呢！'],
          greeting: '要坐船吗？'
        },
        teleportDestinations: [
          { mapId: 'map_changan', name: '长安城', cost: 0 },
        ]
      },
    ],
    events: [],
    teleporters: [],
    icon: '⚓',
  },

  // ==================== 第二章：长安城区域 ====================

  // 长安城（安全区）
  map_changan: {
    id: 'map_changan',
    name: '长安城',
    description: '大唐都城，繁华热闹，是冒险者的聚集地。',
    type: 'town',
    region: 'changan',
    levelRange: { min: 1, max: 10 },
    size: { width: 15, height: 15 },
    connections: [
      { direction: 'east', targetMapId: 'map_village_1' },
      { direction: 'south', targetMapId: 'map_chengnan_wasteland' },
    ],
    npcs: [
      {
        id: 'npc_guide',
        name: '新手引导员',
        avatar: '👨‍🏫',
        type: 'trainer',
        position: { x: 7, y: 7 },
        dialogues: {
          default: ['欢迎来到长安城，年轻人！', '外面的世界充满了机遇和危险，多加小心。', '如果有任何问题，随时来问我。'],
          greeting: '你好，需要指导吗？'
        },
        services: ['新手指导', '技能学习']
      },
      {
        id: 'npc_shop_general',
        name: '杂货商',
        avatar: '🧑‍🌾',
        type: 'merchant',
        position: { x: 3, y: 3 },
        dialogues: {
          default: ['客官要买点什么？小店应有尽有！', '这些可都是上好的货色。'],
          greeting: '欢迎光临！'
        },
        shopId: 'shop_general'
      },
      {
        id: 'npc_healer',
        name: '药庐郎中',
        avatar: '👨‍⚕️',
        type: 'healer',
        position: { x: 12, y: 3 },
        dialogues: {
          default: ['身体不适？让我看看...', '这是祖传的秘方，包治百病！'],
          greeting: '有伤有病尽管来！'
        },
        healCost: 10,
        services: ['治疗', '解毒']
      },
      {
        id: 'npc_blacksmith',
        name: '铁匠',
        avatar: '🧑‍🔧',
        type: 'blacksmith',
        position: { x: 2, y: 12 },
        dialogues: {
          default: ['叮叮当！好铁要千锤百炼！', '想强化装备？找我准没错。'],
          greeting: '要打铁还是要修装备？'
        },
        services: ['装备强化', '装备修理', '装备鉴定']
      },
      {
        id: 'npc_pharmacist',
        name: '药铺掌柜',
        avatar: '💊',
        type: 'merchant',
        position: { x: 10, y: 5 },
        dialogues: {
          default: ['要买药吗？我这里的药最灵了！', '杨家药铺，童叟无欺！'],
          greeting: '客官，要配药吗？'
        },
        shopId: 'shop_medicine',
        questIds: ['main_3_2', 'main_3_5']
      },
      {
        id: 'npc_teleporter',
        name: '传送使者',
        avatar: '🧙‍♂️',
        type: 'teleporter',
        position: { x: 7, y: 13 },
        dialogues: {
          default: ['我可以带你瞬间移动到其他地方。', '传送可是很方便的哦！'],
          greeting: '要去哪里？'
        },
        teleportDestinations: [
          { mapId: 'map_donghai_village', name: '东海村', cost: 50 },
          { mapId: 'map_datang_capital', name: '大唐都城', cost: 100 },
        ]
      },
      {
        id: 'npc_stable',
        name: '马厩管理员',
        avatar: '🧑‍🌾',
        type: 'stable',
        position: { x: 13, y: 8 },
        dialogues: {
          default: ['要寄存宠物吗？', '好马配好鞍，好宠配好人！'],
          greeting: '你的宠物看起来很健康！'
        },
        services: ['宠物寄存', '宠物治疗', '宠物技能学习']
      },
      {
        id: 'npc_alchemist',
        name: '炼丹师',
        avatar: '🧙',
        type: 'alchemist',
        position: { x: 3, y: 8 },
        dialogues: {
          default: ['丹药之道，玄妙无穷...', '收集材料来，我帮你炼制丹药。'],
          greeting: '要炼制什么丹药？'
        },
        services: ['丹药炼制', '材料兑换']
      },
    ],
    events: [],
    teleporters: [],
    icon: '🏯',
  },

  // 南城客栈
  map_nancheng_inn: {
    id: 'map_nancheng_inn',
    name: '南城客栈',
    description: '长安城南的一家客栈，人来人往，消息灵通。',
    type: 'town',
    region: 'changan',
    levelRange: { min: 3, max: 10 },
    size: { width: 10, height: 10 },
    connections: [
      { direction: 'north', targetMapId: 'map_changan' },
    ],
    npcs: [
      {
        id: 'npc_shop_assistant',
        name: '店小二',
        avatar: '🧑',
        type: 'quest',
        position: { x: 5, y: 5 },
        dialogues: {
          default: ['客官里边请！', '要住店还是吃饭？'],
          greeting: '欢迎光临南城客栈！'
        },
        questIds: ['main_2_1', 'main_3_1', 'main_3_5']
      },
      {
        id: 'npc_black_guest',
        name: '黑衣客商',
        avatar: '🎭',
        type: 'quest',
        position: { x: 7, y: 3 },
        dialogues: {
          default: ['我们只是路过此地...', '不要多管闲事。'],
          greeting: '...'
        },
        questIds: ['main_2_2']
      },
      {
        id: 'npc_drunk_taoist',
        name: '醉道士',
        avatar: '🧙',
        type: 'quest',
        position: { x: 3, y: 8 },
        dialogues: {
          default: ['酒...我要喝酒...', '嗝~好酒！'],
          greeting: '小兄弟，行行好...'
        },
        questIds: ['main_2_3', 'main_2_4', 'main_2_6']
      },
      {
        id: 'npc_qingqing',
        name: '清清',
        avatar: '👧',
        type: 'quest',
        position: { x: 8, y: 7 },
        dialogues: {
          default: ['谢谢你来救我...', '师父还在等着我...'],
          greeting: '你...你是谁？'
        },
        questIds: ['main_4_1', 'main_4_4', 'main_4_5']
      },
    ],
    events: [],
    teleporters: [],
    icon: '🏨',
  },

  // 城南荒野
  map_chengnan_wasteland: {
    id: 'map_chengnan_wasteland',
    name: '城南荒野',
    description: '长安城以南的荒野地带，夜晚常有奇人异士出没。',
    type: 'field',
    region: 'changan',
    levelRange: { min: 4, max: 8 },
    size: { width: 15, height: 12 },
    connections: [
      { direction: 'north', targetMapId: 'map_changan' },
      { direction: 'east', targetMapId: 'map_xianquan' },
    ],
    npcs: [],
    events: [
      {
        id: 'event_learn_magic',
        type: 'story',
        position: { x: 12, y: 8 },
        trigger: 'interact',
        data: { storyId: 'story_learn_magic' },
        oneTime: false,
      },
    ],
    teleporters: [],
    encounterConfig: {
      rate: 0.12,
      enemyGroups: ['enemy_group_wolves', 'enemy_group_bandits'],
      stepTrigger: 8,
    },
    icon: '🌙',
  },

  // 仙泉
  map_xianquan: {
    id: 'map_xianquan',
    name: '仙泉',
    description: '传说中的仙泉，常有仙子出现，赐凡人仙露。',
    type: 'field',
    region: 'changan',
    levelRange: { min: 5, max: 10 },
    size: { width: 10, height: 10 },
    connections: [
      { direction: 'west', targetMapId: 'map_chengnan_wasteland' },
    ],
    npcs: [
      {
        id: 'npc_grandma',
        name: '婆婆',
        avatar: '👵',
        type: 'quest',
        position: { x: 5, y: 5 },
        dialogues: {
          default: ['年轻人，有什么事吗？', '清清...我的徒儿...'],
          greeting: '啊...年轻人...'
        },
        questIds: ['main_4_3']
      },
      {
        id: 'npc_fairy',
        name: '仙子',
        avatar: '🧚',
        type: 'quest',
        position: { x: 7, y: 3 },
        dialogues: {
          default: ['仙泉之水，可解百毒。', '有缘人，方可得见。'],
          greeting: '有缘人...'
        },
        questIds: ['main_3_4']
      },
    ],
    events: [
      {
        id: 'event_fairy_spring',
        type: 'treasure',
        position: { x: 5, y: 3 },
        trigger: 'interact',
        data: { treasureId: 'fairy_dew' },
        oneTime: false,
      },
    ],
    teleporters: [],
    icon: '💧',
  },

  // ==================== 第五章：振远镖局区域 ====================

  // 城隍庙
  map_chenghuang_temple: {
    id: 'map_chenghuang_temple',
    name: '城隍庙',
    description: '长安城内的城隍庙，香火鼎盛，许愿灵验。',
    type: 'town',
    region: 'changan',
    levelRange: { min: 8, max: 12 },
    size: { width: 10, height: 10 },
    connections: [
      { direction: 'north', targetMapId: 'map_changan' },
    ],
    npcs: [
      {
        id: 'npc_xiao_xiaoyue',
        name: '萧晓月',
        avatar: '👩',
        type: 'quest',
        position: { x: 6, y: 5 },
        dialogues: {
          default: ['哼！这两人竟敢私奔！', '看我怎么教训他们！'],
          greeting: '你是谁？少管闲事！'
        },
        questIds: ['main_5_2']
      },
      {
        id: 'npc_temple_monk',
        name: '庙祝',
        avatar: '🧘',
        type: 'trainer',
        position: { x: 5, y: 8 },
        dialogues: {
          default: ['施主，要烧香吗？', '心诚则灵。'],
          greeting: '阿弥陀佛...'
        },
        services: ['祈福', '许愿']
      },
    ],
    events: [],
    teleporters: [],
    icon: '⛩️',
  },

  // 振远镖局
  map_zhenyuan_biaoju: {
    id: 'map_zhenyuan_biaoju',
    name: '振远镖局',
    description: '长安城内最大的镖局，萧升镖头在此坐镇。',
    type: 'town',
    region: 'changan',
    levelRange: { min: 9, max: 15 },
    size: { width: 12, height: 10 },
    connections: [
      { direction: 'north', targetMapId: 'map_changan' },
    ],
    npcs: [
      {
        id: 'npc_xiao_sheng',
        name: '萧升',
        avatar: '👨',
        type: 'quest',
        position: { x: 6, y: 4 },
        dialogues: {
          default: ['老夫萧升，振远镖局总镖头。', '比武招亲，择贤而嫁！'],
          greeting: '少侠，有何贵干？'
        },
        questIds: ['main_5_3', 'main_5_5', 'main_6_1']
      },
    ],
    events: [
      {
        id: 'event_martial_arts',
        type: 'battle',
        position: { x: 6, y: 6 },
        trigger: 'interact',
        data: { enemyGroupId: 'enemy_group_xiao_xiaoyue' },
        oneTime: false,
      },
    ],
    teleporters: [],
    icon: '⚔️',
  },

  // ==================== 第六章：大雁塔区域 ====================

  // 慈恩寺（大雁塔入口）
  map_ciensi: {
    id: 'map_ciensi',
    name: '慈恩寺',
    description: '长安城内的名寺，寺内大雁塔是佛教圣地。',
    type: 'town',
    region: 'changan',
    levelRange: { min: 10, max: 15 },
    size: { width: 10, height: 10 },
    connections: [
      { direction: 'north', targetMapId: 'map_changan' },
      { direction: 'east', targetMapId: 'map_dayan_ta' },
    ],
    npcs: [
      {
        id: 'npc_abbot',
        name: '方丈',
        avatar: '🧘',
        type: 'trainer',
        position: { x: 5, y: 5 },
        dialogues: {
          default: ['阿弥陀佛...', '大雁塔中妖魔作祟，望施主小心。'],
          greeting: '施主，有礼了。'
        },
        services: ['佛法指导', '驱魔']
      },
    ],
    events: [],
    teleporters: [],
    icon: '🛕',
  },

  // 大雁塔
  map_dayan_ta: {
    id: 'map_dayan_ta',
    name: '大雁塔',
    description: '传说中的大雁塔，内有蛇妖和狐妖作祟。',
    type: 'dungeon',
    region: 'changan',
    levelRange: { min: 11, max: 18 },
    size: { width: 12, height: 12 },
    connections: [
      { direction: 'west', targetMapId: 'map_ciensi' },
    ],
    npcs: [],
    events: [
      {
        id: 'event_snake_demon',
        type: 'battle',
        position: { x: 6, y: 8 },
        trigger: 'step',
        data: { enemyGroupId: 'enemy_group_snake_demon' },
        oneTime: false,
      },
      {
        id: 'event_fox_demon',
        type: 'battle',
        position: { x: 8, y: 4 },
        trigger: 'step',
        data: { enemyGroupId: 'enemy_group_fox_demon_female' },
        oneTime: false,
      },
    ],
    teleporters: [],
    encounterConfig: {
      rate: 0.2,
      enemyGroups: ['enemy_group_snakes', 'enemy_group_foxes'],
      stepTrigger: 5,
    },
    icon: '🗼',
  },

  // 高家庄
  map_gaojia_zhuang: {
    id: 'map_gaojia_zhuang',
    name: '高家庄',
    description: '高老庄附近的村庄，饱受海妖之患。',
    type: 'town',
    region: 'gaolao',
    levelRange: { min: 12, max: 18 },
    size: { width: 10, height: 10 },
    connections: [
      { direction: 'south', targetMapId: 'map_donghai_seaforest', requiredLevel: 14 },
    ],
    npcs: [
      {
        id: 'npc_wu_wen',
        name: '吴文',
        avatar: '👨',
        type: 'quest',
        position: { x: 5, y: 5 },
        dialogues: {
          default: ['我是这村子的村长...', '海妖之患，让村民们苦不堪言。'],
          greeting: '客官从哪里来？'
        },
        questIds: ['main_6_5', 'main_7_1', 'main_8_1']
      },
      {
        id: 'npc_qingqing_gaojia',
        name: '清清',
        avatar: '👧',
        type: 'quest',
        position: { x: 7, y: 7 },
        dialogues: {
          default: ['谢谢你救了我...', '我们必须想办法消灭海妖！'],
          greeting: '你终于来了...'
        },
        questIds: ['main_6_5']
      },
    ],
    events: [],
    teleporters: [],
    icon: '🏠',
  },

  // ==================== 第七章：方寸山区域 ====================

  // 方寸山
  map_fangcun_mountain: {
    id: 'map_fangcun_mountain',
    name: '方寸山',
    description: '道家名山，传说中有得道高人隐居于此。',
    type: 'field',
    region: 'fangcun',
    levelRange: { min: 14, max: 20 },
    size: { width: 12, height: 12 },
    connections: [
      { direction: 'north', targetMapId: 'map_gaojia_zhuang' },
    ],
    npcs: [
      {
        id: 'npc_sweeping_boy',
        name: '扫地小童',
        avatar: '🧒',
        type: 'quest',
        position: { x: 6, y: 5 },
        dialogues: {
          default: ['知者不言...言者不知...', '道可道...非常道...'],
          greeting: '...'
        },
      },
      {
        id: 'npc_qingfeng_daoshi',
        name: '清风道长',
        avatar: '🧙',
        type: 'quest',
        position: { x: 6, y: 3 },
        dialogues: {
          default: ['贫道是道家清修之人，从不过问外界之俗事。', '施主，请回吧。'],
          greeting: '施主有何贵干？'
        },
        questIds: ['main_7_3']
      },
    ],
    events: [
      {
        id: 'event_qingfeng_battle',
        type: 'battle',
        position: { x: 6, y: 3 },
        trigger: 'interact',
        data: { enemyGroupId: 'enemy_group_qingfeng_daoshi' },
        oneTime: false,
      },
    ],
    teleporters: [],
    encounterConfig: {
      rate: 0.15,
      enemyGroups: ['enemy_group_mountain_spirits'],
      stepTrigger: 7,
    },
    icon: '⛰️',
  },

  // 东海海底莽林
  map_donghai_seaforest: {
    id: 'map_donghai_seaforest',
    name: '东海海底莽林',
    description: '东海海底的神秘森林，赤血龙王在此作祟。',
    type: 'dungeon',
    region: 'donghai',
    levelRange: { min: 16, max: 22 },
    size: { width: 15, height: 15 },
    connections: [
      { direction: 'north', targetMapId: 'map_gaojia_zhuang' },
    ],
    npcs: [],
    events: [
      {
        id: 'event_red_blood_dragon',
        type: 'battle',
        position: { x: 8, y: 8 },
        trigger: 'step',
        data: { enemyGroupId: 'enemy_group_red_blood_dragon' },
        oneTime: false,
      },
    ],
    teleporters: [],
    encounterConfig: {
      rate: 0.22,
      enemyGroups: ['enemy_group_sea_monsters', 'enemy_group_red_blood_dragon'],
      stepTrigger: 5,
    },
    icon: '🌊',
  },

  // ==================== 第八章：兵马俑阵 ====================

  // 兵马俑阵
  map_bingmayong: {
    id: 'map_bingmayong',
    name: '兵马俑阵',
    description: '秦始皇陵的兵马俑阵，机关重重，危机四伏。',
    type: 'dungeon',
    region: 'xianyang',
    levelRange: { min: 18, max: 25 },
    size: { width: 15, height: 15 },
    connections: [
      { direction: 'north', targetMapId: 'map_changan', requiredLevel: 18 },
    ],
    npcs: [
      {
        id: 'npc_elder_xiang',
        name: '项长老',
        avatar: '👴',
        type: 'quest',
        position: { x: 8, y: 8 },
        dialogues: {
          default: ['殿下，老臣得罪了...', '大王盼着能见到失散十年的亲生女儿最后一面啊。'],
          greeting: '公主殿下...'
        },
        questIds: ['main_8_2', 'main_8_3']
      },
      {
        id: 'npc_qingqing_final',
        name: '清清',
        avatar: '👧',
        type: 'quest',
        position: { x: 10, y: 10 },
        dialogues: {
          default: ['我必须跟他们走...', '为了保护大家...'],
          greeting: '再见了...'
        },
        questIds: ['main_8_4']
      },
    ],
    events: [],
    teleporters: [],
    encounterConfig: {
      rate: 0.2,
      enemyGroups: ['enemy_group_terracotta_warriors'],
      stepTrigger: 5,
    },
    icon: '🗿',
  },

  // ==================== 原有地图保留 ====================

  // 新手村野外地图
  map_village_1: {
    id: 'map_village_1',
    name: '长安郊外',
    description: '长安城外的郊野地带，偶尔有野兽出没。',
    type: 'field',
    region: 'newbie',
    levelRange: { min: 1, max: 5 },
    size: { width: 15, height: 15 },
    connections: [
      { direction: 'west', targetMapId: 'map_changan' },
      { direction: 'east', targetMapId: 'map_village_2' },
    ],
    npcs: [],
    events: [],
    teleporters: [],
    encounterConfig: {
      rate: 0.1,
      enemyGroups: ['enemy_group_wolves', 'enemy_group_rabbits'],
      stepTrigger: 10,
    },
    icon: '🌲',
  },

  map_village_2: {
    id: 'map_village_2',
    name: '竹林小道',
    description: '一片幽静的竹林，适合初级冒险者练级。',
    type: 'field',
    region: 'newbie',
    levelRange: { min: 3, max: 7 },
    size: { width: 15, height: 15 },
    connections: [
      { direction: 'west', targetMapId: 'map_village_1' },
      { direction: 'east', targetMapId: 'map_village_3' },
      { direction: 'north', targetMapId: 'map_village_5' },
    ],
    npcs: [],
    events: [],
    teleporters: [],
    encounterConfig: {
      rate: 0.12,
      enemyGroups: ['enemy_group_bamboo', 'enemy_group_snakes'],
      stepTrigger: 8,
    },
    icon: '🎋',
  },

  map_village_3: {
    id: 'map_village_3',
    name: '清溪流泉',
    description: '清澈的小溪旁，风景宜人。',
    type: 'field',
    region: 'newbie',
    levelRange: { min: 5, max: 9 },
    size: { width: 15, height: 15 },
    connections: [
      { direction: 'west', targetMapId: 'map_village_2' },
      { direction: 'east', targetMapId: 'map_village_4' },
    ],
    npcs: [],
    events: [],
    teleporters: [],
    encounterConfig: {
      rate: 0.15,
      enemyGroups: ['enemy_group_frogs', 'enemy_group_fish'],
      stepTrigger: 8,
    },
    icon: '💧',
  },

  map_village_4: {
    id: 'map_village_4',
    name: '古树森林',
    description: '古老的森林，树木参天。',
    type: 'field',
    region: 'newbie',
    levelRange: { min: 7, max: 11 },
    size: { width: 15, height: 15 },
    connections: [
      { direction: 'west', targetMapId: 'map_village_3' },
      { direction: 'north', targetMapId: 'map_village_6' },
    ],
    npcs: [],
    events: [],
    teleporters: [],
    encounterConfig: {
      rate: 0.15,
      enemyGroups: ['enemy_group_boars', 'enemy_group_bears'],
      stepTrigger: 7,
    },
    icon: '🌳',
  },

  map_village_5: {
    id: 'map_village_5',
    name: '山顶云海',
    description: '山顶之上，云雾缭绕。',
    type: 'field',
    region: 'newbie',
    levelRange: { min: 6, max: 10 },
    size: { width: 12, height: 12 },
    connections: [
      { direction: 'south', targetMapId: 'map_village_2' },
      { direction: 'east', targetMapId: 'map_village_6' },
    ],
    npcs: [],
    events: [],
    teleporters: [],
    encounterConfig: {
      rate: 0.18,
      enemyGroups: ['enemy_group_eagles', 'enemy_group_monkeys'],
      stepTrigger: 6,
    },
    icon: '⛰️',
  },

  map_village_6: {
    id: 'map_village_6',
    name: '花果山脚',
    description: '传说中孙悟空的故乡，花果山脚下。',
    type: 'field',
    region: 'newbie',
    levelRange: { min: 8, max: 12 },
    size: { width: 15, height: 15 },
    connections: [
      { direction: 'west', targetMapId: 'map_village_5' },
      { direction: 'south', targetMapId: 'map_village_4' },
      { direction: 'east', targetMapId: 'map_village_7' },
    ],
    npcs: [],
    events: [],
    teleporters: [],
    encounterConfig: {
      rate: 0.2,
      enemyGroups: ['enemy_group_monkeys', 'enemy_group_tigers'],
      stepTrigger: 5,
    },
    icon: '🍑',
  },

  map_village_7: {
    id: 'map_village_7',
    name: '水帘洞外',
    description: '传说中的水帘洞入口，危险与机遇并存。',
    type: 'field',
    region: 'newbie',
    levelRange: { min: 10, max: 15 },
    size: { width: 12, height: 12 },
    connections: [
      { direction: 'west', targetMapId: 'map_village_6' },
      { direction: 'east', targetMapId: 'map_datang_west', requiredLevel: 10 },
    ],
    npcs: [],
    events: [
      {
        id: 'event_waterfall',
        type: 'story',
        position: { x: 6, y: 6 },
        trigger: 'interact',
        data: { storyId: 'story_waterfall' },
        oneTime: false,
      },
    ],
    teleporters: [
      {
        id: 'teleport_dungeon',
        position: { x: 6, y: 5 },
        targetMapId: 'map_changan',
        targetPosition: { x: 5, y: 5 },
      },
    ],
    encounterConfig: {
      rate: 0.25,
      enemyGroups: ['enemy_group_elite_monkeys', 'enemy_group_boss_monkey'],
      stepTrigger: 4,
    },
    icon: '🌊',
  },

  // ========== 东土大唐区域 ==========

  // 大唐都城（安全区）
  map_datang_capital: {
    id: 'map_datang_capital',
    name: '大唐都城',
    description: '大唐帝国的繁华都城，商贾云集，人声鼎沸。',
    type: 'town',
    region: 'datang',
    levelRange: { min: 10, max: 25 },
    size: { width: 15, height: 15 },
    connections: [
      { direction: 'east', targetMapId: 'map_datang_east' },
      { direction: 'west', targetMapId: 'map_datang_west' },
      { direction: 'north', targetMapId: 'map_datang_north' },
      { direction: 'south', targetMapId: 'map_datang_south' },
    ],
    npcs: [
      {
        id: 'npc_datang_guard',
        name: '守城将军',
        avatar: '💂',
        type: 'trainer',
        position: { x: 7, y: 7 },
        dialogues: {
          default: ['欢迎来到大唐都城！', '城外危险，请多加小心。', '若想变强，可以在这里修炼。'],
          greeting: '你是来自远方的冒险者？'
        },
        services: ['技能学习', '战斗指导']
      },
      {
        id: 'npc_datang_merchant_exotic',
        name: '西域商人',
        avatar: '🧔',
        type: 'merchant',
        position: { x: 5, y: 8 },
        dialogues: {
          default: ['要看看西域来的珍宝吗？', '这可都是稀有的宝贝！'],
          greeting: '客官好眼光！'
        },
        shopId: 'shop_exotic'
      },
      {
        id: 'npc_datang_weapon',
        name: '兵器铺掌柜',
        avatar: '⚔️',
        type: 'merchant',
        position: { x: 10, y: 5 },
        dialogues: {
          default: ['上好的兵器，削铁如泥！', '买把好武器，行走江湖才安全。'],
          greeting: '要买兵器吗？'
        },
        shopId: 'shop_weapons'
      },
      {
        id: 'npc_datang_armor',
        name: '防具店老板',
        avatar: '🛡️',
        type: 'merchant',
        position: { x: 11, y: 5 },
        dialogues: {
          default: ['好盔甲保命要紧！', '防御才是王道啊。'],
          greeting: '来看看防具吧！'
        },
        shopId: 'shop_armors'
      },
      {
        id: 'npc_datang_healer',
        name: '御医',
        avatar: '👨‍⚕️',
        type: 'healer',
        position: { x: 3, y: 10 },
        dialogues: {
          default: ['宫廷秘方，药到病除。', '身体是革命的本钱啊！'],
          greeting: '哪里不舒服？'
        },
        healCost: 50,
        services: ['治疗', '解毒', '状态恢复']
      },
      {
        id: 'npc_datang_blacksmith',
        name: '名匠',
        avatar: '🔨',
        type: 'blacksmith',
        position: { x: 12, y: 10 },
        dialogues: {
          default: ['我打造的装备，天下无双！', '强化有风险，投资需谨慎。'],
          greeting: '要打造神兵利器吗？'
        },
        services: ['装备强化', '装备修理', '装备重铸', '宝石镶嵌']
      },
      {
        id: 'npc_datang_teleporter',
        name: '传送仙官',
        avatar: '🧚',
        type: 'teleporter',
        position: { x: 7, y: 13 },
        dialogues: {
          default: ['瞬间移动，眨眼即至！', '仙家法术，方便快捷。'],
          greeting: '要去往何处？'
        },
        teleportDestinations: [
          { mapId: 'map_changan', name: '长安城', cost: 100 },
          { mapId: 'map_dungeon_entrance', name: '副本入口', cost: 200 },
        ]
      },
      {
        id: 'npc_datang_banker',
        name: '钱庄掌柜',
        avatar: '💰',
        type: 'banker',
        position: { x: 4, y: 5 },
        dialogues: {
          default: ['钱财乃身外之物，但也不能乱丢。', '存取自由，安全可靠！'],
          greeting: '要存取物品吗？'
        },
        services: ['物品存储', '金币存储']
      },
      {
        id: 'npc_datang_stable',
        name: '御马监',
        avatar: '🐴',
        type: 'stable',
        position: { x: 13, y: 7 },
        dialogues: {
          default: ['御马监专司宠物管理。', '珍禽异兽，应有尽有。'],
          greeting: '你的宠物需要照顾吗？'
        },
        services: ['宠物寄存', '宠物治疗', '宠物进化', '宠物技能学习']
      },
      {
        id: 'npc_datang_quest',
        name: '任务发布官',
        avatar: '📜',
        type: 'quest',
        position: { x: 7, y: 3 },
        dialogues: {
          default: ['有很多事情需要帮忙...', '完成委托可以获得丰厚奖励！'],
          greeting: '有任务要接吗？'
        },
        questIds: ['quest_daily_datang_1', 'quest_daily_datang_2']
      },
    ],
    events: [],
    teleporters: [],
    icon: '🏛️',
  },

  // 东郊
  map_datang_east: {
    id: 'map_datang_east',
    name: '大唐东郊',
    description: '大唐都城以东的郊外地带，风景秀丽。',
    type: 'field',
    region: 'datang',
    levelRange: { min: 10, max: 15 },
    size: { width: 15, height: 15 },
    connections: [
      { direction: 'west', targetMapId: 'map_datang_capital' },
      { direction: 'east', targetMapId: 'map_fox_valley' },
      { direction: 'north', targetMapId: 'map_ancient_temple' },
    ],
    npcs: [],
    events: [],
    teleporters: [],
    encounterConfig: {
      rate: 0.12,
      enemyGroups: ['enemy_group_foxes', 'enemy_group_deer'],
      stepTrigger: 8,
    },
    icon: '🌅',
  },

  // 西郊
  map_datang_west: {
    id: 'map_datang_west',
    name: '大唐西郊',
    description: '大唐都城以西的郊外，通往西域的要道。',
    type: 'field',
    region: 'datang',
    levelRange: { min: 10, max: 14 },
    size: { width: 15, height: 15 },
    connections: [
      { direction: 'west', targetMapId: 'map_village_7', requiredLevel: 10 },
      { direction: 'east', targetMapId: 'map_datang_capital' },
      { direction: 'south', targetMapId: 'map_spider_forest' },
    ],
    npcs: [],
    events: [],
    teleporters: [],
    encounterConfig: {
      rate: 0.12,
      enemyGroups: ['enemy_group_bandits', 'enemy_group_wild_dogs'],
      stepTrigger: 8,
    },
    icon: '🌄',
  },

  // 北郊
  map_datang_north: {
    id: 'map_datang_north',
    name: '大唐北郊',
    description: '大唐都城以北，群山环绕，地势险要。',
    type: 'field',
    region: 'datang',
    levelRange: { min: 12, max: 18 },
    size: { width: 15, height: 15 },
    connections: [
      { direction: 'south', targetMapId: 'map_datang_capital' },
      { direction: 'east', targetMapId: 'map_dragon_pool' },
      { direction: 'west', targetMapId: 'map_tiger_den' },
    ],
    npcs: [],
    events: [],
    teleporters: [],
    encounterConfig: {
      rate: 0.15,
      enemyGroups: ['enemy_group_wild_wolves', 'enemy_group_bears_datang'],
      stepTrigger: 7,
    },
    icon: '🏔️',
  },

  // 南郊
  map_datang_south: {
    id: 'map_datang_south',
    name: '大唐南郊',
    description: '大唐都城以南，河流纵横，土地肥沃。',
    type: 'field',
    region: 'datang',
    levelRange: { min: 11, max: 16 },
    size: { width: 15, height: 15 },
    connections: [
      { direction: 'north', targetMapId: 'map_datang_capital' },
      { direction: 'east', targetMapId: 'map_misty_swamp' },
      { direction: 'west', targetMapId: 'map_ghost_town' },
    ],
    npcs: [],
    events: [],
    teleporters: [],
    encounterConfig: {
      rate: 0.14,
      enemyGroups: ['enemy_group_water_demons', 'enemy_group_fishmen'],
      stepTrigger: 7,
    },
    icon: '🌾',
  },

  // 狐狸谷
  map_fox_valley: {
    id: 'map_fox_valley',
    name: '狐狸谷',
    description: '传说中有妖狐出没的山谷，迷雾缭绕。',
    type: 'field',
    region: 'datang',
    levelRange: { min: 15, max: 20 },
    size: { width: 12, height: 12 },
    connections: [
      { direction: 'west', targetMapId: 'map_datang_east' },
      { direction: 'north', targetMapId: 'map_fairy_peak' },
    ],
    npcs: [],
    events: [],
    teleporters: [],
    encounterConfig: {
      rate: 0.18,
      enemyGroups: ['enemy_group_foxes', 'enemy_group_fox_spirits'],
      stepTrigger: 6,
    },
    icon: '🦊',
  },

  // 蜘蛛林
  map_spider_forest: {
    id: 'map_spider_forest',
    name: '蜘蛛林',
    description: '蜘蛛横行的森林，蛛网密布，阴森恐怖。',
    type: 'field',
    region: 'datang',
    levelRange: { min: 14, max: 19 },
    size: { width: 12, height: 12 },
    connections: [
      { direction: 'north', targetMapId: 'map_datang_west' },
      { direction: 'east', targetMapId: 'map_dungeon_entrance' },
    ],
    npcs: [],
    events: [
      {
        id: 'event_spider_nest',
        type: 'battle',
        position: { x: 6, y: 6 },
        trigger: 'step',
        data: { enemyGroupId: 'enemy_group_spider_queen' },
        oneTime: false,
      },
    ],
    teleporters: [],
    encounterConfig: {
      rate: 0.2,
      enemyGroups: ['enemy_group_spiders', 'enemy_group_poison_spiders'],
      stepTrigger: 5,
    },
    icon: '🕸️',
  },

  // 山贼据点
  map_bandit_stronghold: {
    id: 'map_bandit_stronghold',
    name: '山贼据点',
    description: '山贼盘踞的要塞，易守难攻。',
    type: 'field',
    region: 'datang',
    levelRange: { min: 16, max: 22 },
    size: { width: 10, height: 10 },
    connections: [
      { direction: 'south', targetMapId: 'map_ancient_temple' },
    ],
    npcs: [],
    events: [],
    teleporters: [],
    encounterConfig: {
      rate: 0.22,
      enemyGroups: ['enemy_group_bandits', 'enemy_group_bandit_elites'],
      stepTrigger: 5,
    },
    icon: '🏴',
  },

  // 古庙
  map_ancient_temple: {
    id: 'map_ancient_temple',
    name: '古庙',
    description: '一座废弃的古庙，据说曾是有道高僧修行之地。',
    type: 'field',
    region: 'datang',
    levelRange: { min: 13, max: 18 },
    size: { width: 12, height: 12 },
    connections: [
      { direction: 'south', targetMapId: 'map_datang_east' },
      { direction: 'north', targetMapId: 'map_bandit_stronghold' },
    ],
    npcs: [
      {
        id: 'npc_old_monk',
        name: '老僧',
        avatar: '🧘',
        type: 'trainer',
        position: { x: 6, y: 6 },
        dialogues: {
          default: ['施主，佛法无边...', '贫僧在此守庙数十载...', '若想领悟更高深的武学，需心无杂念。'],
          greeting: '阿弥陀佛...'
        },
        services: ['佛法指导', '内功修炼', '心法传授']
      },
    ],
    events: [
      {
        id: 'event_temple_treasure',
        type: 'treasure',
        position: { x: 3, y: 3 },
        trigger: 'interact',
        data: { treasureId: 'chest_temple' },
        oneTime: true,
      },
    ],
    teleporters: [],
    encounterConfig: {
      rate: 0.15,
      enemyGroups: ['enemy_group_ghosts', 'enemy_group_temple_guardians'],
      stepTrigger: 6,
    },
    icon: '⛩️',
  },

  // 迷雾沼泽
  map_misty_swamp: {
    id: 'map_misty_swamp',
    name: '迷雾沼泽',
    description: '终年笼罩在迷雾中的沼泽地，毒虫遍地。',
    type: 'field',
    region: 'datang',
    levelRange: { min: 17, max: 23 },
    size: { width: 12, height: 12 },
    connections: [
      { direction: 'west', targetMapId: 'map_datang_south' },
      { direction: 'north', targetMapId: 'map_dungeon_entrance' },
    ],
    npcs: [],
    events: [],
    teleporters: [],
    encounterConfig: {
      rate: 0.2,
      enemyGroups: ['enemy_group_swamp_creatures', 'enemy_group_poison_toads'],
      stepTrigger: 5,
    },
    icon: '🌫️',
  },

  // 龙潭
  map_dragon_pool: {
    id: 'map_dragon_pool',
    name: '龙潭',
    description: '传说中有神龙居住的深潭，灵气充沛。',
    type: 'field',
    region: 'datang',
    levelRange: { min: 18, max: 24 },
    size: { width: 10, height: 10 },
    connections: [
      { direction: 'west', targetMapId: 'map_datang_north' },
      { direction: 'south', targetMapId: 'map_fairy_peak' },
    ],
    npcs: [],
    events: [
      {
        id: 'event_dragon_blessing',
        type: 'story',
        position: { x: 5, y: 5 },
        trigger: 'interact',
        data: { storyId: 'story_dragon_blessing' },
        oneTime: true,
      },
    ],
    teleporters: [],
    encounterConfig: {
      rate: 0.18,
      enemyGroups: ['enemy_group_water_dragons', 'enemy_group_dragon_fish'],
      stepTrigger: 5,
    },
    icon: '🐉',
  },

  // 虎穴
  map_tiger_den: {
    id: 'map_tiger_den',
    name: '虎穴',
    description: '猛虎聚居的洞穴，危机四伏。',
    type: 'field',
    region: 'datang',
    levelRange: { min: 16, max: 22 },
    size: { width: 10, height: 10 },
    connections: [
      { direction: 'east', targetMapId: 'map_datang_north' },
    ],
    npcs: [],
    events: [],
    teleporters: [],
    encounterConfig: {
      rate: 0.22,
      enemyGroups: ['enemy_group_tigers_datang', 'enemy_group_tiger_king'],
      stepTrigger: 5,
    },
    icon: '🐯',
  },

  // 仙峰
  map_fairy_peak: {
    id: 'map_fairy_peak',
    name: '仙峰',
    description: '高耸入云的山峰，据说是仙人修炼之所。',
    type: 'field',
    region: 'datang',
    levelRange: { min: 20, max: 25 },
    size: { width: 10, height: 10 },
    connections: [
      { direction: 'south', targetMapId: 'map_fox_valley' },
      { direction: 'north', targetMapId: 'map_dragon_pool' },
    ],
    npcs: [
      {
        id: 'npc_hermit',
        name: '隐士',
        avatar: '🧙',
        type: 'trainer',
        position: { x: 5, y: 5 },
        dialogues: {
          default: ['年轻人，你可知修仙之路？', '仙道漫漫，非一朝一夕...', '唯有持之以恒，方能有所成就。'],
          greeting: '有缘人，你来此何事？'
        },
        services: ['修仙指导', '仙术传授', '境界突破']
      },
    ],
    events: [],
    teleporters: [],
    encounterConfig: {
      rate: 0.15,
      enemyGroups: ['enemy_group_fairy_beasts', 'enemy_group_cloud_spirits'],
      stepTrigger: 6,
    },
    icon: '⛰️',
  },

  // 鬼城
  map_ghost_town: {
    id: 'map_ghost_town',
    name: '鬼城',
    description: '一座被诅咒的废弃城池，阴魂不散。',
    type: 'field',
    region: 'datang',
    levelRange: { min: 19, max: 25 },
    size: { width: 12, height: 12 },
    connections: [
      { direction: 'east', targetMapId: 'map_datang_south' },
    ],
    npcs: [],
    events: [
      {
        id: 'event_ghost_treasure',
        type: 'treasure',
        position: { x: 6, y: 6 },
        trigger: 'interact',
        data: { treasureId: 'chest_ghost' },
        oneTime: true,
      },
    ],
    teleporters: [],
    encounterConfig: {
      rate: 0.2,
      enemyGroups: ['enemy_group_ghosts_datang', 'enemy_group_skeleton_warriors'],
      stepTrigger: 5,
    },
    icon: '👻',
  },

  // 副本入口区
  map_dungeon_entrance: {
    id: 'map_dungeon_entrance',
    name: '副本入口',
    description: '通往各种秘境副本的入口，危机与机遇并存。',
    type: 'dungeon',
    region: 'datang',
    levelRange: { min: 15, max: 30 },
    size: { width: 10, height: 10 },
    connections: [
      { direction: 'west', targetMapId: 'map_spider_forest' },
      { direction: 'south', targetMapId: 'map_misty_swamp' },
    ],
    npcs: [
      {
        id: 'npc_dungeon_guard',
        name: '守卫',
        avatar: '⚔️',
        type: 'quest',
        position: { x: 5, y: 5 },
        dialogues: {
          default: ['前方是危险的副本区域，请做好准备。', '副本中怪物强大，建议组队前往。', '完成副本可获得丰厚奖励！'],
          greeting: '准备好了吗？'
        },
        questIds: ['quest_dungeon_intro']
      },
      {
        id: 'npc_dungeon_merchant',
        name: '副本商人',
        avatar: '🧑‍💼',
        type: 'merchant',
        position: { x: 3, y: 5 },
        dialogues: {
          default: ['冒险者需要补给品吗？', '副本里可没有商店哦。'],
          greeting: '买点东西再进去吧！'
        },
        shopId: 'shop_dungeon'
      },
    ],
    events: [],
    teleporters: [],
    icon: '🚪',
  },
};

/** 获取地图配置 */
export function getMap(id: string): GameMap | undefined {
  return MAPS[id];
}

/** 获取所有地图列表 */
export function getAllMaps(): GameMap[] {
  return Object.values(MAPS);
}

/** 获取区域地图列表 */
export function getMapsByRegion(region: string): GameMap[] {
  return Object.values(MAPS).filter(m => m.region === region);
}

/** 获取区域名称 */
export function getRegionName(region: string): string {
  const regionNames: Record<string, string> = {
    newbie: '新手村',
    changan: '长安城',
    datang: '东土大唐',
    gaolao: '高老庄',
    fangcun: '方寸山',
    donghai: '东海',
    xianyang: '咸阳',
  };
  return regionNames[region] || region;
}
