/**
 * 帮会模块 —— Mock 数据
 *
 * 后端接口就绪后，删除本文件并将 api/guild.ts 中的 mock 调用替换为真实请求即可。
 * 数据结构设计对应需求文档第 3、4 节。
 */

// ==================== 类型定义 ====================

export interface Member {
  id: number
  name: string
  title: string // 称号 / 职位
  avatar: string // 个人头像（正方形）
  intro: string // 简介
  /** 在合照中的位置 — 百分比坐标，用于点击热区 */
  hotspotX: number
  hotspotY: number
  /** 角色背景图（1~3 张，轮播） */
  bgImages?: string[]
  /** 角色语录（每项一句话，竖向排列） */
  quotes?: string[]
}

export interface Honor {
  id: number
  title: string
  description: string
  date: string
}

export interface Recruitment {
  isRecruiting: boolean
  description: string
  requirements: string[]
}

export interface ContactInfo {
  wechat?: string
  qq?: string
  discord?: string
  message?: string
}

export interface Guild {
  id: number
  name: string
  slogan: string // 短标语，列表卡片用
  backgroundImage: string // 详情页主视觉背景
  description: string // 详细介绍
  style: string // 风格定位
  history: string // 帮会历史
  leaderId: number
  leaderName: string
  members: Member[]
  groupPhoto: string[] // 集体合照
  photoWall: string[] // 照片墙
  honors: Honor[] // 荣誉列表（空数组 = 不展示该区块）
  recruitment: Recruitment | null // 招募信息
  contact: ContactInfo // 大当家联系方式
  createdAt: string
  memberCount: number
}

// ==================== 工具：占位图生成 ====================
function placeholder(label: string, w = 400, h = 300): string {
  return `https://placehold.co/${w}x${h}/1a1f2e/c9a87c?text=${encodeURIComponent(label)}`
}

// ==================== Mock 数据 ====================

