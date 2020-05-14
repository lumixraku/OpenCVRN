

export default class FacePosCheck {
  constructor(offsetXPreview, offsetYPreview, previewWidth, previewHeight) {
    this.offsetXPreviewDefault = offsetXPreview
    this.offsetYPreviewDefault = offsetYPreview

    this.previewWidthDefault = previewWidth
    this.previewHeightDefault = previewHeight
  }
  checkFacePosition(faceBounds) {
    let rs = {
      pass: false,
      bounds: null,
      advice: 'still no face'
    }
    if (!this.offsetXPreviewDefault == 0) {
      return rs
    }
    if (faceBounds) {
      let minFaceX = faceBounds.origin.x
      let maxFaceX = faceBounds.origin.x + faceBounds.size.width

      let minFaceY = faceBounds.origin.y
      let maxFaceY = faceBounds.origin.y + faceBounds.size.height

      this.drawFaceBounds(faceBounds)
      // this.drawPreviewBounds(this.camPreviewArea)
      let minPreviewX = this.offsetXPreviewDefault
      let maxPreviewX = this.offsetXPreviewDefault + this.previewWidthDefault
      let minPreviewY = this.offsetYPreviewDefault
      let maxPreviewY = this.offsetYPreviewDefault + this.previewHeightDefault

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
          advice: 'Hold your phone!'
        }
      }


    }
    return rs

  }

  calcOffset(faceBounds, targetFaceBounds) {
    // let targetCenterX = targetFaceBounds.origin.x + targetFaceBounds.size.width
    // let targetCenterY = targetFaceBounds.origin.y + targetFaceBounds.size.height

    let targetCenterX = this.offsetXPreviewDefault + this.previewWidthDefault / 2
    let targetCenterY = this.offsetYPreviewDefault + this.previewHeightDefault / 2

    let faceCenterX = faceBounds.origin.x + faceBounds.size.width/2
    let faceCenterY = faceBounds.origin.y + faceBounds.size.height/2

    let adjustX = targetCenterX - faceCenterX
    let adjustY = targetCenterY - faceCenterY

    // 缩小变化范围
    let maxRangeX = 50
    let maxRangeY = 50
    if (Math.abs(adjustX) > maxRangeX) {
      adjustX = adjustX > 0 ? maxRangeX : -maxRangeX
    }
    if (Math.abs(adjustY) > maxRangeY) {
      adjustY = adjustY > 0 ? maxRangeY : -maxRangeY
    }

    console.log('adjustXY  ', faceCenterX, faceCenterY, targetCenterX , targetCenterY  )
    console.log('adjust', adjustX)


    return {
      x: adjustX/2,
      y: adjustY/2
    }
  }
}