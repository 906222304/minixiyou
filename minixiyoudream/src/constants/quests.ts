// 任务配置 - 梦幻西游风格剧情系统（复刻自xiyou项目）

import type { Quest, QuestChapter, DialogLine } from '@/types/quest';

/** 章节配置 */
export const QUEST_CHAPTERS: QuestChapter[] = [
  {
    id: 1,
    name: '初入江湖',
    description: '踏入西游世界的第一步，从东海村开始冒险',
    icon: '🌊',
    questIds: ['main_1_1', 'main_1_2', 'main_1_3', 'main_1_4', 'main_1_5', 'main_1_6'],
  },
  {
    id: 2,
    name: '长安风云',
    description: '来到繁华的长安城，邂逅各路豪杰',
    icon: '🏯',
    questIds: ['main_2_1', 'main_2_2', 'main_2_3', 'main_2_4', 'main_2_5', 'main_2_6'],
  },
  {
    id: 3,
    name: '仙法奇缘',
    description: '得遇仙人传授法术，踏上修行之路',
    icon: '✨',
    questIds: ['main_3_1', 'main_3_2', 'main_3_3', 'main_3_4', 'main_3_5'],
  },
  {
    id: 4,
    name: '红颜知己',
    description: '与清清姑娘结下不解之缘',
    icon: '💕',
    questIds: ['main_4_1', 'main_4_2', 'main_4_3', 'main_4_4', 'main_4_5'],
  },
  {
    id: 5,
    name: '比武招亲',
    description: '振远镖局比武招亲，卷入一场江湖风波',
    icon: '⚔️',
    questIds: ['main_5_1', 'main_5_2', 'main_5_3', 'main_5_4', 'main_5_5'],
  },
  {
    id: 6,
    name: '妖塔迷踪',
    description: '大雁塔中妖魔作乱，踏上降妖之路',
    icon: '🗼',
    questIds: ['main_6_1', 'main_6_2', 'main_6_3', 'main_6_4', 'main_6_5'],
  },
  {
    id: 7,
    name: '方寸问道',
    description: '方寸山寻访道长，揭开千年之谜',
    icon: '⛰️',
    questIds: ['main_7_1', 'main_7_2', 'main_7_3', 'main_7_4', 'main_7_5'],
  },
  {
    id: 8,
    name: '西域风云',
    description: '远赴西域追寻清清，揭开身世之谜',
    icon: '🏜️',
    questIds: ['main_8_1', 'main_8_2', 'main_8_3', 'main_8_4'],
  },
];

// ==================== 第一章：初入江湖 ====================

/** 村长对话 */
const villageChiefDialog1: DialogLine[] = [
  { speaker: '村长', text: '欢迎你，年轻人！我是这个村子的村长。', portrait: '👴', position: 'left' },
  { speaker: '村长', text: '最近村子外沙滩上出现了很多具有攻击性的螃蟹，村民们都很担心。', portrait: '👴', position: 'left' },
  { speaker: '你', text: '村长，有什么我可以帮忙的吗？', portrait: '👤', position: 'right' },
  { speaker: '村长', text: '年轻人，你能帮我除掉一些螃蟹吗？记得先使用新手礼包，戴上装备再去！', portrait: '👴', position: 'left' },
];

/** 村长任务完成对话 */
const crabCompleteDialog: DialogLine[] = [
  { speaker: '村长', text: '干得漂亮！你果然是个有潜力的年轻人。', portrait: '👴', position: 'left' },
  { speaker: '村长', text: '不过...潮水洞穴深处似乎还有更大的威胁。你愿意去巡视一下吗？', portrait: '👴', position: 'left' },
  { speaker: '你', text: '没问题，村长！我这就去看看。', portrait: '👤', position: 'right' },
];

/** 发现蟹精对话 */
const crabSpiritDialog: DialogLine[] = [
  { speaker: '旁白', text: '你在洞穴深处发现了一只巨大的蟹精！', portrait: '📖' },
  { speaker: '你', text: '不好！这只蟹精已经成精了，必须赶快向村长报告！', portrait: '👤', position: 'right' },
];

/** 击败蟹精对话 */
const crabSpiritDefeatedDialog: DialogLine[] = [
  { speaker: '村长', text: '小伙子年轻有为，果然不负众望！', portrait: '👴', position: 'left' },
  { speaker: '村长', text: '这里有些银两，还有一封信。你带着船票去码头找船夫，让他带你到外面的世界历练。', portrait: '👴', position: 'left' },
  { speaker: '村长', text: '这封信交给长安城的店小二，他看到信会帮你的！', portrait: '👴', position: 'left' },
  { speaker: '你', text: '谢谢村长！我一定不会让您失望的！', portrait: '👤', position: 'right' },
];

// ==================== 第二章：长安风云 ====================

/** 店小二对话 */
const shopAssistantDialog1: DialogLine[] = [
  { speaker: '店小二', text: '虽然你是村长介绍来的，不过也要自食其力。', portrait: '🧑', position: 'left' },
  { speaker: '店小二', text: '你就帮我招呼下客人，挣点零花钱吧！手脚麻利点，别偷懒！', portrait: '🧑', position: 'left' },
  { speaker: '你', text: '好的，小二哥！', portrait: '👤', position: 'right' },
];

/** 黑衣客人对话 */
const blackGuestDialog: DialogLine[] = [
  { speaker: '黑衣客商', text: '小二！给我们两间上好客房！没有我们的吩咐，不许有人打扰！', portrait: '🎭', position: 'left' },
  { speaker: '你', text: '是...这容易，小的马上照办！', portrait: '👤', position: 'right' },
  { speaker: '黑衣客人', text: '很好！往后这几天，只要你乖乖听我们的话办事，赏银不会少你的。', portrait: '🎭', position: 'left' },
];

/** 醉道士对话 */
const drunkTaoistDialog: DialogLine[] = [
  { speaker: '店小二', text: '快把门口那个臭要饭的赶走，免得妨碍我们做生意！', portrait: '🧑', position: 'left' },
  { speaker: '你', text: '去去去！没钱给你！', portrait: '👤', position: 'right' },
  { speaker: '醉道士', text: '我不是要钱，我只想讨些酒喝！小兄弟，拜托一下，给我一点酒吧！', portrait: '🧙', position: 'left' },
];

/** 赐酒给醉道士 */
const giveWineDialog: DialogLine[] = [
  { speaker: '你', text: '看你可怜，就给你喝一口吧！喂！只能喝一口喔！', portrait: '👤', position: 'right' },
  { speaker: '醉道士', text: '（拿起酒一饮而尽）啊...好酒！', portrait: '🧙', position: 'left' },
  { speaker: '你', text: '哎呀...你怎么喝光了！', portrait: '👤', position: 'right' },
  { speaker: '醉道士', text: '嗝~我一口就是那么大口，真是不好意思。你不是很想学仙法吗？看在酒的份上，贫道可以破例指点你几招！', portrait: '🧙', position: 'left' },
];

/** 学仙法对话 */
const learnMagicDialog: DialogLine[] = [
  { speaker: '醉道士', text: '今晚三更城南荒野，不见不散！', portrait: '🧙', position: 'left' },
  { speaker: '你', text: '真的要教我仙法？太好了！我一定准时赴约！', portrait: '👤', position: 'right' },
];

