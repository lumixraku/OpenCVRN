import PhaserImage = Phaser.GameObjects.Image;
import Sprite = Phaser.GameObjects.Sprite;
import Circle = Phaser.Geom.Circle;
import Point = Phaser.Geom.Point;
import Rectagle = Phaser.Geom.Rectangle;
import Graphics = Phaser.GameObjects.Graphics;
import PhaserText = Phaser.GameObjects.Text;
import { Scene } from "phaser";
import { LOADING_SCENE } from "@root/constants";


export default class LoadingScene extends Scene {
    constructor() {
        super(LOADING_SCENE)
    }
}