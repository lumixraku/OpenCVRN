// Message 类型
const MSG_TYPE_FACE = 'face'
const MSG_TYPE_CAM = 'cam' // RN  告知 WEB 取景器的位置
const MSG_TYPE_WEBVIEW_READY = 'webview_ready' // WEB 告知 RN OnMessage 事件已经准备好 RN可以post 消息了
const MSG_TYPE_FACE_TARGET_POS = 'face_target' // WEB 告知 RN 人脸应该固定的位置


// scene
const BASE_SCENE = 'base'
const GAME_SCENE = 'game'
const UI_SCENE = 'uiScene'
const EF_SCENE = 'effectScene'

// game
const DOGLOOK = 'doglook'
const DOGCOOK = 'dogcook'
const CHECKING_INTERVAL = 2000 // 回头检测的最短间隔
const CHECK_PROB = 0.9 //回头检测的概率
const CHECKING_DURATION = 3000


export {
  MSG_TYPE_FACE,
  MSG_TYPE_CAM,
  MSG_TYPE_WEBVIEW_READY,
  MSG_TYPE_FACE_TARGET_POS,
  DOGLOOK,
  DOGCOOK,
  CHECKING_INTERVAL,
  CHECK_PROB,
  CHECKING_DURATION,

  BASE_SCENE,
  GAME_SCENE,
  UI_SCENE,
  EF_SCENE
}