// ==================== 第三章：仙法奇缘 ====================

/** 城南荒野学法 */
const learnMagicNightDialog: DialogLine[] = [
  { speaker: '醉道士', text: '哈哈哈！小伙子你果然守信。', portrait: '🧙', position: 'left' },
  { speaker: '你', text: '前辈！请您收我为徒！', portrait: '👤', position: 'right' },
  { speaker: '醉道士', text: '贫道一向漂泊惯了，不想收徒弟。不过我可以教你几招仙法要诀，算是回报你赐酒之恩。仔细看清楚了！', portrait: '🧙', position: 'left' },
  { speaker: '旁白', text: '醉道士捏个手决，以气御力，指尖激出一道金光！在空中飞旋，瞬间分作数十条，忽又合为一体！只听轰的一声，远处巨石已被击得粉碎...', portrait: '📖' },
  { speaker: '醉道士', text: '以无限为有限，以无法为有法，修仙得道之路，不进则退！我教你的几招仙法，助你固本培元，你好生练习，便可一生受用无穷。', portrait: '🧙', position: 'left' },
];

/** 学成归来 */
const magicLearnedDialog: DialogLine[] = [
  { speaker: '旁白', text: '你按醉道士所教，将法术演练了几遍，忽然觉得仿佛有一道清泉贯彻全身...', portrait: '📖' },
  { speaker: '你', text: '哇...已经天亮了！糟了，回去又要挨骂了！', portrait: '👤', position: 'right' },
  { speaker: '旁白', text: '【学会了排山倒海技能】', portrait: '📖', effect: 'flash' },
];

// ==================== 第四章：红颜知己 ====================

/** 发现清清 */
const findQingqingDialog: DialogLine[] = [
  { speaker: '旁白', text: '你偷偷摸摸地溜进睡房，打开布袋...', portrait: '📖' },
  { speaker: '你', text: '哇！是位大姑娘...清清！？你怎么在这里？', portrait: '👤', position: 'right' },
  { speaker: '清清', text: '师父...我要回去救师父！', portrait: '👧', position: 'left' },
  { speaker: '你', text: '嘘~小声点...那些黑衣人为什么要抓你？', portrait: '👤', position: 'right' },
  { speaker: '清清', text: '师父受了重伤，我好担心...求求你带我回仙泉，师父就快死了...', portrait: '👧', position: 'left' },
];

/** 婆婆临终 */
const grandmaDeathDialog: DialogLine[] = [
  { speaker: '婆婆', text: '唉...十年了...终究躲不过。清清...师父...不能再保护你了...', portrait: '👵', position: 'left' },
  { speaker: '清清', text: '不要...清清不要...您要是死了，您叫清清怎么办？', portrait: '👧', position: 'left' },
  { speaker: '婆婆', text: '小伙子...以后清清就托付给你了。你要好好保护她...', portrait: '👵', position: 'left' },
  { speaker: '你', text: '婆婆您放心...我一定会照顾好清清的！', portrait: '👤', position: 'right' },
  { speaker: '婆婆', text: '还有...你要带清清回西域故乡，找到她娘亲的下落...', portrait: '👵', position: 'left' },
  { speaker: '旁白', text: '不等清清说完，师父便断气了...', portrait: '📖', effect: 'flash' },
];

/** 清清的誓言 */
const qingqingVowDialog: DialogLine[] = [
  { speaker: '清清', text: '师父~您在天有灵，保佑孩儿早日找到娘亲...清清...就此拜别...', portrait: '👧', position: 'left' },
  { speaker: '你', text: '清清...你以后有何打算？', portrait: '👤', position: 'right' },
  { speaker: '清清', text: '当然是...跟着你...', portrait: '👧', position: 'left' },
  { speaker: '你', text: '好吧！事到如今，走一步算一步。反正你也没地方去了，先跟我一起吧。', portrait: '👤', position: 'right' },
];

// ==================== 第五章：比武招亲 ====================

/** 比武招亲开始 */
const martialArtsDialog: DialogLine[] = [
  { speaker: '萧升', text: '诸位乡亲~今日小女的比武招亲终于有了结果，多谢诸位乡亲共襄盛举！', portrait: '👨', position: 'left' },
  { speaker: '萧晓月', text: '爹~！人家才不依呢...', portrait: '👩', position: 'left' },
  { speaker: '萧升', text: '哈哈哈！难得~难得~想不到月儿也会害臊！小伙子，还愣在那干什么？跟着月儿去呀！', portrait: '👨', position: 'left' },
  { speaker: '你', text: '我！？...为什么？', portrait: '👤', position: 'right' },
  { speaker: '萧升', text: '还装傻！？比武招亲擂台之上你既胜了月儿，自然就是我萧家的女婿了！', portrait: '👨', position: 'left' },
];

/** 拒婚对话 */
const rejectMarriageDialog: DialogLine[] = [
  { speaker: '你', text: '我与令嫒略有误会，才上擂台比试，招亲这...这事还请前辈三思！', portrait: '👤', position: 'right' },
  { speaker: '萧升', text: '难道少侠嫌弃小女？', portrait: '👨', position: 'left' },
  { speaker: '你', text: '不敢！不敢！只是婚姻大事并非儿戏，晚辈不敢轻言承诺，只怕辜负了小姐。', portrait: '👤', position: 'right' },
  { speaker: '清清', text: '如果...你...我...可以自己去找娘亲~你不必顾虑我...', portrait: '👧', position: 'left' },
  { speaker: '你', text: '这怎么行！说好的要带你去西域找妈妈，怎能轻食诺言！', portrait: '👤', position: 'right' },
];

// ==================== 第六章：妖塔迷踪 ====================

/** 大雁塔发现 */
const pagodaDiscoveryDialog: DialogLine[] = [
  { speaker: '萧晓月', text: '前面不远处有座慈恩寺~听说寺内大雁塔上常有妖怪出没，有不少少女被掳到塔中下落不明！', portrait: '👩', position: 'left' },
  { speaker: '你', text: '那清清会不会被抓到那里去了？', portrait: '👤', position: 'right' },
  { speaker: '萧晓月', text: '很有可能！我爹曾多次招募志士进入塔内除妖，可是都没有成功。我们快去看看！', portrait: '👩', position: 'left' },
];

/** 战蛇妖 */
const snakeDemonDialog: DialogLine[] = [
  { speaker: '蛇妖男', text: '你们闯进我的地盘来做什么？', portrait: '🐍', position: 'left' },
  { speaker: '你', text: '你就是那只蛇妖！？把清清还我！', portrait: '👤', position: 'right' },
  { speaker: '蛇妖男', text: '谁是清清？', portrait: '🐍', position: 'left' },
  { speaker: '你', text: '废话少说~再不交出人就吃我一剑！', portrait: '👤', position: 'right' },
  { speaker: '蛇妖男', text: '黄毛小子！敢口出狂言~今天定叫你有来无回！', portrait: '🐍', position: 'left' },
];

