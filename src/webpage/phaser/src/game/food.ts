import Image = Phaser.GameObjects.Image;
import Sprite = Phaser.GameObjects.Sprite;
import Circle = Phaser.Geom.Circle;
import Point = Phaser.Geom.Point;

export default class Food extends Sprite {
  eating: boolean
  name: string
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | integer) {
    super(scene, x, y, texture, frame )

    this.width = 64
    this.height = 64
  }
}