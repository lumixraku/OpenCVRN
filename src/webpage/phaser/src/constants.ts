
const stageWidth = document.body.clientWidth;
const stageHeight = document.body.clientWidth / 9 * 16;



// Message 类型
const MSG_TYPE_FACE = 'face'
const MSG_TYPE_CAM = 'cam' // RN  告知 WEB 取景器的位置
const MSG_TYPE_WEBVIEW_READY = 'webview_ready' // WEB 告知 RN OnMessage 事件已经准备好 RN可以post 消息了
const MSG_TYPE_FACE_TARGET_POS = 'face_target' // WEB 告知 RN 人脸应该固定的位置


// scene
const BASE_SCENE = 'base'
const GAME_SCENE = 'game'
const GAMEUI_SCENE = 'gameUIScene'
const EF_SCENE = 'effectScene'
const SETTINGS_SCENE = 'settingsScene'
const ASSETS_SCENE = 'assetsScene'
const LOADING_SCENE = 'loadingScene'


// game
const DOGLOOK = 'doglook'
const DOGCOOK = 'dogcook'
const CHECKING_INTERVAL = 2000 // 回头检测的最短间隔
const CHECK_PROB = 0.9 //回头检测的概率
const CHECKING_DURATION = 3000
const FIRST_CHECK_ELAPSE = 2 // 第一次检查的时  游戏已经进行的时间
const DISTANCE_ANGLE = 40

// game UI
const BACKGROUND = 'background'
const SOUNDKEY = 'clickSound'
const MUSICKEY = 'music'

// animation
const COOK_LOOKBACK_ANIMI = 'lookback'
const COOK_TOCOOK_ANIMI = 'cookAgain'
const HIT_DIZZY = 'hitDizzy'

// color
const MAIN_RED = 0xfc6158
const MAIN_RED_LIGHT = 0xf9ebe9


// food
const FOOD_LIST_FNAME_MAP = {
  'food0':'010-grapes',
  'food1':'001-burger',
  'food2':'001-ice-cream',
  'food3':'002-burger-1',
  'food4':'002-ice-cream-1',
  'food5':'003-french-fries',
  'food6':'003-ice-cream-2',
  'food7':'004-fried-egg',
  'food8':'004-ice-cream-stick',
  'food9':'005-bottle',
  'food10': '006-banana',
  'food11': '007-orange',
  'food12': '008-orange-1',
  'food13': '009-apple',
}

export {
  //SCREEN 
  stageWidth, 
  stageHeight,


  //game
  MSG_TYPE_FACE,
  MSG_TYPE_CAM,
  MSG_TYPE_WEBVIEW_READY,
  MSG_TYPE_FACE_TARGET_POS,
  DOGLOOK,
  DOGCOOK,
  CHECKING_INTERVAL,
  CHECK_PROB,
  CHECKING_DURATION,
  FIRST_CHECK_ELAPSE,
  DISTANCE_ANGLE,

  BACKGROUND,
  SOUNDKEY,
  MUSICKEY,
  FOOD_LIST_FNAME_MAP, 

  //color
  MAIN_RED, 
  MAIN_RED_LIGHT,


  // animation
  COOK_LOOKBACK_ANIMI,
  COOK_TOCOOK_ANIMI,
  HIT_DIZZY,
  
  // scene
  BASE_SCENE,
  GAME_SCENE,
  GAMEUI_SCENE as UI_SCENE,
  EF_SCENE,
  SETTINGS_SCENE,
  ASSETS_SCENE,
  LOADING_SCENE,
}