/** 救出少女 */
const rescueGirlsDialog: DialogLine[] = [
  { speaker: '萧晓月', text: '这里果然有很多被抓来的女孩子！', portrait: '👩', position: 'left' },
  { speaker: '晓慧', text: '是啊~我们都是被妖怪抓来的！谢谢恩公相救！', portrait: '👧', position: 'left' },
  { speaker: '你', text: '清清呢？你们有没有看到一个叫清清的姑娘？', portrait: '👤', position: 'right' },
  { speaker: '晓慧', text: '没有...我们这里没有一个叫清清的。', portrait: '👧', position: 'left' },
  { speaker: '你', text: '那...会是谁抓走了清清？', portrait: '👤', position: 'right' },
];

// ==================== 第七章：方寸问道 ====================

/** 方寸山寻道 */
const fangcunMountainDialog: DialogLine[] = [
  { speaker: '扫地小童', text: '知者不言...言者不知...', portrait: '🧒', position: 'left' },
  { speaker: '你', text: '小道长~请问清风道长在吗？', portrait: '👤', position: 'right' },
  { speaker: '扫地小童', text: '道可道...非常道...', portrait: '🧒', position: 'left' },
  { speaker: '清清', text: '我总觉得这间寺庙四周似乎...有股妖气。', portrait: '👧', position: 'left' },
  { speaker: '你', text: '妖气？怎么可能！这里可是道家清修之地呢？', portrait: '👤', position: 'right' },
];

/** 清风道长真面目 */
const qingfengTruthDialog: DialogLine[] = [
  { speaker: '清风道长', text: '贫道是道家清修之人，从不过问外界之俗事，三位请回吧！', portrait: '🧙', position: 'left' },
  { speaker: '你', text: '道长此言差矣，出家人降魔卫道本天经地义，何以是外界的俗事呢？', portrait: '👤', position: 'right' },
  { speaker: '清风道长', text: '既然施主答应了替贫道做一件事，贫道就答应你下山收妖！', portrait: '🧙', position: 'left' },
  { speaker: '清风道长', text: '替你焚香更衣啊！你得在我这出家当道士！', portrait: '🧙', position: 'left' },
  { speaker: '三人齐声', text: '哪有这种事！？', portrait: '📖', position: 'left' },
];

/** 晓风真身 */
const xiaofengTruthDialog: DialogLine[] = [
  { speaker: '清清', text: '原来清风道长是假的！', portrait: '👧', position: 'left' },
  { speaker: '晓风', text: '我乃菩提老祖所戴玉佩所化~已经修行九百九十九年了。', portrait: '🧒', position: 'left' },
  { speaker: '清清', text: '既然你已有千年的道行，就应该潜心修炼，求天师之道！为何自甘堕落，迫害村民？', portrait: '👧', position: 'left' },
  { speaker: '晓风', text: '呜...从来都没有人教过我这些道理，求求菩萨收我当弟子...', portrait: '🧒', position: 'left' },
  { speaker: '清清', text: '好吧...既然你有心...从今以后，你就跟着我吧。你就叫做小丸吧！', portrait: '👧', position: 'left' },
];

// ==================== 第八章：西域风云 ====================

/** 天法国绑架 */
const tianfaguoKidnapDialog: DialogLine[] = [
  { speaker: '吴文', text: '不好了~霜儿被抓走了！', portrait: '👨', position: 'left' },
  { speaker: '你', text: '是谁干的？', portrait: '👤', position: 'right' },
  { speaker: '吴文', text: '那带头的人自称是天法国的长老，他说~如果要霜儿平安，就要清姑娘自己一个人到长安城内的兵马俑阵~', portrait: '👨', position: 'left' },
  { speaker: '清清', text: '他们的目的是我，不会对霜儿姐姐不利的！', portrait: '👧', position: 'left' },
  { speaker: '你', text: '那当然！这次我一定要把他们全部打回老家，永远不敢再来烦你！', portrait: '👤', position: 'right' },
];

/** 项长老对话 */
const elderXiangDialog: DialogLine[] = [
  { speaker: '项长老', text: '殿下~老臣得罪了。', portrait: '👴', position: 'left' },
  { speaker: '清清', text: '如果你们敢伤害他，我...我就立刻自尽！', portrait: '👧', position: 'left' },
  { speaker: '项长老', text: '这万万不可~大王可是一直盼着能见到失散十年的亲生女儿最后一面啊。', portrait: '👴', position: 'left' },
  { speaker: '清清', text: '最后一面...？', portrait: '👧', position: 'left' },
  { speaker: '项长老', text: '巫王陛下得了重病，已经没有多少日子了。希望您念在父女情份上回到他身边。', portrait: '👴', position: 'left' },
];

/** 清清离别 */
const qingqingDepartureDialog: DialogLine[] = [
  { speaker: '清清', text: '好...放了他们，我就跟你们走...', portrait: '👧', position: 'left' },
  { speaker: '项长老', text: '公主殿下睿智！', portrait: '👴', position: 'left' },
  { speaker: '旁白', text: '菩提玉随着清清离去...', portrait: '📖' },
  { speaker: '你', text: '我不会让她离开我的！我一定要找到清清！', portrait: '👤', position: 'right' },
  { speaker: '萧晓月', text: '呆瓜小贼~我也跟你一起去！', portrait: '👩', position: 'left' },
];