export const mockGuilds: Guild[] = [
  // --- 帮会 1：攻略组 ---
  {
    id: 1,
    name: '攻略组',
    slogan: '壮志凌云，剑指苍穹',
    backgroundImage: '/banghui/攻略组卡片背景.jpg',
    description:
      '攻略组创立于逆水寒开服之初，历经数次合服与帮战洗礼，始终屹立于江湖之巅。' +
      '我们以"侠义为先，兄弟为重"为立帮之本，聚集了一群热爱PVP、追求极致操作的热血侠客。' +
      '帮内氛围融洽，上至帮主下至新人均以兄弟相称，日常活动丰富，周周有帮战、月月有聚会。',
    style: 'PVP竞技型帮会，主打帮战、联赛、野外团战',
    history:
      '建帮三载，从最初十余人的小队发展为如今百人规模的大型帮会。' +
      '第一届天下会武十六强，第二届八强，第三赛季斩获服务器第一帮会称号。',
    leaderId: 101,
    leaderName: '洗盐',
    members: [
      { id: 1, name: '风椋', title: '二当家', avatar: '/to/人鱼.jpg', intro: '进攻指挥，进攻职业全能', hotspotX: 28, hotspotY: 38, bgImages: ['/img/女儿壁纸.png', '/img/女儿壁纸1.jpg'], quotes: ['风揽秋光', '椋渡寒江', '山云作客', '醉候沧浪'] },
      { id: 2, name: '青云叶', title: '核心成员', avatar: '/png/风椋.png', intro: '剑气凌霄青云直上，全服顶级龙吟。', hotspotX: 38, hotspotY: 36, bgImages: ['/img/师姐2.jpg', '/img/师姐3.jpg'], quotes: ['青锋三尺', '云开月明', '叶落知秋'] },
      { id: 3, name: '纸杯杯杯', title: '核心成员', avatar: '/png/奈奈安.png', intro: '帮会智囊，擅长战术分析与阵容搭配。', hotspotX: 48, hotspotY: 35, bgImages: ['/img/师姐3.jpg', '/img/阿初1.jpg'], quotes: ['纸上谈兵', '杯酒论剑', '杯中日月', '杯底乾坤'] },
      { id: 4, name: '铁衣无悔', title: '三当家', avatar: '/png/风椋.png', intro: '帮战总指挥，铁衣专精，带队夺冠。', hotspotX: 58, hotspotY: 37, bgImages: ['/img/阿初1.jpg', '/img/侯爷.jpg'], quotes: ['铁甲依然', '衣锦夜行', '无问西东', '悔不当初'] },
      { id: 5, name: '月修落沉', title: '核心成员', avatar: '/png/奈奈安.png', intro: '输出榜常驻前五，定海神针。', hotspotX: 68, hotspotY: 39, bgImages: ['/img/侯爷.jpg', '/img/姬蜜儿.jpg'], quotes: ['月下独酌', '修身养性', '落子无悔', '沉舟破釜'] },
      { id: 6, name: '清月流影', title: '精英成员', avatar: '/png/风椋.png', intro: '神相老手，野外遭遇战王牌。', hotspotX: 72, hotspotY: 40, bgImages: ['/img/姬蜜儿.jpg', '/img/师兄1.jpg'], quotes: ['清风徐来', '月影婆娑', '流光易逝', '影落无声'] },
      { id: 7, name: '闭麦受气', title: '精英成员', avatar: '/png/风椋.png', intro: '帮会最稳前排，承伤量全服前十。', hotspotX: 24, hotspotY: 50, bgImages: ['/img/师兄1.jpg', '/img/月牙儿.jpg'], quotes: ['闭目凝神', '麦浪翻风', '受命于天', '气吞山河'] },
      { id: 8, name: '剑逍遥', title: '大当家', avatar: '/png/风椋.png', intro: '凌云阁创始人，全服顶级碎梦，带帮三年屡创佳绩。', hotspotX: 34, hotspotY: 48, bgImages: ['/img/月牙儿.jpg', '/img/花将离.jpg', '/img/师姐1.jpg'], quotes: ['剑气如虹', '逍遥天下', '傲视群雄', '侠义无双'] },
      { id: 9, name: '施流岁', title: '精英成员', avatar: '/png/奈奈安.png', intro: '血河榜首常客，帮战中流砥柱。', hotspotX: 44, hotspotY: 47, bgImages: ['/img/花将离.jpg', '/img/师姐1.jpg'], quotes: ['施法自然', '流水不腐', '岁月如歌', '岁岁年年'] },
      { id: 10, name: '宁好也好', title: '精英成员', avatar: '/png/奈奈安.png', intro: '玄机高手远程炮台，团战输出核心。', hotspotX: 54, hotspotY: 49, bgImages: ['/img/师姐1.jpg', '/img/师姐2.jpg'], quotes: ['宁折不弯', '好风如水', '也知风雨', '好景长存'] },
      { id: 11, name: '玉锵然', title: '核心成员', avatar: '/png/风椋.png', intro: '九灵榜首爆发恐怖，帮战MVP常客。', hotspotX: 64, hotspotY: 48, bgImages: ['/img/师姐2.jpg', '/img/师姐3.jpg', '/img/阿初1.jpg'], quotes: ['玉树临风', '锵金鸣玉', '然诺千金'] },
      { id: 12, name: '双木烨', title: '精英成员', avatar: '/png/风椋.png', intro: '沧澜大师，AOE输出爆炸，团战清场利器。', hotspotX: 72, hotspotY: 51, bgImages: ['/img/师姐3.jpg', '/img/阿初1.jpg'], quotes: ['双木成林', '木秀于林', '烨然生辉'] },
      { id: 13, name: '风雪夜归人', title: '首席输出', avatar: '/png/奈奈安.png', intro: '帮会首席血河输出常年前三。', hotspotX: 28, hotspotY: 62, bgImages: ['/img/阿初1.jpg', '/img/侯爷.jpg', '/img/姬蜜儿.jpg'], quotes: ['风起云涌', '雪落无声', '夜尽天明', '归去来兮', '人在天涯'] },
      { id: 14, name: '梦酒殇', title: '核心成员', avatar: '/png/风椋.png', intro: '神相双修能打能奶，团队多面手。', hotspotX: 38, hotspotY: 64, bgImages: ['/img/侯爷.jpg', '/img/姬蜜儿.jpg'], quotes: ['梦里不知', '酒醒何处', '殇歌一曲'] },
      { id: 15, name: '源头奶', title: '精英成员', avatar: '/png/奈奈安.png', intro: '全服前十素问，帮战中的移动血库。', hotspotX: 48, hotspotY: 63, bgImages: ['/img/姬蜜儿.jpg', '/img/师兄1.jpg'], quotes: ['源远流长', '头角峥嵘', '奶遍天下'] },
      { id: 16, name: '柳如烟', title: '金牌素问', avatar: '/png/风椋.png', intro: '全服前三素问，治疗量稳居第一。', hotspotX: 58, hotspotY: 62, bgImages: ['/img/师兄1.jpg', '/img/月牙儿.jpg'], quotes: ['柳絮飞花', '如沐春风', '烟雨朦胧'] },
      { id: 17, name: '一剑封喉', title: '攻坚手', avatar: '/png/奈奈安.png', intro: '神相高手，曾一人牵制三名主力。', hotspotX: 68, hotspotY: 64, bgImages: ['/img/月牙儿.jpg', '/img/花将离.jpg'], quotes: ['一剑光寒', '剑指苍穹', '封神之路', '喉中热血'] },
      { id: 18, name: '雨半生', title: '核心成员', avatar: '/png/风椋.png', intro: '碎梦绝活哥，帮战单挑无敌手。', hotspotX: 72, hotspotY: 61, bgImages: ['/img/花将离.jpg', '/img/师姐1.jpg', '/img/师姐2.jpg'], quotes: ['雨打风吹', '半世浮沉', '生如夏花'] },
    ],
    groupPhotos: [
      '/banghui/攻略组卡片背景.jpg',
      '/guild/师姐2.jpg',
      '/guild/师姐3.jpg',
    ],
    photoWall: [
      placeholder('凌云阁·帮战凯旋', 600, 400),
      placeholder('凌云阁·周年庆典', 600, 400),
      placeholder('凌云阁·野外团战', 600, 400),
      placeholder('凌云阁·风景合影', 600, 400),
      placeholder('凌云阁·帮会联赛', 600, 400),
      placeholder('凌云阁·庆功宴', 600, 400),
    ],
    honors: [
      { id: 1, title: '第三届天下会武 — 服务器第一帮会', description: '历经七轮鏖战，最终以全胜战绩摘得桂冠。', date: '2025-09-15' },
      { id: 2, title: '第二届天下会武 — 八强', description: '首次闯入八强，创造帮会历史最佳战绩。', date: '2025-03-20' },
      { id: 3, title: '年度最佳PVP帮会', description: '由官方评选的年度最佳PVP帮会，表彰在帮战中的卓越表现。', date: '2024-12-30' },
      { id: 4, title: '第一届天下会武 — 十六强', description: '初次参赛即闯入十六强，展现了凌云阁的实力。', date: '2024-08-10' },
      { id: 5, title: '服务器帮战连胜纪录保持者', description: '创下连续27场帮战不败的记录，至今无人打破。', date: '2024-05-01' },
    ],
    recruitment: {
      isRecruiting: true,
      description: '凌云阁诚招各路英雄豪杰！无论你是PVP老手还是江湖新人，只要有一颗热血之心，我们都欢迎你的加入。',
      requirements: [
        '战力要求：12万以上（可根据操作水平适当放宽）',
        '职业需求：铁衣、血河、素问优先',
        '活跃度：每周至少参与2次帮战',
        '性格要求：团结友爱，不搞小团体',
        '需加帮会QQ群并通过试炼考核',
      ],
    },
    contact: {
      wechat: 'jianxiaoyao_nsh',
      qq: '1234567890',
      discord: '凌云阁#8888',
      message: '游戏中搜索"剑逍遥"或直接在帮会界面申请加入',
    },
    createdAt: '2023-06-15',
    memberCount: 128,
  },

]

// ==================== 辅助查询函数 ====================

/** 根据 ID 获取帮会详情 */
export function getGuildById(id: number): Guild | undefined {
  return mockGuilds.find(g => g.id === id)
}

/** 获取帮会列表（支持分页参数，当前返回全部） */
export function getGuildList(_page = 1, _size = 20): { list: Guild[]; total: number } {
  return {
    list: mockGuilds,
    total: mockGuilds.length,
  }
}
