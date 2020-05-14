
import PhaserImage = Phaser.GameObjects.Image;
import Sprite = Phaser.GameObjects.Sprite;
import Circle = Phaser.Geom.Circle;
import Point = Phaser.Geom.Point;
import Rectagle = Phaser.Geom.Rectangle;
import Graphics = Phaser.GameObjects.Graphics;
import PhaserText = Phaser.GameObjects.Text;
import Container = Phaser.GameObjects.Container
import { Scene } from "phaser";

export { drawRoundRect }

let drawRoundRect = (scene:Scene, size: Rectagle, radius: number, color: any, borderWidth?: number, borderColor?: any) => {


    let bg = scene.add.graphics()
    bg.clear()
    bg.beginPath()

    let x = size.x
    let y = size.y
    let width = size.width
    let height = size.height
    bg.fillStyle(color)
    // graphics 的 origin 是左上角
    bg.fillRoundedRect(x, y, width, height, radius)

    if (borderWidth) {
        let x2 = x + borderWidth
        let y2 = y + borderWidth
        bg.fillStyle(borderColor)
        bg.fillRoundedRect(x2, y2, width - 2 * borderWidth, height - 2 * borderWidth, radius - borderWidth)
    }


    return bg

}