/** 任务列表 */
export const QUESTS: Quest[] = [
  // ===== 第一章：初入江湖 =====
  {
    id: 'main_1_1',
    name: '初来乍到',
    description: '创建角色后自动完成，开始你的冒险之旅',
    type: 'main',
    chapter: 1,
    icon: '🌟',
    levelRequired: 1,
    conditions: [],
    rewards: {
      gold: 100,
      exp: 50,
      items: [{ itemId: 'item_hp_potion_small', count: 5 }],
    },
    startDialog: [
      { speaker: '旁白', text: '在这个神秘的世界里，一个新的传奇即将诞生...', portrait: '📖' },
      { speaker: '旁白', text: '你睁开眼睛，发现自己身处一个宁静的海边小村庄——东海村。', portrait: '📖' },
      { speaker: '你', text: '这里...是哪里？我感觉好像忘记了一些事情...', portrait: '👤', position: 'right' },
      { speaker: '旁白', text: '虽然记忆模糊，但你感受到体内蕴藏的力量，一段新的冒险即将开始！', portrait: '📖', effect: 'flash' },
    ],
    autoAccept: true,
    order: 1,
  },
  {
    id: 'main_1_2',
    name: '村长的请求',
    description: '与村长对话，帮助解决村外的螃蟹威胁',
    type: 'main',
    chapter: 1,
    icon: '👴',
    levelRequired: 1,
    prerequisites: ['main_1_1'],
    conditions: [
      { type: 'talk', target: 'npc_village_chief', required: 1, description: '与村长对话' },
    ],
    rewards: { gold: 50, exp: 30, items: [{ itemId: 'item_hp_potion_small', count: 2 }] },
    startDialog: villageChiefDialog1,
    hints: ['村长在村庄中央'],
    location: { mapId: 'map_donghai_village', npcId: 'npc_village_chief' },
    order: 2,
  },
  {
    id: 'main_1_3',
    name: '清除螃蟹',
    description: '击败8只螃蟹，保护村庄安全',
    type: 'main',
    chapter: 1,
    icon: '🦀',
    levelRequired: 1,
    prerequisites: ['main_1_2'],
    conditions: [
      { type: 'kill', target: 'enemy_crab', required: 8, description: '击败螃蟹 (0/8)' },
    ],
    rewards: { gold: 100, exp: 100, items: [{ itemId: 'item_hp_potion_small', count: 3 }] },
    completeDialog: crabCompleteDialog,
    hints: ['螃蟹在村外的沙滩上出没'],
    order: 3,
  },
  {
    id: 'main_1_4',
    name: '洞穴巡视',
    description: '前往潮水洞穴巡视，查看是否有更大的威胁',
    type: 'main',
    chapter: 1,
    icon: '🕳️',
    levelRequired: 2,
    prerequisites: ['main_1_3'],
    conditions: [
      { type: 'visit_map', target: 'map_tidal_cave', required: 1, description: '进入潮水洞穴' },
    ],
    rewards: { gold: 80, exp: 80, items: [{ itemId: 'item_mp_potion_small', count: 2 }] },
    hints: ['潮水洞穴在村外东侧'],
    order: 4,
  },
  {
    id: 'main_1_5',
    name: '蟹精之患',
    description: '击败洞穴中的蟹精，彻底消除威胁',
    type: 'main',
    chapter: 1,
    icon: '🦞',
    levelRequired: 3,
    prerequisites: ['main_1_4'],
    conditions: [
      { type: 'kill', target: 'enemy_crab_spirit', required: 1, description: '击败蟹精 (0/1)' },
    ],
    rewards: {
      gold: 200,
      exp: 200,
      items: [
        { itemId: 'item_village_letter', count: 1 },
        { itemId: 'item_enhance_stone', count: 2 },
      ],
    },
    startDialog: crabSpiritDialog,
    completeDialog: crabSpiritDefeatedDialog,
    hints: ['蟹精在潮水洞穴深处'],
    order: 5,
  },
  {
    id: 'main_1_6',
    name: '踏上旅途',
    description: '带着村长的信，前往长安城开始新的冒险',
    type: 'main',
    chapter: 1,
    icon: '🚢',
    levelRequired: 3,
    prerequisites: ['main_1_5'],
    conditions: [
      { type: 'visit_map', target: 'map_changan', required: 1, description: '到达长安城' },
    ],
    rewards: {
      gold: 150,
      exp: 150,
      unlocks: { maps: ['map_changan'] },
      items: [{ itemId: 'item_exp_pill_small', count: 3 }],
    },
    hints: ['从码头乘坐船只前往长安城'],
    order: 6,
  },

  // ===== 第二章：长安风云 =====
  {
    id: 'main_2_1',
    name: '客栈小伙计',
    description: '将村长的信交给南城客栈的店小二',
    type: 'main',
    chapter: 2,
    icon: '🏨',
    levelRequired: 3,
    prerequisites: ['main_1_6'],
    conditions: [
      { type: 'talk', target: 'npc_shop_assistant', required: 1, description: '与店小二对话' },
    ],
    rewards: { gold: 100, exp: 100 },
    startDialog: shopAssistantDialog1,
    hints: ['南城客栈在长安城内'],
    location: { mapId: 'map_nancheng_inn', npcId: 'npc_shop_assistant' },
    order: 7,
  },
  {
    id: 'main_2_2',
    name: '神秘客人',
    description: '为黑衣客人服务，探听他们的来历',
    type: 'main',
    chapter: 2,
    icon: '🎭',
    levelRequired: 3,
    prerequisites: ['main_2_1'],
    conditions: [
      { type: 'talk', target: 'npc_black_guest', required: 1, description: '与黑衣客人对话' },
    ],
    rewards: { gold: 150, exp: 120 },
    startDialog: blackGuestDialog,
    hints: ['黑衣客人在客栈睡房'],
    order: 8,
  },
  {
    id: 'main_2_3',
    name: '醉道士',
    description: '处理门口的醉道士，他会给你意想不到的收获',
    type: 'main',
    chapter: 2,
    icon: '🧙',
    levelRequired: 4,
    prerequisites: ['main_2_2'],
    conditions: [
      { type: 'talk', target: 'npc_drunk_taoist', required: 1, description: '与醉道士对话' },
    ],
    rewards: { gold: 50, exp: 80 },
    startDialog: drunkTaoistDialog,
    hints: ['醉道士在客栈门口'],
    order: 9,
  },
  {
    id: 'main_2_4',
    name: '桂花酒',
    description: '将桂花酒给醉道士，获得他的指点',
    type: 'main',
    chapter: 2,
    icon: '🍶',
    levelRequired: 4,
    prerequisites: ['main_2_3'],
    conditions: [
      { type: 'talk', target: 'npc_drunk_taoist', required: 1, description: '将桂花酒给醉道士' },
    ],
    rewards: { gold: 100, exp: 150 },
    startDialog: giveWineDialog,
    order: 10,
  },
  {
    id: 'main_2_5',
    name: '深夜之约',
    description: '在三更时分前往城南荒野，学习仙法',
    type: 'main',
    chapter: 2,
    icon: '🌙',
    levelRequired: 5,
    prerequisites: ['main_2_4'],
    conditions: [
      { type: 'visit_map', target: 'map_chengnan_wasteland', required: 1, description: '前往城南荒野' },
    ],
    rewards: { gold: 100, exp: 100 },
    startDialog: learnMagicDialog,
    hints: ['城南荒野在长安城外南方'],
    order: 11,
  },
  {
    id: 'main_2_6',
    name: '仙法传承',
    description: '向醉道士学习仙法要诀',
    type: 'main',
    chapter: 2,
    icon: '✨',
    levelRequired: 5,
    prerequisites: ['main_2_5'],
    conditions: [
      { type: 'talk', target: 'npc_drunk_taoist', required: 1, description: '学习仙法' },
    ],
    rewards: {
      gold: 200,
      exp: 300,
      unlocks: { features: ['skill_push_mountain'] }
    },
    startDialog: learnMagicNightDialog,
    completeDialog: magicLearnedDialog,
    order: 12,
  },

  // ===== 第三章：仙法奇缘 =====
  {
    id: 'main_3_1',
    name: '客栈风波',
    description: '回到南城客栈，发现客栈出了大事',
    type: 'main',
    chapter: 3,
    icon: '⚠️',
    levelRequired: 5,
    prerequisites: ['main_2_6'],
    conditions: [
      { type: 'talk', target: 'npc_shop_assistant', required: 1, description: '与店小二对话' },
    ],
    rewards: { gold: 100, exp: 100 },
    startDialog: [
      { speaker: '店小二', text: '唉呀！你死哪里去了！不知怎么回事，客栈里好多客人中毒了！快出人命了！', portrait: '🧑', position: 'left' },
      { speaker: '你', text: '啊！？', portrait: '👤', position: 'right' },
    ],
    order: 13,
  },
  {
    id: 'main_3_2',
    name: '寻药救人',
    description: '去药店找杨中顺，为中毒的客人求取解药',
    type: 'main',
    chapter: 3,
    icon: '💊',
    levelRequired: 5,
    prerequisites: ['main_3_1'],
    conditions: [
      { type: 'talk', target: 'npc_pharmacist', required: 1, description: '与药铺掌柜对话' },
    ],
    rewards: { gold: 100, exp: 100 },
    startDialog: [
      { speaker: '杨中顺', text: '这些人中的毒很奇怪，老夫也从未见过。事不宜迟，老夫这就回去配药！', portrait: '👨', position: 'left' },
      { speaker: '杨中顺', text: '不过这偏方药引不好找！需要5个动物碎齿。', portrait: '👨', position: 'left' },
    ],
    location: { mapId: 'map_changan', npcId: 'npc_pharmacist' },
    order: 14,
  },
  {
    id: 'main_3_3',
    name: '收集药引',
    description: '收集5个动物碎齿交给药铺掌柜',
    type: 'main',
    chapter: 3,
    icon: '🦷',
    levelRequired: 5,
    prerequisites: ['main_3_2'],
    conditions: [
      { type: 'collect', target: 'item_animal_tooth', required: 5, description: '收集动物碎齿 (0/5)' },
    ],
    rewards: { gold: 150, exp: 150 },
    hints: ['动物碎齿可以从大老鼠身上获得'],
    order: 15,
  },
  {
    id: 'main_3_4',
    name: '仙泉求露',
    description: '前往仙泉，向仙子求取仙露救人',
    type: 'main',
    chapter: 3,
    icon: '💧',
    levelRequired: 6,
    prerequisites: ['main_3_3'],
    conditions: [
      { type: 'visit_map', target: 'map_xianquan', required: 1, description: '到达仙泉' },
    ],
    rewards: { gold: 150, exp: 200 },
    startDialog: [
      { speaker: '杨中顺', text: '听说仙泉中常有仙子出现，赐凡人仙露以解危难！你不妨去试试！', portrait: '👨', position: 'left' },
      { speaker: '你', text: '好！我这就去！', portrait: '👤', position: 'right' },
    ],
    hints: ['仙泉在望南街过去的曲江池边'],
    order: 16,
  },
  {
    id: 'main_3_5',
    name: '药到病除',
    description: '将仙露带给药铺掌柜配制解药，救治中毒的客人',
    type: 'main',
    chapter: 3,
    icon: '🌿',
    levelRequired: 6,
    prerequisites: ['main_3_4'],
    conditions: [
      { type: 'talk', target: 'npc_pharmacist', required: 1, description: '将仙露交给杨中顺' },
      { type: 'talk', target: 'npc_shop_assistant', required: 1, description: '将解药带回客栈' },
    ],
    rewards: { gold: 300, exp: 300 },
    startDialog: [
      { speaker: '杨中顺', text: '造化~造化！这些人的性命有救了！我这就配药！', portrait: '👨', position: 'left' },
      { speaker: '你', text: '嘿嘿~', portrait: '👤', position: 'right' },
    ],
    completeDialog: [
      { speaker: '店小二', text: '多亏有你帮忙！你也早点休息吧~', portrait: '🧑', position: 'left' },
      { speaker: '你', text: '好~', portrait: '👤', position: 'right' },
    ],
    order: 17,
  },

  // ===== 第四章：红颜知己 =====
  {
    id: 'main_4_1',
    name: '神秘少女',
    description: '在客栈睡房发现被绑架的清清姑娘',
    type: 'main',
    chapter: 4,
    icon: '👧',
    levelRequired: 6,
    prerequisites: ['main_3_5'],
    conditions: [
      { type: 'talk', target: 'npc_qingqing', required: 1, description: '与清清对话' },
    ],
    rewards: { gold: 150, exp: 200 },
    startDialog: findQingqingDialog,
    hints: ['清清被关在客栈睡房'],
    order: 18,
  },
  {
    id: 'main_4_2',
    name: '黑衣人之战',
    description: '击败黑衣大汉，保护清清',
    type: 'main',
    chapter: 4,
    icon: '⚔️',
    levelRequired: 7,
    prerequisites: ['main_4_1'],
    conditions: [
      { type: 'kill', target: 'enemy_black_guards', required: 3, description: '击败黑衣人 (0/3)' },
    ],
    rewards: { gold: 250, exp: 300 },
    startDialog: [
      { speaker: '黑衣大汉', text: '咱们天法国的事你最好别管！', portrait: '🎭', position: 'left' },
      { speaker: '你', text: '嘿~在我们客栈拐卖人口，我当然非管不可！', portrait: '👤', position: 'right' },
      { speaker: '黑衣大汉', text: '你找死！', portrait: '🎭', position: 'left' },
    ],
    order: 19,
  },
  {
    id: 'main_4_3',
    name: '仙泉送别',
    description: '将清清送回仙泉，却遭遇变故',
    type: 'main',
    chapter: 4,
    icon: '🙏',
    levelRequired: 7,
    prerequisites: ['main_4_2'],
    conditions: [
      { type: 'visit_map', target: 'map_xianquan', required: 1, description: '护送清清回仙泉' },
      { type: 'talk', target: 'npc_grandma', required: 1, description: '与婆婆对话' },
    ],
    rewards: { gold: 200, exp: 250 },
    startDialog: grandmaDeathDialog,
    order: 20,
  },
  {
    id: 'main_4_4',
    name: '掩埋婆婆',
    description: '帮助清清安葬师父，陪伴她度过难关',
    type: 'main',
    chapter: 4,
    icon: '🪦',
    levelRequired: 7,
    prerequisites: ['main_4_3'],
    conditions: [
      { type: 'talk', target: 'npc_qingqing', required: 1, description: '与清清对话' },
    ],
    rewards: { gold: 100, exp: 150 },
    startDialog: [
      { speaker: '清清', text: '师父~都怪清清不好，没有听您的话...', portrait: '👧', position: 'left' },
      { speaker: '你', text: '好了...别难过了，事已至此~我想你师父也不希望你一直这么伤心。', portrait: '👤', position: 'right' },
    ],
    order: 21,
  },
  {
    id: 'main_4_5',
    name: '新的开始',
    description: '清清决定跟随你，一起踏上冒险之旅',
    type: 'main',
    chapter: 4,
    icon: '🌅',
    levelRequired: 8,
    prerequisites: ['main_4_4'],
    conditions: [
      { type: 'talk', target: 'npc_qingqing', required: 1, description: '与清清对话' },
    ],
    rewards: { gold: 200, exp: 200 },
    startDialog: qingqingVowDialog,
    completeDialog: [
      { speaker: '旁白', text: '从此，清清成为了你的伙伴，一起踏上了冒险之旅。', portrait: '📖', effect: 'flash' },
    ],
    order: 22,
  },

  // ===== 第五章：比武招亲 =====
  {
    id: 'main_5_1',
    name: '城隍庙烧香',
    description: '带清清去城隍庙烧香许愿',
    type: 'main',
    chapter: 5,
    icon: '⛩️',
    levelRequired: 8,
    prerequisites: ['main_4_5'],
    conditions: [
      { type: 'visit_map', target: 'map_chenghuang_temple', required: 1, description: '前往城隍庙' },
    ],
    rewards: { gold: 150, exp: 150 },
    hints: ['城隍庙在歪柳巷'],
    order: 23,
  },
  {
    id: 'main_5_2',
    name: '萧晓月',
    description: '在城隍庙遇到野蛮的萧晓月',
    type: 'main',
    chapter: 5,
    icon: '👩',
    levelRequired: 8,
    prerequisites: ['main_5_1'],
    conditions: [
      { type: 'talk', target: 'npc_xiao_xiaoyue', required: 1, description: '与萧晓月对话' },
    ],
    rewards: { gold: 100, exp: 100 },
    startDialog: [
      { speaker: '旁白', text: '一个穿着阔气的野蛮丫头正拿着鞭子抽打两个被吊在树上的人...', portrait: '📖' },
      { speaker: '你', text: '这位大姐，他们俩犯了什么错为什么要这样打他们？', portrait: '👤', position: 'right' },
      { speaker: '萧晓月', text: '这两人是咱们家的丫环和长工，暗通款曲想要私奔！现在让我撞见了就该受罚！', portrait: '👩', position: 'left' },
    ],
    order: 24,
  },
  {
    id: 'main_5_3',
    name: '比武招亲',
    description: '振远镖局举办比武招亲，萧升邀请你参加',
    type: 'main',
    chapter: 5,
    icon: '🏆',
    levelRequired: 9,
    prerequisites: ['main_5_2'],
    conditions: [
      { type: 'visit_map', target: 'map_zhenyuan_biaoju', required: 1, description: '前往振远镖局' },
    ],
    rewards: { gold: 200, exp: 200 },
    startDialog: martialArtsDialog,
    hints: ['振远镖局在长安城内'],
    order: 25,
  },
  {
    id: 'main_5_4',
    name: '擂台比武',
    description: '在擂台上击败萧晓月',
    type: 'main',
    chapter: 5,
    icon: '🥊',
    levelRequired: 10,
    prerequisites: ['main_5_3'],
    conditions: [
      { type: 'kill', target: 'enemy_xiao_xiaoyue', required: 1, description: '击败萧晓月 (0/1)' },
    ],
    rewards: { gold: 500, exp: 500 },
    startDialog: [
      { speaker: '萧晓月', text: '呆瓜小贼~看招~', portrait: '👩', position: 'left' },
      { speaker: '你', text: '得罪了！', portrait: '👤', position: 'right' },
    ],
    completeDialog: [
      { speaker: '萧晓月', text: '我认输了...', portrait: '👩', position: 'left' },
      { speaker: '你', text: '承让~', portrait: '👤', position: 'right' },
    ],
    order: 26,
  },
  {
    id: 'main_5_5',
    name: '婚事风波',
    description: '萧升想要你入赘萧家，但你心中挂念着清清',
    type: 'main',
    chapter: 5,
    icon: '💍',
    levelRequired: 10,
    prerequisites: ['main_5_4'],
    conditions: [
      { type: 'talk', target: 'npc_xiao_sheng', required: 1, description: '与萧升对话' },
    ],
    rewards: { gold: 300, exp: 300 },
    startDialog: rejectMarriageDialog,
    order: 27,
  },

  // ===== 第六章：妖塔迷踪 =====
  {
    id: 'main_6_1',
    name: '狐妖之祸',
    description: '镇远镖局遭遇狐妖袭击，清清失踪',
    type: 'main',
    chapter: 6,
    icon: '🦊',
    levelRequired: 10,
    prerequisites: ['main_5_5'],
    conditions: [
      { type: 'talk', target: 'npc_xiao_sheng', required: 1, description: '与萧升对话' },
    ],
    rewards: { gold: 200, exp: 200 },
    startDialog: [
      { speaker: '萧升', text: '妖怪？竟敢在萧家堡作乱！', portrait: '👨', position: 'left' },
      { speaker: '萧晓月', text: '狐妖，是只半人半狐的妖怪，刚才就在西厢房里面！', portrait: '👩', position: 'left' },
      { speaker: '你', text: '清清！清清人呢？', portrait: '👤', position: 'right' },
      { speaker: '萧晓月', text: '清姑娘不见了！', portrait: '👩', position: 'left' },
    ],
    order: 28,
  },
  {
    id: 'main_6_2',
    name: '大雁塔寻人',
    description: '前往大雁塔寻找清清的下落',
    type: 'main',
    chapter: 6,
    icon: '🗼',
    levelRequired: 11,
    prerequisites: ['main_6_1'],
    conditions: [
      { type: 'visit_map', target: 'map_dayan_ta', required: 1, description: '进入大雁塔' },
    ],
    rewards: { gold: 200, exp: 250 },
    startDialog: pagodaDiscoveryDialog,
    hints: ['大雁塔在慈恩寺内'],
    order: 29,
  },
  {
    id: 'main_6_3',
    name: '斩杀蛇妖',
    description: '在大雁塔中击败蛇妖',
    type: 'main',
    chapter: 6,
    icon: '🐍',
    levelRequired: 12,
    prerequisites: ['main_6_2'],
    conditions: [
      { type: 'kill', target: 'enemy_snake_demon', required: 1, description: '击败蛇妖 (0/1)' },
    ],
    rewards: { gold: 400, exp: 400 },
    startDialog: snakeDemonDialog,
    order: 30,
  },
  {
    id: 'main_6_4',
    name: '狐妖女',
    description: '击败大雁塔中的狐妖女',
    type: 'main',
    chapter: 6,
    icon: '🦊',
    levelRequired: 13,
    prerequisites: ['main_6_3'],
    conditions: [
      { type: 'kill', target: 'enemy_fox_demon_female', required: 1, description: '击败狐妖女 (0/1)' },
    ],
    rewards: { gold: 500, exp: 500 },
    startDialog: [
      { speaker: '妖狐女', text: '你们...想干什么？', portrait: '🦊', position: 'left' },
      { speaker: '你', text: '清清呢？你们把她藏在哪里？', portrait: '👤', position: 'right' },
      { speaker: '妖狐女', text: '老娘这儿没有一个叫清清的！', portrait: '🦊', position: 'left' },
    ],
    completeDialog: rescueGirlsDialog,
    order: 31,
  },
  {
    id: 'main_6_5',
    name: '高家庄寻人',
    description: '在高家庄找到了清清',
    type: 'main',
    chapter: 6,
    icon: '🏠',
    levelRequired: 13,
    prerequisites: ['main_6_4'],
    conditions: [
      { type: 'visit_map', target: 'map_gaojia_zhuang', required: 1, description: '前往高家庄' },
      { type: 'talk', target: 'npc_qingqing', required: 1, description: '与清清对话' },
    ],
    rewards: { gold: 300, exp: 300 },
    startDialog: [
      { speaker: '小乞丐', text: '吴村长的女儿昨天救了一个外地女子！', portrait: '👦', position: 'left' },
      { speaker: '你', text: '一定是清清！快带我去！', portrait: '👤', position: 'right' },
    ],
    completeDialog: [
      { speaker: '你', text: '清清...！！', portrait: '👤', position: 'right' },
      { speaker: '清清', text: '你终于来了...', portrait: '👧', position: 'left' },
    ],
    order: 32,
  },

  // ===== 第七章：方寸问道 =====
  {
    id: 'main_7_1',
    name: '海妖之患',
    description: '高家庄饱受海妖肆虐，决定上山请道长除妖',
    type: 'main',
    chapter: 7,
    icon: '🌊',
    levelRequired: 14,
    prerequisites: ['main_6_5'],
    conditions: [
      { type: 'talk', target: 'npc_wu_wen', required: 1, description: '与吴村长对话' },
    ],
    rewards: { gold: 200, exp: 200 },
    startDialog: [
      { speaker: '吴文', text: '这附近一带的村子饱受海妖肆虐，能搬走的人都搬走了。', portrait: '👨', position: 'left' },
      { speaker: '你', text: '海妖一日不除，这里的居民还是永无宁日。我上山请道长下山除妖！', portrait: '👤', position: 'right' },
    ],
    order: 33,
  },
  {
    id: 'main_7_2',
    name: '方寸山寻道',
    description: '前往方寸山，拜访清风道长',
    type: 'main',
    chapter: 7,
    icon: '⛰️',
    levelRequired: 14,
    prerequisites: ['main_7_1'],
    conditions: [
      { type: 'visit_map', target: 'map_fangcun_mountain', required: 1, description: '前往方寸山' },
    ],
    rewards: { gold: 200, exp: 250 },
    startDialog: fangcunMountainDialog,
    order: 34,
  },
  {
    id: 'main_7_3',
    name: '道士阴谋',
    description: '发现清风道长的真面目',
    type: 'main',
    chapter: 7,
    icon: '😈',
    levelRequired: 15,
    prerequisites: ['main_7_2'],
    conditions: [
      { type: 'talk', target: 'npc_qingfeng_daoshi', required: 1, description: '与清风道长对话' },
    ],
    rewards: { gold: 250, exp: 300 },
    startDialog: qingfengTruthDialog,
    order: 35,
  },
  {
    id: 'main_7_4',
    name: '击败清风',
    description: '击败清风道长，揭开真相',
    type: 'main',
    chapter: 7,
    icon: '⚔️',
    levelRequired: 16,
    prerequisites: ['main_7_3'],
    conditions: [
      { type: 'kill', target: 'enemy_qingfeng_daoshi', required: 1, description: '击败清风道长 (0/1)' },
    ],
    rewards: { gold: 600, exp: 600 },
    completeDialog: xiaofengTruthDialog,
    order: 36,
  },
  {
    id: 'main_7_5',
    name: '赤血龙王',
    description: '前往东海海底莽林，消灭赤血龙王',
    type: 'main',
    chapter: 7,
    icon: '🐉',
    levelRequired: 17,
    prerequisites: ['main_7_4'],
    conditions: [
      { type: 'visit_map', target: 'map_donghai_seaforest', required: 1, description: '进入东海海底莽林' },
      { type: 'kill', target: 'enemy_red_blood_dragon', required: 1, description: '击败赤血龙王 (0/1)' },
    ],
    rewards: {
      gold: 1000,
      exp: 1000,
      items: [{ itemId: 'item_earth_spirit_bead', count: 1 }],
    },
    startDialog: [
      { speaker: '晓风', text: '赤血龙王就躲在那水底下的血池中，他用邪法操纵海妖吸食人血。', portrait: '🧒', position: 'left' },
      { speaker: '你', text: '这么邪恶的妖魔！我一定要消灭他！', portrait: '👤', position: 'right' },
    ],
    completeDialog: [
      { speaker: '清清', text: '原来...土灵珠在这妖怪身上！', portrait: '👧', position: 'left' },
      { speaker: '旁白', text: '【获得土灵珠】', portrait: '📖', effect: 'flash' },
    ],
    order: 37,
  },

  // ===== 第八章：西域风云 =====
  {
    id: 'main_8_1',
    name: '天法国绑架',
    description: '霜儿被天法国长老绑架，用来要挟清清',
    type: 'main',
    chapter: 8,
    icon: '⚠️',
    levelRequired: 18,
    prerequisites: ['main_7_5'],
    conditions: [
      { type: 'talk', target: 'npc_wu_wen', required: 1, description: '与吴村长对话' },
    ],
    rewards: { gold: 300, exp: 300 },
    startDialog: tianfaguoKidnapDialog,
    order: 38,
  },
  {
    id: 'main_8_2',
    name: '兵马俑阵',
    description: '前往兵马俑阵，与项长老对峙',
    type: 'main',
    chapter: 8,
    icon: '🗿',
    levelRequired: 19,
    prerequisites: ['main_8_1'],
    conditions: [
      { type: 'visit_map', target: 'map_bingmayong', required: 1, description: '进入兵马俑阵' },
      { type: 'kill', target: 'enemy_terracotta_warriors', required: 5, description: '击败兵马俑 (0/5)' },
    ],
    rewards: { gold: 500, exp: 500 },
    startDialog: [
      { speaker: '兵马俑', text: '来者何人？报上名来！', portrait: '🗿', position: 'left' },
      { speaker: '清清', text: '我就是清清！你们快将霜儿姐姐放了！', portrait: '👧', position: 'left' },
    ],
    order: 39,
  },
  {
    id: 'main_8_3',
    name: '公主殿下',
    description: '得知清清是西域公主的身世',
    type: 'main',
    chapter: 8,
    icon: '👸',
    levelRequired: 20,
    prerequisites: ['main_8_2'],
    conditions: [
      { type: 'talk', target: 'npc_elder_xiang', required: 1, description: '与项长老对话' },
    ],
    rewards: { gold: 400, exp: 400 },
    startDialog: elderXiangDialog,
    order: 40,
  },
  {
    id: 'main_8_4',
    name: '离别与重逢',
    description: '清清为了保护大家，决定跟随天法国的人离开，你发誓要找到她',
    type: 'main',
    chapter: 8,
    icon: '💔',
    levelRequired: 20,
    prerequisites: ['main_8_3'],
    conditions: [
      { type: 'talk', target: 'npc_qingqing', required: 1, description: '与清清对话' },
    ],
    rewards: { gold: 500, exp: 500 },
    startDialog: qingqingDepartureDialog,
    completeDialog: [
      { speaker: '旁白', text: '清清随天法国的人离开了，但你的冒险才刚刚开始...', portrait: '📖' },
      { speaker: '旁白', text: '西域，清清的故乡，还有更多的秘密等待你去揭开...', portrait: '📖' },
      { speaker: '旁白', text: '【主线任务，暂到此处，后续敬请期待！！！】', portrait: '📖', effect: 'flash' },
    ],
    order: 41,
  },

  // ===== 支线任务 =====
  {
    id: 'side_herb_collector',
    name: '草药收集者',
    description: '帮助药师收集10份草药',
    type: 'side',
    icon: '🌿',
    levelRequired: 2,
    conditions: [
      { type: 'collect', target: 'item_herb', required: 10, description: '收集草药 (0/10)' },
    ],
    rewards: {
      gold: 200,
      exp: 100,
      items: [
        { itemId: 'item_hp_potion_small', count: 5 },
        { itemId: 'item_mp_potion_small', count: 3 },
      ],
    },
    hints: ['草药可以通过战斗掉落或在地图上采集获得'],
    order: 100,
  },
  {
    id: 'side_monster_hunter',
    name: '怪物猎人',
    description: '累计击败50只怪物',
    type: 'side',
    icon: '🎯',
    levelRequired: 3,
    conditions: [
      { type: 'kill', target: 'any', required: 50, description: '击败任意怪物 (0/50)' },
    ],
    rewards: {
      gold: 500,
      exp: 300,
      items: [
        { itemId: 'item_enhance_stone', count: 3 },
        { itemId: 'item_exp_pill_small', count: 2 },
      ],
    },
    hints: ['持续战斗可以积累击杀数'],
    order: 101,
  },
  {
    id: 'side_explorer',
    name: '探索者',
    description: '访问5个不同的地图区域',
    type: 'side',
    icon: '🗺️',
    levelRequired: 3,
    conditions: [
      { type: 'visit_map', target: 'any', required: 5, description: '访问不同区域 (0/5)' },
    ],
    rewards: {
      gold: 300,
      exp: 200,
      unlocks: { features: ['teleport'] },
      items: [{ itemId: 'item_gold_bag_medium', count: 1 }],
    },
    hints: ['通过地图界面探索新的区域'],
    order: 102,
  },
  {
    id: 'side_material_collector',
    name: '材料收集者',
    description: '收集20个任意材料',
    type: 'side',
    icon: '📦',
    levelRequired: 5,
    conditions: [
      { type: 'collect', target: 'any_material', required: 20, description: '收集材料 (0/20)' },
    ],
    rewards: {
      gold: 400,
      exp: 250,
      items: [
        { itemId: 'item_reforge_stone', count: 2 },
        { itemId: 'item_treasure_box_bronze', count: 1 },
      ],
    },
    hints: ['材料可以从怪物掉落或采集获得'],
    order: 103,
  },
  {
    id: 'side_gem_hunter',
    name: '宝石猎人',
    description: '获得5颗宝石',
    type: 'side',
    icon: '💎',
    levelRequired: 10,
    conditions: [
      { type: 'collect', target: 'any_gem', required: 5, description: '获得宝石 (0/5)' },
    ],
    rewards: {
      gold: 800,
      exp: 500,
      items: [
        { itemId: 'item_enhance_stone_advanced', count: 3 },
        { itemId: 'item_treasure_box_silver', count: 1 },
      ],
    },
    hints: ['宝石可以从Boss掉落或合成获得'],
    order: 104,
  },

  // ===== 日常任务 =====
  {
    id: 'daily_kill_monsters',
    name: '日常狩猎',
    description: '每日击败10只怪物',
    type: 'daily',
    icon: '🗡️',
    levelRequired: 1,
    conditions: [
      { type: 'kill', target: 'any', required: 10, description: '击败任意怪物 (0/10)' },
    ],
    rewards: {
      gold: 100,
      exp: 50,
      items: [{ itemId: 'item_hp_potion_small', count: 2 }],
    },
    hints: ['每天都可以完成一次'],
    order: 200,
  },
  {
    id: 'daily_battle_3',
    name: '日常战斗',
    description: '每日完成3场战斗',
    type: 'daily',
    icon: '⚔️',
    levelRequired: 1,
    conditions: [
      { type: 'battle', target: 'any', required: 3, description: '完成战斗 (0/3)' },
    ],
    rewards: {
      gold: 80,
      exp: 40,
      items: [{ itemId: 'item_exp_pill_small', count: 1 }],
    },
    order: 201,
  },
  {
    id: 'daily_boss_challenge',
    name: '日常Boss挑战',
    description: '每日挑战一次Boss',
    type: 'daily',
    icon: '👹',
    levelRequired: 5,
    conditions: [
      { type: 'kill', target: 'boss', required: 1, description: '击败Boss (0/1)' },
    ],
    rewards: {
      gold: 200,
      exp: 100,
      items: [
        { itemId: 'item_enhance_stone', count: 1 },
        { itemId: 'item_gold_bag_small', count: 1 },
      ],
    },
    order: 202,
  },
  {
    id: 'daily_herb_gathering',
    name: '日常采药',
    description: '每日收集5份草药',
    type: 'daily',
    icon: '🌿',
    levelRequired: 2,
    conditions: [
      { type: 'collect', target: 'item_herb', required: 5, description: '收集草药 (0/5)' },
    ],
    rewards: {
      gold: 80,
      exp: 40,
      items: [{ itemId: 'item_hp_potion_small', count: 3 }],
    },
    order: 203,
  },
  {
    id: 'daily_capture_training',
    name: '精英狩猎',
    description: '每日击败5只精英怪物',
    type: 'daily',
    icon: '⚔️',
    levelRequired: 5,
    conditions: [
      { type: 'kill', target: 'elite', required: 5, description: '击败精英怪物 (0/5)' },
    ],
    rewards: {
      gold: 150,
      exp: 80,
      items: [{ itemId: 'item_enhance_stone', count: 2 }],
    },
    order: 204,
  },
];

