import PhaserImage = Phaser.GameObjects.Image;
import Sprite = Phaser.GameObjects.Sprite;
import Circle = Phaser.Geom.Circle;
import Point = Phaser.Geom.Point;
import Rectagle = Phaser.Geom.Rectangle;
import Graphics = Phaser.GameObjects.Graphics;
import PhaserText = Phaser.GameObjects.Text;
import Animation = Phaser.Animations.Animation;
import AnimationFrameType = Phaser.Types.Animations.AnimationFrame;
import { Scene } from "phaser"
import { COOK_LOOKBACK_ANIMI, COOK_TOCOOK_ANIMI } from "@root/constants";

export default class AnimateManager {
    doge: Animation | false
    scene: Scene

    testDog: Sprite

    constructor(scene: Scene) {
        // 此刻 scene 还没有准备好
        this.scene = scene
    }

    registerAnimation(){
        this.cookLookback()
        this.cookAgain()
    }

    cookLookback() {
        let scene = this.scene
        let makeFrames = ():AnimationFrameType[] => {
            let arr: AnimationFrameType[] = []

            let endIndex = 33 // 到 33 的时候停下来
    
            for(let idx = 0; idx<= endIndex; idx++) {
                let keyname = `dogeFrame${idx}`;
                arr.push( {
                    key:  keyname,
                } as AnimationFrameType)
            }       
            return arr     
        }

        // weired !!!
        this.doge = scene.anims.create({
            key: COOK_LOOKBACK_ANIMI,
            frames: makeFrames(),
            frameRate: 1/0.04, // 原始 gif 每一帧仅占用 0.04s
            // repeat: -1
        })
    }
    
    cookAgain() {
        let scene = this.scene
        let makeFrames = ():AnimationFrameType[] => {
            let arr: AnimationFrameType[] = []

            let endIndex = 47 // 到 33 的时候停下来
    
            for(let idx = 33; idx<= endIndex; idx++) {
                let keyname = `dogeFrame${idx}`;
                arr.push( {
                    key:  keyname,
                } as AnimationFrameType)
            }       
            return arr     
        }

        // weired !!!
        this.doge = scene.anims.create({
            key: COOK_TOCOOK_ANIMI,
            frames: makeFrames(),
            frameRate: 1/0.04, // 原始 gif 每一帧仅占用 0.04s
            // repeat: -1
        })
    }

}