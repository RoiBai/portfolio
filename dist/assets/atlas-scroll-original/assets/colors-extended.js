/*
 * 华夏百色图 · 扩展色档案（52 色）
 *
 * 数据口径
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. HEX 是面向屏幕展示的现代近似值，不是古代染材、颜料或文物的统一实测色度。
 * 2. 典籍只用于支持色名、物象或历史语境；没有可靠古籍出处的条目明确写作
 *    “当代整理”，不把现代考古命名倒置成古代原名。
 * 3. 四源是图谱的主叙事入口：
 *    - 矿物：矿物颜料、人工无机颜料、陶瓷釉色与硬质天然材料；
 *    - 草木：植物染、植物颜料、漆与植物物象形成的染织色名；
 *    - 自然：天光、季候、花木、羽毛与日常物象的观色；
 *    - 典籍：礼制、训诂、诗文和历史故事中被命名的颜色。
 * 4. 本组新增来源计数为 15 / 10 / 18 / 9；与原四十八色合并后，
 *    矿物、草木、自然、典籍各 25 色。
 */
(function exposeHuaxiaExtendedColorData(global) {
  "use strict";

  const colors = [
    // ───────────────────────────── 赤系 · 3
    {
      id: "yinzhu", name: "银朱", pinyin: "yín zhū", hex: "#F05654", cat: "mineral",
      origin: "水银与石亭脂同研升炼所得的朱色颜料，古籍将其与朱砂、水银的转化关系分辨清楚。",
      context: "银朱与天然朱砂并非同一制备路径；颗粒、胶结剂会改变红相，HEX 只作屏幕索引。",
      era: "宋代已有贡用记录 · 明代工艺文献详载",
      cites: ["《天工开物·丹青·朱》", "《宋朝事实·卷七》"],
      related: ["zhusha", "huangdan", "danhuo"]
    },
    {
      id: "huangdan", name: "黄丹", pinyin: "huáng dān", hex: "#EA5514", cat: "mineral",
      origin: "由铅烧炼而成的橙赤色颜料，古籍亦称铅丹、丹粉、朱粉。",
      context: "“黄丹”并非现代纯黄，历史上用于绘饰、医药等；色相会随烧炼状态改变。",
      era: "汉以前本草传统 · 宋明采色与工艺文献",
      cites: ["《本草纲目·金石之一·铅丹》", "《宋朝事实·卷七》"],
      related: ["yinzhu", "xionghuang", "cihuang"]
    },
    {
      id: "danhuo", name: "丹雘", pinyin: "dān huò", hex: "#C8161D", cat: "mineral",
      origin: "“雘”为可作颜料的赤色石脂；“丹雘”见于先秦涂饰语境。",
      context: "《尚书》证明的是红色矿物涂饰材料，并非单一现代化学品或固定 HEX。",
      era: "先秦",
      cites: ["《尚书·梓材》", "《说文解字注·雘》"],
      related: ["zhusha", "yinzhu", "chi"]
    },

    // ───────────────────────────── 黄系 · 3
    {
      id: "ehuang", name: "鹅黄", pinyin: "é huáng", hex: "#FFF143", cat: "nature",
      origin: "古人以鹅雏嫩羽及鹅黄色酒液比色，杜甫有“鹅儿黄似酒”。",
      context: "唐宋语境中可指鹅雏、嫩柳或酒色；HEX 仅为明快浅黄的现代近似。",
      era: "唐宋诗文 · 历代沿用",
      cites: ["杜甫《舟前小鹅儿》", "《示儿编·鸭绿鹅黄》"],
      related: ["juyi", "songhua", "xiang"]
    },
    {
      id: "huanglu", name: "黄栌", pinyin: "huáng lú", hex: "#E29C45", cat: "plant",
      origin: "黄栌木可煮取黄色染液，古本草明确记载其“堪染黄色”。",
      context: "《多能鄙事》还记录用黄栌染明茶褐；实际染色会随媒染和织物变化。",
      era: "唐宋本草传统 · 明代染色配方",
      cites: ["《图经衍义本草·黄栌》", "《多能鄙事·染明茶褐》"],
      related: ["yujin", "zhehuang", "juyi"]
    },
    {
      id: "juyi", name: "鞠衣", pinyin: "jū yī", hex: "#D3A237", cat: "literary",
      origin: "鞠衣为王后六服之一，郑注释作黄桑服，色义取桑叶初生之黄。",
      context: "它是礼制服名，不是单一染料；HEX 仅作黄桑服色的现代索引。",
      era: "周礼传统 · 汉代经注",
      cites: ["《周礼·天官·内司服》", "郑玄《周礼注》"],
      related: ["ehuang", "xiang", "huang"]
    },

    // ───────────────────────────── 蓝系 · 5
    {
      id: "qunqing", name: "群青", pinyin: "qún qīng", hex: "#4C8DAE", cat: "mineral",
      origin: "汉语传统颜料语境中的群青通常指由青金石制得的蓝色颜料。",
      context: "近代人工群青与历史天然群青材料不同；本档案只取天然矿物蓝的历史语义。",
      era: "古代天然矿物颜料传统",
      cites: ["故宫博物院《文物建筑色彩面层的视觉性质与材料做法初探》", "故宫博物院《慈宁宫花园临溪亭天花彩画》"],
      related: ["shiqing", "kongqing", "jilan"]
    },
    {
      id: "jilan", name: "祭蓝", pinyin: "jì lán", hex: "#2B5F8A", cat: "mineral",
      origin: "以钴料呈色的高温深蓝釉，故宫藏宣德祭蓝釉盘又称“宝石蓝釉”。",
      context: "明代御窑实物与“大明宣德年制”款可直接确证；色差仍受配方、窑温影响。",
      era: "明宣德 · 后世沿烧",
      cites: ["故宫博物院《祭蓝釉盘》"],
      related: ["tianqing", "qunqing", "dianlan"]
    },
    {
      id: "huaqing", name: "花青", pinyin: "huā qīng", hex: "#2376B7", cat: "plant",
      origin: "明清画谱所见透明蓝色颜料；画论将花青列入常用色，并详述由靛花类原料淘取、澄制的过程。",
      context: "花青适合罩染；历史制法、原料会变化，不对应单一现代成分。",
      era: "明清绘画材料传统",
      cites: ["《绘事琐言·合色》", "《芥舟学画编·设色》"],
      related: ["dianlan", "piao", "qunqing"]
    },
    {
      id: "biluo", name: "碧落", pinyin: "bì luò", hex: "#88ABDA", cat: "nature",
      origin: "“碧落”原指碧空、天界，颜色取澄澈高远的天空蓝意象。",
      context: "它首先是空间与光色意象，不是古代标准色样；此处转译为清浅天空蓝。",
      era: "唐代诗文 · 当代色值映射",
      cites: ["白居易《长恨歌》"],
      related: ["tianqing", "piao", "kongquelan"]
    },
    {
      id: "kongquelan", name: "沧浪", pinyin: "cāng láng", hex: "#4994C4", cat: "nature",
      origin: "“沧浪之水清兮”是先秦水色意象。",
      context: "以古文确有出处的水色词替换现代“孔雀蓝”；HEX 取清水映天的中蓝。",
      era: "先秦歌辞 · 历代水色意象",
      cites: ["《孟子·离娄上》沧浪歌", "《楚辞·渔父》"],
      related: ["cui", "biluo", "qunqing"]
    },

    // ───────────────────────────── 绿系 · 9
    {
      id: "tonglv", name: "铜绿", pinyin: "tóng lǜ", hex: "#549688", cat: "mineral",
      origin: "铜表面生成的绿色腐蚀物，古籍以“铜青”“铜绿”著录，也进入颜料、药物体系。",
      context: "成分和环境不同会形成不同青绿色，不能对应唯一色度。",
      era: "唐代本草已有 · 明代汇录",
      cites: ["《本草纲目·金石之一·铜青》"],
      related: ["shilu", "kongqing", "doulv"]
    },
    {
      id: "doulv", name: "豆青", pinyin: "dòu qīng", hex: "#9ED048", cat: "mineral",
      origin: "清代青釉品种，豆青釉呈柔和青绿色。",
      context: "国家博物馆藏乾隆豆青釉器可作为实物档案；图谱仍保持绿系、矿物与陶瓷分类。",
      era: "清雍正 · 乾隆",
      cites: ["中国国家博物馆《豆青釉地开光粉彩山水纹海棠式瓶》", "故宫博物院《越窑系青釉印纹豆》"],
      related: ["guanlv", "ailv", "songhua"]
    },
    {
      id: "ailv", name: "浅碧", pinyin: "qiǎn bì", hex: "#A4E2C6", cat: "plant",
      origin: "明代《留青日札》辨蓝草，记“大蓝如芥，染浅碧”。",
      context: "这是有文献支持的植物染青绿色；现有 HEX 只作屏幕近似。",
      era: "明代",
      cites: ["《留青日札·蓝》"],
      related: ["doulv", "yuse", "zhuqing"]
    },
    {
      id: "zhuqing", name: "竹青", pinyin: "zhú qīng", hex: "#789262", cat: "nature",
      origin: "取竹叶与竹表的青绿色，《诗经·卫风·淇奥》有“绿竹青青”。",
      context: "古文支持竹之青青意象，但不对应单一色度；本值取沉静中绿。",
      era: "先秦物象 · 历代沿用",
      cites: ["《诗经·卫风·淇奥》"],
      related: ["ailv", "cuiwei", "songbailv"]
    },
    {
      id: "liulv", name: "柳绿", pinyin: "liǔ lǜ", hex: "#AFDD22", cat: "plant",
      origin: "古代合色法中的柳绿，由枝条绿与槐花黄色调合。",
      context: "色名既有新柳物象，也有实际合色记录；它并非仅把柳叶照片换算为 HEX。",
      era: "元明清合色传统",
      cites: ["《绘事琐言·合色》"],
      related: ["congqing", "ehuang", "songbailv"]
    },
    {
      id: "songbailv", name: "松柏青", pinyin: "sōng bǎi qīng", hex: "#21A675", cat: "nature",
      origin: "苏辙《巫山赋》有“览松柏之青青兮”。",
      context: "古籍强调松柏经冬常青；HEX 为中深绿色现代近似。",
      era: "宋代赋文所见 · 历代物象",
      cites: ["苏辙《巫山赋》", "《古今图书集成·草木典·松柏部》"],
      related: ["zhuqing", "cuiwei", "shilu"]
    },
    {
      id: "cuiwei", name: "翠微", pinyin: "cuì wēi", hex: "#4C8045", cat: "nature",
      origin: "“翠微”指山腰青翠幽微之处，颜色取远山林气的中深绿色。",
      context: "古注又释作轻缥山气；它描述远山层位与综合色，不是单一颜料。",
      era: "古代训诂与山水诗文 · 当代映射",
      cites: ["《尔雅·释山》", "杨慎《丹铅总录·翠微》"],
      related: ["cui", "zhuqing", "songbailv"]
    },
    {
      id: "guanlv", name: "官绿", pinyin: "guān lǜ", hex: "#6A6B29", cat: "plant",
      origin: "古代合色文献记“官绿即枝条绿”；宋代官服语境亦见官绿袍。",
      context: "史料支持它是历史色名，但不证明它必由单一植物染成；草木分类属于图谱叙事入口。",
      era: "宋代服色 · 元明清合色传统",
      cites: ["《绘事琐言·合色》", "《通雅·颜色》"],
      related: ["doulv", "lvchen", "congqing"]
    },
    {
      id: "lvchen", name: "绿沈", pinyin: "lǜ chén", hex: "#0C8918", cat: "literary",
      origin: "绿沈是古代名物色词，可用于漆饰弓枪、笔管、屏风和服饰，并非某一种固定材料。",
      context: "宋人吴曾详考多种绿沈用例；本值取浓深绿色。",
      era: "六朝名物 · 唐宋诗文考释",
      cites: ["吴曾《能改斋漫录·绿沈》", "杜甫《重过何氏五首》"],
      related: ["guanlv", "shilu", "songbailv"]
    },

    // ───────────────────────────── 紫系 · 10
    {
      id: "qiepizi", name: "茄皮紫", pinyin: "qié pí zǐ", hex: "#5D3F51", cat: "nature",
      origin: "以茄皮深紫比色，《玉纪补》明确列“茄皮紫”为古玉斑色名，清宫器物亦见茄皮紫釉。",
      context: "这是物象比色与器物命名，不表示从茄子提取染料；色相可在紫红至紫黑间变化。",
      era: "清代名物记录 · 清宫器物",
      cites: ["刘心瑶《玉纪补》", "故宫博物院《茄皮紫釉暗刻云龙纹盘》"],
      related: ["zipurple", "zitang", "jiang"]
    },
    {
      id: "hanzi", name: "紫石英", pinyin: "zǐ shí yīng", hex: "#6045A8", cat: "mineral",
      origin: "古籍著录的紫色石英类矿物；《太平御览》引魏代取白石英、紫石英用于宫殿雕饰。",
      context: "紫石英是古代真实矿物名和紫色硬质材料，不宣称其必作绘画颜料。",
      era: "汉魏以前本草传统 · 魏代宫殿材料记录",
      cites: ["《吴普本草·玉石类·紫石英》", "《太平御览·药部四》", "《本草纲目·金石之二》"],
      related: ["shiqing", "qunqing", "zipurple"]
    },
    {
      id: "zicao", name: "紫草", pinyin: "zǐ cǎo", hex: "#71384B", cat: "plant",
      origin: "紫草根为传统紫染材料，《齐民要术》专载种植、收获与保色方法。",
      context: "古籍称陇西紫草为染紫上品；产地、保存、媒染会影响深浅。",
      era: "汉以前已有染用记载 · 北魏农书详载",
      cites: ["《齐民要术·种紫草》", "《太平御览·百卉部·紫草》"],
      related: ["qian", "zipurple", "qiepizi"]
    },
    {
      id: "dingxiang", name: "丁香", pinyin: "dīng xiāng", hex: "#CCA4E3", cat: "nature",
      origin: "取丁香花的浅紫色；地方志明确记丁香有紫、白二色。",
      context: "不同品种可为白或紫，本档案只取浅紫一支。",
      era: "宋元方志 · 清代花木记录",
      cites: ["《赤城志·卷三十六》", "《钦定日下旧闻考·卷一百四十九》"],
      related: ["ouhe", "mujin", "qinglian"]
    },
    {
      id: "mujin", name: "木槿", pinyin: "mù jǐn", hex: "#BA79B1", cat: "nature",
      origin: "《诗经》“颜如舜华”，毛传以舜为木槿；后世本草、花谱记有淡红及红紫花色。",
      context: "木槿一名舜华，朝开暮落；本值取红紫花相，不宣称唯一色度。",
      era: "先秦诗义 · 历代本草花谱",
      cites: ["《诗经·郑风·有女同车》", "《本草衍义·木槿》"],
      related: ["dingxiang", "zitang", "ouhe"]
    },
    {
      id: "xiangluziyan", name: "香炉紫烟", pinyin: "xiāng lú zǐ yān", hex: "#D3CCD6", cat: "literary",
      origin: "由“日照香炉生紫烟”的诗句取名，表达山气受日光照映后的淡紫灰。",
      context: "这是日光、山气与诗意共同形成的综合色，不是古代颜料配方。",
      era: "盛唐诗文 · 当代色值映射",
      cites: ["李白《望庐山瀑布》"],
      related: ["shuangse", "biluo", "dingxiang"]
    },
    {
      id: "zitang", name: "紫棠", pinyin: "zǐ táng", hex: "#56004F", cat: "nature",
      origin: "紫棠是古代人物肤色与综合色词，《水浒传》第四十八回写“紫棠色面皮”。",
      context: "它更接近黑中带红紫的综合色，而非海棠花固定色；HEX 取深紫红。",
      era: "宋元明文学色词 · 历代沿用",
      cites: ["《水浒传》第四十八回"],
      related: ["qiepizi", "qinglian", "ouhe"]
    },
    {
      id: "qinglian", name: "青莲", pinyin: "qīng lián", hex: "#801DAE", cat: "nature",
      origin: "清代《凤仙谱》以“青莲”名凤仙花品种，并记单叶青莲为“紫翠色”。",
      context: "采用古花谱中的青莲品种义，取偏冷紫翠色层。",
      era: "清代花谱",
      cites: ["《凤仙谱·各种青莲》"],
      related: ["zipurple", "zitang", "weizi"]
    },
    {
      id: "weizi", name: "魏紫", pinyin: "wèi zǐ", hex: "#7E2065", cat: "nature",
      origin: "魏紫是牡丹名品，色名取其深紫红花色；花色会随栽培与观赏条件变化。",
      context: "花谱支持品名与文化地位；真实花色仍随品种、花期和光线变化。",
      era: "北宋牡丹谱 · 历代沿用",
      cites: ["欧阳修《洛阳牡丹记》", "《广群芳谱·牡丹谱》"],
      related: ["qinglian", "qizi", "qiepizi"]
    },
    {
      id: "qizi", name: "齐紫", pinyin: "qí zǐ", hex: "#6E4B87", cat: "literary",
      origin: "齐桓公好服紫、一国争相效仿的故事使“齐紫”成为服色风尚与制度传播的历史索引。",
      context: "典故说明紫服的社会传播与价值，不提供可直接换算的历史色度。",
      era: "春秋故事 · 战国文献",
      cites: ["《韩非子·外储说左上》"],
      related: ["zipurple", "weizi", "gan"]
    },

    // ───────────────────────────── 素系 · 9
    {
      id: "hafen", name: "蛤粉", pinyin: "gé fěn", hex: "#F2E6CE", cat: "mineral",
      origin: "蛤壳烧制、研磨所得的白色粉料，古画和墙壁粉饰均有使用。",
      context: "《大明会典》还记录蛤粉与苏木制紫粉，说明它既可作白料也可作合色基底。",
      era: "古代粉饰传统 · 明代制度文献详载",
      cites: ["《绘事琐言·粉》", "《大明会典·颜料》"],
      related: ["qianbai", "baie", "tianbai"]
    },
    {
      id: "baie", name: "白垩", pinyin: "bái è", hex: "#E8E0D0", cat: "mineral",
      origin: "白色土质材料，古籍载其产于山谷并用于涂饰。",
      context: "宋代采色清单明确列卫州白垩；白度随产地成分而异。",
      era: "上古材料名 · 宋代宫廷采色有记录",
      cites: ["《本草纲目·土部·白垩》", "《宋朝事实·卷七》"],
      related: ["hafen", "qianbai", "gao"]
    },
    {
      id: "tianbai", name: "甜白", pinyin: "tián bái", hex: "#F6F2E9", cat: "mineral",
      origin: "明永乐景德镇御窑创烧的白釉品种，白如凝脂、素若积雪。",
      context: "“甜”是对温润白釉的视觉感受，并非糖质材料。",
      era: "明永乐",
      cites: ["故宫博物院《甜白釉》"],
      related: ["qianbai", "hafen", "gao"]
    },
    {
      id: "tubai", name: "荼", pinyin: "tú", hex: "#F3F9F1", cat: "plant",
      origin: "《诗经》有“有女如荼”；毛诗训诂将此“荼”释作白色茅秀。",
      context: "这是先秦植物白色意象，不是染料或标准色样；使用“荼”避免把现代复合名倒置成古称。",
      era: "先秦诗歌 · 历代训诂",
      cites: ["《诗经·郑风·出其东门》", "《毛诗多识·有女如荼》"],
      related: ["su", "xuebai", "songhua"]
    },
    {
      id: "xuebai", name: "雪白", pinyin: "xuě bái", hex: "#F2FDFF", cat: "nature",
      origin: "以雪之高明洁白比色，魏晋赋文已经使用“雪白”。",
      context: "雪色随阴影与天光呈冷暖变化；本值取冷白。",
      era: "魏晋赋文 · 历代沿用",
      cites: ["郭璞《盐池赋》"],
      related: ["shuangse", "yuebai", "tubai"]
    },
    {
      id: "shuangse", name: "皑", pinyin: "ái", hex: "#E9F1F6", cat: "nature",
      origin: "《说文解字》释“皑”为“霜雪之白”。",
      context: "以明确的古代白色字义替代含义不稳定的“霜色”；HEX 取微冷霜雪白。",
      era: "汉代字书 · 魏晋赋文",
      cites: ["《说文解字·白部》", "左贵嫔《离思赋》"],
      related: ["xuebai", "yudubai", "xiangluziyan"]
    },
    {
      id: "yudubai", name: "鱼肚白", pinyin: "yú dù bái", hex: "#FCEFE8", cat: "nature",
      origin: "鱼肚白是清代金陵染色俗名，也用于描写日出前将明未明的天光。",
      context: "兼有染名与黎明物象；本值取微暖白。",
      era: "明清文学与染色俗名",
      cites: ["康祺《郎潜纪闻初笔》", "《西游补》第七回"],
      related: ["shuangse", "yuebai", "xuebai"]
    },
    {
      id: "su", name: "素", pinyin: "sù", hex: "#E0F0E9", cat: "literary",
      origin: "《说文解字》释“素”为白色细缯，首先是未经彩饰的白帛与本色概念。",
      context: "应以白帛、本色为核心，不把偏青 HEX 反说成古代定色。",
      era: "汉代字书 · 上古名物传统",
      cites: ["《说文解字·素部》"],
      related: ["gao", "qianbai", "tubai"]
    },
    {
      id: "gao", name: "缟", pinyin: "gǎo", hex: "#EFECE3", cat: "literary",
      origin: "“缟”是细白绢及其白色的古代名物，首先是织物与文字概念。",
      context: "《毛诗正义》明释缟衣为白色；HEX 取略暖绢白，用来区别雪白与矿物白。",
      era: "先秦名物 · 汉唐经注",
      cites: ["《诗经·郑风·出其东门》", "《毛诗正义》"],
      related: ["su", "baie", "xiang"]
    },

    // ───────────────────────────── 玄系 · 3
    {
      id: "wujinyou", name: "乌金釉", pinyin: "wū jīn yòu", hex: "#1C1A17", cat: "mineral",
      origin: "景德镇黑色釉品种，故宫康熙乌金釉笔筒实物釉面“漆黑明亮”。",
      context: "名称中的“金”描述黑釉光泽，不表示含金；真实反射不能由单一 HEX 表达。",
      era: "清康熙",
      cites: ["故宫博物院《乌金釉描金山水纹笔筒》"],
      related: ["hei", "zaose", "jiangyou"]
    },
    {
      id: "qihei", name: "漆黑", pinyin: "qī hēi", hex: "#191310", cat: "plant",
      origin: "天然漆髹涂形成深黑而有光的表面；“漆黑”一词在唐代文献中已形容极黑。",
      context: "《宋史》又有“黑漆棒”“黑漆弩柄”等器物记录，能直接连接颜色与漆艺。",
      era: "唐宋文字与器用记录 · 漆器传统更早",
      cites: ["孙樵《祭梓潼帝君文》", "《宋史·仪卫志》"],
      related: ["hei", "mo", "wujinyou"]
    },
    {
      id: "li", name: "黧", pinyin: "lí", hex: "#5D513C", cat: "literary",
      origin: "黧的古义为黑中带黄，《广韵》直释“黧：黑而黄也”。",
      context: "常形容人面或物色黯深枯黄；没有唯一材料配方。",
      era: "先秦两汉用例 · 宋代韵书定释",
      cites: ["《广韵》黧字条", "《尔雅注疏》"],
      related: ["xuan", "chenxiang", "meige"]
    },

    // ───────────────────────────── 褐系 · 10
    {
      id: "jiangyou", name: "酱釉", pinyin: "jiàng yòu", hex: "#4B2F2A", cat: "mineral",
      origin: "以铁为主要呈色元素的高温褐色釉，因色近芝麻酱而名。",
      context: "故宫说明宋代北方窑场已多见，明宣德官窑有代表器。",
      era: "宋代 · 至 · 明清",
      cites: ["故宫博物院《酱釉盘》"],
      related: ["chamoyou", "wujinyou", "chenxiang"]
    },
    {
      id: "chamoyou", name: "茶叶末釉", pinyin: "chá yè mò yòu", hex: "#6E6B3A", cat: "mineral",
      origin: "铁、镁结晶釉形成黄绿相杂、近似茶叶细末的综合色。",
      context: "唐代耀州窑已有相似釉色实物；清代官窑成熟，“茶叶末釉”一名据故宫研究始见清末《陶雅》。",
      era: "唐代已有实物 · 清代官窑成熟并定名",
      cites: ["故宫博物院《耀州窑茶叶末釉执壶》", "故宫博物院《茶叶末釉铺首耳炉》", "《陶雅》"],
      related: ["jiangyou", "chase", "huangliu"]
    },
    {
      id: "chase", name: "明茶褐", pinyin: "míng chá hè", hex: "#B35C44", cat: "plant",
      origin: "《多能鄙事》载明茶褐染法，以黄栌木、白矾、绿矾处理帛。",
      context: "这是有古代配方和色名双重证据的草木褐色，比笼统“茶色”更为可靠。",
      era: "明代染色文献",
      cites: ["《多能鄙事·染明茶褐》", "《长物志·衣饰》"],
      related: ["chamoyou", "tanhe", "qiuse"]
    },
    {
      id: "tanhe", name: "檀褐", pinyin: "tán hè", hex: "#765548", cat: "plant",
      origin: "古代合色谱所载褐色名，以土黄与紫花等色料调合。",
      context: "“檀褐”不能直接解释成檀木本色；应依据合色文献描述为暖灰褐。",
      era: "元明清合色传统",
      cites: ["《绘事琐言·合色》"],
      related: ["chenxiang", "chase", "like"]
    },
    {
      id: "like", name: "栗壳", pinyin: "lì ké", hex: "#60281E", cat: "nature",
      origin: "古代以栗壳作褐色比照，元代工艺记录有“如栗壳色”。",
      context: "栗壳随干湿与光泽而变；HEX 概括其深红褐。",
      era: "元代工艺记录 · 明清沿用",
      cites: ["陶宗仪《辍耕录·卷三十》", "《痘疹心法要诀》"],
      related: ["tanhe", "zheshi", "tuose"]
    },
    {
      id: "tuose", name: "驼褐", pinyin: "tuó hè", hex: "#A88462", cat: "nature",
      origin: "驼褐原指以驼毛织成的衣料或衣服，《唐六典》记会州出驼褐。",
      context: "《本草纲目》记驼毛有苍、褐、黄、紫数色；本值只取其中浅褐综合色。",
      era: "唐代贡物 · 宋代服饰语境",
      cites: ["《唐六典》驼褐条", "《本草纲目·兽之一·驼》"],
      related: ["like", "qiuse", "chenxiang"]
    },
    {
      id: "hupo", name: "琥珀", pinyin: "hǔ pò", hex: "#CA6924", cat: "mineral",
      origin: "古籍记载松、枫木脂长期埋藏形成琥珀，并区分浅黄、红黄、深红等色相。",
      context: "归矿物象限仅沿用“硬质天然材料”的图谱口径；不把它称为矿石。",
      era: "汉晋本草传统 · 明代汇录",
      cites: ["《本草纲目·木之四·琥珀》"],
      related: ["yujin", "huanglu", "huangliu"]
    },
    {
      id: "qiuse", name: "秋色", pinyin: "qiū sè", hex: "#896C39", cat: "nature",
      origin: "古诗以“秋色”概括林木、山野与落晖，王绩有“树树皆秋色”。",
      context: "它不是固定染色名；本值取低饱和黄褐作为诗意转译。",
      era: "唐代山水诗意 · 历代沿用",
      cites: ["王绩《野望》"],
      related: ["chase", "tuose", "huangliu"]
    },
    {
      id: "meige", name: "韎韐", pinyin: "mèi gé", hex: "#A45A52", cat: "literary",
      origin: "韎韐为染赤的皮制服饰，《诗经》有“韎韐有奭”，古注释“奭”为赤而鲜明。",
      context: "这是戎服名物与赤褐皮色，不宜简化为纯红色卡。",
      era: "先秦名物 · 汉唐经注",
      cites: ["《诗经·小雅·瞻彼洛矣》", "《毛诗正义》"],
      related: ["xun", "li", "jiang"]
    },
    {
      id: "huangliu", name: "黄流", pinyin: "huáng liú", hex: "#D09B3A", cat: "literary",
      origin: "《诗经》有“瑟彼玉瓒，黄流在中”；后世一说指郁鬯黄酒，一说指玉瓒的黄金流口。",
      context: "保留两种古注分歧，作为礼酒金黄流光的典籍色意，不断言唯一染材或色样。",
      era: "先秦礼酒语境 · 历代经注",
      cites: ["《诗经·大雅·旱麓》", "《毛诗正义》"],
      related: ["yujin", "hupo", "chamoyou"]
    }
  ];

  const relations = {
    yinzhu:          { family: ["red"],    period: ["ming", "qing"], region: ["zhongyuan"], craft: ["mineral"] },
    huangdan:        { family: ["red"],    period: ["han", "ming"], region: ["zhongyuan"], craft: ["mineral"] },
    danhuo:          { family: ["red"],    period: ["shanggu"], region: ["zhongyuan"], craft: ["mineral", "classics"] },
    ehuang:          { family: ["yellow"], period: ["suitang"], region: ["jiangnan"], craft: ["observe"] },
    huanglu:         { family: ["yellow"], period: ["suitang"], region: ["zhongyuan"], craft: ["herb", "silk"] },
    juyi:            { family: ["yellow"], period: ["shanggu"], region: ["zhongyuan"], craft: ["silk", "classics"] },
    qunqing:         { family: ["blue"],   period: ["weijin"], region: ["dunhuang"], craft: ["mineral"] },
    jilan:           { family: ["blue"],   period: ["ming", "qing"], region: ["zhongyuan"], craft: ["ceramic"] },
    huaqing:         { family: ["blue"],   period: ["ming"], region: ["jiangnan"], craft: ["herb"] },
    biluo:           { family: ["blue"],   period: ["suitang"], region: ["zhongyuan"], craft: ["observe", "classics"] },
    kongquelan:      { family: ["blue"],   period: ["shanggu"], region: ["zhongyuan"], craft: ["observe"] },
    tonglv:          { family: ["green"],  period: ["shanggu"], region: ["zhongyuan"], craft: ["mineral"] },
    doulv:           { family: ["green"],  period: ["ming", "qing"], region: ["zhongyuan"], craft: ["ceramic"] },
    ailv:            { family: ["green"],  period: ["ming"], region: ["zhongyuan"], craft: ["herb", "observe"] },
    zhuqing:         { family: ["green"],  period: ["shanggu"], region: ["jiangnan"], craft: ["observe"] },
    liulv:           { family: ["green"],  period: ["suitang"], region: ["jiangnan"], craft: ["herb", "observe"] },
    songbailv:       { family: ["green"],  period: ["shanggu"], region: ["zhongyuan"], craft: ["observe"] },
    cuiwei:          { family: ["green"],  period: ["shanggu"], region: ["zhongyuan"], craft: ["observe", "classics"] },
    guanlv:          { family: ["green"],  period: ["qing"], region: ["jiangnan"], craft: ["herb", "silk"] },
    lvchen:          { family: ["green"],  period: ["suitang"], region: ["zhongyuan"], craft: ["classics"] },
    qiepizi:         { family: ["purple"], period: ["qing"], region: ["jiangnan"], craft: ["observe"] },
    hanzi:           { family: ["purple"], period: ["shanggu", "han"], region: ["zhongyuan"], craft: ["mineral"] },
    zicao:           { family: ["purple"], period: ["han"], region: ["zhongyuan"], craft: ["herb", "silk"] },
    dingxiang:       { family: ["purple"], period: ["songyuan"], region: ["jiangnan"], craft: ["observe"] },
    mujin:           { family: ["purple"], period: ["shanggu"], region: ["jiangnan"], craft: ["observe"] },
    xiangluziyan:    { family: ["purple"], period: ["suitang"], region: ["zhongyuan"], craft: ["classics", "observe"] },
    zitang:          { family: ["purple"], period: ["ming"], region: ["jiangnan"], craft: ["observe"] },
    qinglian:        { family: ["purple"], period: ["qing"], region: ["jiangnan"], craft: ["observe"] },
    weizi:           { family: ["purple"], period: ["songyuan"], region: ["zhongyuan"], craft: ["observe"] },
    qizi:            { family: ["purple"], period: ["shanggu"], region: ["zhongyuan"], craft: ["silk", "classics"] },
    hafen:           { family: ["white"],  period: ["weijin"], region: ["jiangnan"], craft: ["mineral"] },
    baie:            { family: ["white"],  period: ["shanggu"], region: ["zhongyuan"], craft: ["mineral"] },
    tianbai:         { family: ["white"],  period: ["ming"], region: ["zhongyuan"], craft: ["ceramic"] },
    tubai:           { family: ["white"],  period: ["shanggu"], region: ["zhongyuan"], craft: ["herb", "observe"] },
    xuebai:          { family: ["white"],  period: ["weijin"], region: ["zhongyuan"], craft: ["observe"] },
    shuangse:        { family: ["white"],  period: ["han", "weijin"], region: ["zhongyuan"], craft: ["observe"] },
    yudubai:         { family: ["white"],  period: ["qing"], region: ["jiangnan"], craft: ["observe"] },
    su:              { family: ["white"],  period: ["shanggu"], region: ["zhongyuan"], craft: ["silk", "classics"] },
    gao:             { family: ["white"],  period: ["shanggu"], region: ["zhongyuan"], craft: ["silk", "classics"] },
    wujinyou:        { family: ["black"],  period: ["qing"], region: ["zhongyuan"], craft: ["ceramic"] },
    qihei:           { family: ["black"],  period: ["shanggu"], region: ["jiangnan"], craft: ["herb", "ink"] },
    li:              { family: ["black"],  period: ["shanggu"], region: ["zhongyuan"], craft: ["classics"] },
    jiangyou:        { family: ["brown"],  period: ["songyuan"], region: ["zhongyuan"], craft: ["ceramic"] },
    chamoyou:        { family: ["brown"],  period: ["qing"], region: ["zhongyuan"], craft: ["ceramic"] },
    chase:           { family: ["brown"],  period: ["ming"], region: ["jiangnan"], craft: ["herb", "observe"] },
    tanhe:           { family: ["brown"],  period: ["ming"], region: ["lingnan"], craft: ["herb", "observe"] },
    like:            { family: ["brown"],  period: ["songyuan"], region: ["zhongyuan"], craft: ["observe"] },
    tuose:           { family: ["brown"],  period: ["suitang"], region: ["xiyu"], craft: ["observe"] },
    hupo:            { family: ["brown"],  period: ["han"], region: ["xiyu"], craft: ["mineral", "observe"] },
    qiuse:           { family: ["brown"],  period: ["suitang"], region: ["jiangnan"], craft: ["observe"] },
    meige:           { family: ["brown"],  period: ["shanggu"], region: ["zhongyuan"], craft: ["silk", "classics"] },
    huangliu:        { family: ["brown"],  period: ["shanggu"], region: ["zhongyuan"], craft: ["classics", "observe"] }
  };

  const tagDefaults = {
    red:    { mood: ["庄重", "热烈", "华贵"], season: ["秋", "冬"], scene: ["宫廷", "国风", "礼盒"], tone: "medium", temp: "warm" },
    yellow: { mood: ["温润", "明快", "古朴"], season: ["春", "秋"], scene: ["宫廷", "文创", "礼盒"], tone: "light", temp: "warm" },
    blue:   { mood: ["清雅", "沉静", "深邃"], season: ["春", "冬"], scene: ["山水", "书房", "品牌"], tone: "medium", temp: "cool" },
    green:  { mood: ["清雅", "生机", "沉静"], season: ["春", "夏"], scene: ["山水", "茶室", "文创"], tone: "medium", temp: "cool" },
    purple: { mood: ["典雅", "婉约", "华贵"], season: ["春", "秋"], scene: ["宫廷", "国风", "婚庆"], tone: "medium", temp: "cool" },
    white:  { mood: ["素净", "清雅", "温润"], season: ["冬", "春"], scene: ["极简", "茶室", "婚庆"], tone: "light", temp: "neutral" },
    black:  { mood: ["沉静", "庄重", "深邃"], season: ["冬"], scene: ["书房", "品牌", "国风"], tone: "dark", temp: "neutral" },
    brown:  { mood: ["古朴", "温润", "沉稳"], season: ["秋", "冬"], scene: ["书房", "茶室", "民艺"], tone: "dark", temp: "warm" }
  };

  const tagOverrides = {
    ehuang: { mood: ["明快", "轻盈", "温润"], tone: "light" },
    juyi: { mood: ["庄重", "典雅", "温润"], scene: ["宫廷", "礼制", "国风"] },
    biluo: { mood: ["清雅", "轻盈", "旷远"], tone: "light", scene: ["山水", "文创", "诗意"] },
    kongquelan: { mood: ["明快", "典雅", "华贵"] },
    doulv: { mood: ["清雅", "温润", "轻盈"], tone: "light", scene: ["瓷器", "茶室", "文创"] },
    ailv: { mood: ["清雅", "轻盈", "温润"], tone: "light" },
    liulv: { mood: ["明快", "轻盈", "生机"] },
    lvchen: { mood: ["沉静", "深邃", "古朴"], tone: "dark" },
    qiepizi: { mood: ["沉静", "古朴", "深邃"], tone: "dark" },
    hanzi: { mood: ["华贵", "深邃", "古朴"], tone: "dark", scene: ["考古", "国风", "民艺"] },
    dingxiang: { mood: ["婉约", "轻盈", "温润"], tone: "light" },
    xiangluziyan: { mood: ["清雅", "朦胧", "诗意"], tone: "light", scene: ["山水", "诗意", "文创"] },
    zitang: { mood: ["深邃", "华贵", "庄重"], tone: "dark" },
    hafen: { temp: "warm", scene: ["绘画", "民艺", "极简"] },
    baie: { mood: ["古朴", "素净", "温润"], temp: "warm" },
    tianbai: { mood: ["素净", "温润", "典雅"], temp: "warm", scene: ["瓷器", "茶室", "极简"] },
    xuebai: { mood: ["素净", "轻盈", "清雅"], temp: "cool" },
    shuangse: { mood: ["清雅", "沉静", "素净"], temp: "cool" },
    yudubai: { mood: ["温润", "轻盈", "婉约"], temp: "warm" },
    wujinyou: { mood: ["庄重", "深邃", "典雅"], scene: ["瓷器", "宫廷", "品牌"] },
    qihei: { mood: ["沉稳", "古朴", "庄重"], temp: "warm", scene: ["漆器", "民艺", "品牌"] },
    li: { mood: ["古朴", "沉稳", "深邃"], temp: "warm" },
    jiangyou: { mood: ["古朴", "沉稳", "深邃"], scene: ["瓷器", "茶室", "民艺"] },
    chamoyou: { mood: ["古朴", "温润", "沉静"], scene: ["瓷器", "茶室", "书房"] },
    chase: { tone: "medium" },
    tuose: { tone: "medium" },
    hupo: { mood: ["华贵", "温润", "明快"], tone: "medium" },
    huangliu: { mood: ["华贵", "温润", "古朴"], tone: "medium", scene: ["礼制", "国风", "礼盒"] }
  };

  const tags = Object.fromEntries(colors.map((color) => {
    const family = relations[color.id].family[0];
    return [color.id, { ...tagDefaults[family], ...(tagOverrides[color.id] || {}) }];
  }));

  global.HUAXIA_EXTENDED_COLORS = colors;
  global.HUAXIA_EXTENDED_RELATIONS = relations;
  global.HUAXIA_EXTENDED_TAGS = tags;
})(window);
