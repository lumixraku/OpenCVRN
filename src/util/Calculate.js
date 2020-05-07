

export default class FacePosCheck {
  constructor(offsetXPreview, offsetYPreview, previewWidth, previewHeight) {
    this.offsetXPreview = offsetXPreview
    this.offsetYPreview = offsetYPreview

    this.previewWidth = previewWidth
    this.previewHeight = previewHeight
  }
  checkFacePosition(faceBounds) {
    let rs = {
      pass: false,
      bounds: null,
      advice: 'still no face'
    }
    if (!this.offsetXPreview == 0) {
      return rs
    }
    if (faceBounds) {
      let minFaceX = faceBounds.origin.x
      let maxFaceX = faceBounds.origin.x + faceBounds.size.width

      let minFaceY = faceBounds.origin.y
      let maxFaceY = faceBounds.origin.y + faceBounds.size.height

      this.drawFaceBounds(faceBounds)
      // this.drawPreviewBounds(this.camPreviewArea)
      let minPreviewX = this.offsetXPreview
      let maxPreviewX = this.offsetXPreview + this.previewWidth
      let minPreviewY = this.offsetYPreview
      let maxPreviewY = this.offsetYPreview + this.previewHeight

      let paddingLeft = minFaceX - minPreviewX
      let paddingRight = maxPreviewX - maxFaceX
      let paddingTop = maxFaceX - minPreviewX
      let paddingBottom = maxPreviewY - maxFaceY

      // this.facePosText.text = `${paddingLeft.toFixed(2)} --- ${paddingRight.toFixed(2)}`

      if (paddingLeft / paddingRight > 2) {
        rs.advice = 'to right slightly'
      } else if (paddingRight / paddingLeft > 2) {
        rs.advice = 'to left slightly'
      } else {
        return {
          pass: true,
          bounds: faceBounds,
          advice:'Hold your phone!'
        }
      }


    }
    return rs

  }

  calcOffset(faceBounds, targetFaceBounds){
    let targetCenterX = targetFaceBounds.origin.x + targetFaceBounds.size.width
    let targetCenterY = targetFaceBounds.origin.y + targetFaceBounds.size.height

    let faceCenterX = faceBounds.origin.x + faceBounds.size.width
    let faceCenterY = faceBounds.origin.y + faceBounds.size.height

    return {
      x: targetCenterX - faceCenterX,
      y: targetCenterY - faceCenterY
    }
 }
}