/** 任务类型配置 */
export const QUEST_TYPE_CONFIG = {
  main: {
    name: '主线任务',
    icon: '📜',
    color: '#FFD700',
    description: '推动剧情发展的核心任务',
  },
  side: {
    name: '支线任务',
    icon: '📋',
    color: '#4CAF50',
    description: '额外的挑战和奖励',
  },
  daily: {
    name: '日常任务',
    icon: '🔄',
    color: '#2196F3',
    description: '每日可重复完成的任务',
  },
} as const;

/** 根据ID获取任务 */
export function getQuest(questId: string): Quest | undefined {
  return QUESTS.find((q) => q.id === questId);
}

/** 获取章节信息 */
export function getChapter(chapterId: number): QuestChapter | undefined {
  return QUEST_CHAPTERS.find((c) => c.id === chapterId);
}

/** 获取指定类型的任务 */
export function getQuestsByType(type: Quest['type']): Quest[] {
  return QUESTS.filter((q) => q.type === type);
}

/** 获取指定章节的任务 */
export function getQuestsByChapter(chapterId: number): Quest[] {
  return QUESTS.filter((q) => q.chapter === chapterId);
}

/** 获取可接取的任务 */
export function getAvailableQuests(
  completedQuestIds: string[],
  playerLevel: number
): Quest[] {
  return QUESTS.filter((quest) => {
    // 已完成的任务不再显示
    if (completedQuestIds.includes(quest.id)) return false;

    // 检查等级要求
    if (quest.levelRequired && playerLevel < quest.levelRequired) return false;

    // 检查前置任务
    if (quest.prerequisites) {
      const hasAllPrereqs = quest.prerequisites.every((prereq) =>
        completedQuestIds.includes(prereq)
      );
      if (!hasAllPrereqs) return false;
    }

    return true;
  });
}

/** 获取日常任务列表 */
export function getDailyQuests(): Quest[] {
  return QUESTS.filter((q) => q.type === 'daily');
}

/** 获取主线任务总数 */
export function getMainQuestCount(): number {
  return QUESTS.filter((q) => q.type === 'main').length;
}

/** 获取章节总数 */
export function getChapterCount(): number {
  return QUEST_CHAPTERS.length;
}
