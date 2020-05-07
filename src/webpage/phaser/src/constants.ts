
const MSG_TYPE_FACE = 'face'
const MSG_TYPE_CAM = 'cam' // RN  告知 WEB 取景器的位置
const MSG_TYPE_WEBVIEW_READY = 'webview_ready' // WEB 告知 RN OnMessage 事件已经准备好 RN可以post 消息了
const MSG_TYPE_FACE_TARGET_POS = 'face_target' // WEB 告知 RN 人脸应该固定的位置
const DOGLOOK = 'doglook'
const DOGCOOK = 'dogcook'


export {
  MSG_TYPE_FACE,
  MSG_TYPE_CAM,
  MSG_TYPE_WEBVIEW_READY,
  MSG_TYPE_FACE_TARGET_POS,
  DOGLOOK,
  DOGCOOK
}