import { Scene } from "phaser";
import { EF_SCENE, HIT_DIZZY, MAIN_RED, MAIN_RED_LIGHT, stageHeight, stageWidth } from "../constants";
import PhaserImage = Phaser.GameObjects.Image;
import Sprite = Phaser.GameObjects.Sprite;
import Circle = Phaser.Geom.Circle;
import Point = Phaser.Geom.Point;
import Rectagle = Phaser.Geom.Rectangle;
import Graphics = Phaser.GameObjects.Graphics;
import PhaserText = Phaser.GameObjects.Text;
import Container = Phaser.GameObjects.Container


import { UIHelper } from "@root/UI/UIHelper";

interface AnimationPlaying {
    hammer: boolean
    dropCoin: boolean
    addCoin: boolean

}

const coinScorePos = new Point(210, 50)
const coinSize = 25
const originCoinScale = coinSize / 512

export default class GameEffectContainer extends Container {
    public scene: Scene

    public coin: PhaserImage
    public hammer: PhaserImage
    public emojiFace: PhaserImage
    public dizzy: Sprite
    private droppingCoins: Phaser.Physics.Matter.Image[] = []

    public animationPlaying: AnimationPlaying = {
        hammer: false,
        dropCoin: false,
        addCoin: false,
    }    
    constructor(scene: Phaser.Scene, x?: number, y?: number, children?: Phaser.GameObjects.GameObject[]) { 
        super(scene, x, y, children)    

    //     setInterval(  ()=> {
    //         this.addCoin( ()=> {

    //         })
    //         this.addHammer( ()=> {
                
    //         })
    //     }, 1000)
    }   


    addCoin(addScoreCount: Function) {
        let scene = this.scene

        let coin = scene.add.image(stageWidth / 2, stageHeight / 2, 'coin')
        // this.coin.displayWidth = 64
        // this.coin.displayHeight = 64
        // scale 是根据原图的大小而言的。

        coin.setScale(originCoinScale)

        let self = this
        this.add(coin)

        this.animationPlaying.addCoin = true
        scene.tweens.add({
            targets: coin,
            scale: 0.2,
            duration: 132,
            ease: 'Power4',
            onComplete: () => {
                // cb()

                scene.tweens.add({
                    targets: coin,
                    x: coinScorePos.x,
                    y: coinScorePos.y,
                    scale: originCoinScale,
                    duration: 332,
                    ease: 'Circ',
                    onComplete: () => {
                        addScoreCount(1)
                        coin.destroy()
                        this.animationPlaying.addCoin = false
                    }
                })
            }
        })
    }

    addHammer(addScoreCount: Function) {
        let scene = this.scene
        if (this.animationPlaying.hammer) {
            return
        }


        this.animationPlaying.hammer = true
        let hammerPos = new Point(258, 327)
        let dizzyPos = new Point(284, 389)
        let AlternativeEmoji = ['sad', 'cry', 'sour']
        let hitEmoji = Phaser.Math.RND.pick(AlternativeEmoji)


        this.hammer = scene.add.image(hammerPos.x, hammerPos.y, 'hammer')
        // this.emojiFace = this.add.image(285,520, hitEmoji)
        // this.emojiFace.setScale(0.3)

        this.hammer.setScale(0.3)
        this.hammer.rotation = 1

        this.addDizzy(dizzyPos).play(HIT_DIZZY)


        let animationDuration = 232
        let holdDuration = 332
        setTimeout(() => {
            scene.cameras.main.shake(100, 0.01, true);
            addScoreCount(-1)
            this.dropACoin()
        }, 332)
        this.scene.tweens.add({
            targets: this.hammer,
            rotation: 1.5,
            duration: animationDuration,
            hold: holdDuration,
            yoyo: true,
            ease: 'Power3',
            onComplete: () => {
                this.hammer.destroy()
                this.dizzy.destroy()
                // this.emojiFace.destroy()

                this.animationPlaying.hammer = false
            },
        })
    }

    addDizzy(dizzyPos: Point): Sprite {
        let scene = this.scene
        this.dizzy = scene.add.sprite(dizzyPos.x, dizzyPos.y, 'dizzy1')
        return this.dizzy


    }

    // 原本这个是放在 UIScene 中的  但是因为addCoin 动画要表现在这里
    // 如果放在 UIScene (UIScene 在层级上最高) Coin会被UIScene 遮住
    // createScoreArea(): Container {
    //     let scoreAreaCenter = new Point(stageWidth / 2 + 100, 50)
    //     let graphicsTopLeft = new Point(0 - scoreAreaCenter.x, 0 - scoreAreaCenter.y)
    //     this.scoreArea = this.add.container(scoreAreaCenter.x, scoreAreaCenter.y)

    //     let bg = this.add.graphics()
    //     bg.beginPath()
    //     bg.fillStyle(MAIN_RED) //yellow
    //     bg.fillRect(graphicsTopLeft.x, graphicsTopLeft.y, stageWidth, 100)
    //     bg.closePath()


    //     let scoreBoxWidth = 300
    //     let scoreBoxHeight = 66
    //     let scoreBoxRadius = scoreBoxHeight / 2
    //     let scoreBoxBorder = 10
    //     let scoreBoxRectagle = new Rectagle(
    //         (scoreAreaCenter.x - scoreBoxWidth / 2) - scoreAreaCenter.x,
    //         (scoreAreaCenter.y - scoreBoxHeight / 2) - scoreAreaCenter.y,
    //         scoreBoxWidth,
    //         scoreBoxHeight
    //     )
    //     let scoreBox = UIHelper.drawRoundRect(this, scoreBoxRectagle, scoreBoxRadius, MAIN_RED, scoreBoxBorder, MAIN_RED_LIGHT)

    //     let scoreTitlePos = new Point(scoreAreaCenter.x - 50, scoreAreaCenter.y)
    //     let scoreTitle = this.add.text(
    //         scoreTitlePos.x - scoreAreaCenter.x,
    //         scoreTitlePos.y - scoreAreaCenter.y,
    //         'score:',
    //         { fontFamily: 'Arial', fontSize: 22, color: '#ffffff' }
    //     )
    //     scoreTitle.setOrigin(0.5)

    //     let scorePos = new Point(scoreAreaCenter.x + 0, scoreAreaCenter.y)
    //     let scoreText = this.scoreText = this.add.text(
    //         scorePos.x - scoreAreaCenter.x,
    //         scorePos.y - scoreAreaCenter.y,
    //         '0',
    //         { fontFamily: 'Arial', fontSize: 22, color: '#ffffff' }
    //     )
    //     scoreText.setOrigin(0.5)


    //     this.scoreArea.add([bg, scoreBox, scoreTitle, scoreText])
    //     let coinIcon = this.add.image(coinScorePos.x, coinScorePos.y, 'coin')
    //     coinIcon.setScale(originCoinScale)


    //     return this.scoreArea
    // }

    dropACoin() {
        let scene = this.scene
        let dropCoin = scene.matter.add.image(coinScorePos.x, coinScorePos.y, 'coin')
        dropCoin.setScale(originCoinScale)
        this.droppingCoins.push(dropCoin)


        dropCoin.setCircle(coinSize / 2);
        dropCoin.setFriction(0.005);
        dropCoin.setBounce(0.6);
        dropCoin.setVelocityX(1);
        dropCoin.setAngularVelocity(0.15);



    }    
}
