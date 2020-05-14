import { Scene } from "phaser";
import { EF_SCENE, HIT_DIZZY } from "../constants";
import PhaserImage = Phaser.GameObjects.Image;
import Sprite = Phaser.GameObjects.Sprite;
import Circle = Phaser.Geom.Circle;
import Point = Phaser.Geom.Point;
import Rectagle = Phaser.Geom.Rectangle;
import Graphics = Phaser.GameObjects.Graphics;
import PhaserText = Phaser.GameObjects.Text;
import Container = Phaser.GameObjects.Container
import { drawRoundRect } from "./UIUtil";


const stageWidth = document.body.clientWidth;
const stageHeight = document.body.clientHeight;

interface AnimationPlaying {
    hammer: boolean
    
}

export default class EffectScene extends Phaser.Scene { 
    public coin: PhaserImage
    public hammer:PhaserImage
    public emojiFace: PhaserImage
    public dizzy: Sprite


    public scoreArea: Container
    public scoreText: PhaserText

    public animationPlaying: AnimationPlaying = {
        hammer: false
    }

    constructor() {
        super(EF_SCENE);
    }
    preload() {
        // this.load.scenePlugin({
        //     key: 'rexuiplugin',
        //     url: '/rexuiplugin.min.js',
        //     sceneKey: 'rexUI'
        // });
        this.load.image('coin', 'assets/coin.png');
        this.load.image('hammer', 'assets/hammer.png');
        this.load.image('dizzy1', 'assets/dizzy1.png');
        this.load.image('dizzy2', 'assets/dizzy2.png');
    }

    create(){
        this.createScoreArea()
    }
    


    addCoin(addScoreCount: Function) {
        this.coin = this.add.image(stageWidth/2, stageHeight/2, 'coin')
        // this.coin.displayWidth = 64
        // this.coin.displayHeight = 64
        // scale 是根据原图的大小而言的。
        this.coin.setScale(0.1)

        let self = this
        let dest = {
            x: 210, y:50
        }
        this.tweens.add({
            targets: this.coin,
            scale: 0.5,
            duration: 132,
            ease: 'Power4',
            onComplete: () => {
                // cb()

                this.tweens.add({
                    targets: this.coin,
                    x: dest.x,
                    y: dest.y,
                    scale: 0.1,
                    duration: 332,
                    ease: 'Circ',
                    onComplete: () => {
                        addScoreCount(1)
                        this.coin.destroy()
                    }
                })                 
            }            
        })
    }

    addHammer() {
        if (this.animationPlaying.hammer) {
            return 
        }

        
        this.animationPlaying.hammer = true
        let hammerPos = new Point(258, 327)
        let dizzyPos = new Point(284, 389)
        let AlternativeEmoji = ['sad', 'cry', 'sour']
        let hitEmoji = Phaser.Math.RND.pick(AlternativeEmoji)


        this.hammer = this.add.image(hammerPos.x,  hammerPos.y, 'hammer')
        // this.emojiFace = this.add.image(285,520, hitEmoji)
        // this.emojiFace.setScale(0.3)

        this.hammer.setScale(0.3)
        this.hammer.rotation = 1
        
        this.addDizzy(dizzyPos).play(HIT_DIZZY)


        this.tweens.add({
            targets: this.hammer,
            rotation: 1.5,
            duration: 232,
            hold: 332,
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

    addDizzy(dizzyPos: Point):Sprite {
       this.dizzy = this.add.sprite(dizzyPos.x, dizzyPos.y, 'dizzy1')
       return this.dizzy


    }


    createScoreArea(): Container {
        let scoreAreaCenter = new Point(stageWidth / 2, 50)
        let graphicsTopLeft = new Point(0 - scoreAreaCenter.x, 0 - scoreAreaCenter.y)
        this.scoreArea = this.add.container(scoreAreaCenter.x, scoreAreaCenter.y)

        let bg = this.add.graphics()
        bg.beginPath()
        bg.fillStyle(0xFEDE52) //yellow
        bg.fillRect(graphicsTopLeft.x, graphicsTopLeft.y, stageWidth, 100)
        bg.closePath()


        let scoreBoxWidth = 300
        let scoreBoxHeight = 66
        let scoreBoxRadius = scoreBoxHeight / 2
        let scoreBoxBorder = 10
        let scoreBoxRectagle = new Rectagle(
            (scoreAreaCenter.x - scoreBoxWidth / 2) - scoreAreaCenter.x,
            (scoreAreaCenter.y - scoreBoxHeight / 2) - scoreAreaCenter.y,
            scoreBoxWidth,
            scoreBoxHeight
        )
        let scoreBox = drawRoundRect(this, scoreBoxRectagle, scoreBoxRadius, 0xFc6158, scoreBoxBorder, 0xf9ebe9)

        let scoreTitlePos = new Point(scoreAreaCenter.x - 50, scoreAreaCenter.y)
        let scoreTitle = this.add.text(
            scoreTitlePos.x - scoreAreaCenter.x,
            scoreTitlePos.y - scoreAreaCenter.y,
            'score:',
            { fontFamily: 'Arial', fontSize: 22, color: '#cca398' }
        )
        scoreTitle.setOrigin(0.5)

        let scorePos = new Point(scoreAreaCenter.x + 0, scoreAreaCenter.y)
        let scoreText = this.scoreText = this.add.text(
            scorePos.x - scoreAreaCenter.x,
            scorePos.y - scoreAreaCenter.y,
            '0',
            { fontFamily: 'Arial', fontSize: 22, color: '#cca398' }
        )
        scoreText.setOrigin(0.5)


        this.scoreArea.add([bg, scoreBox, scoreTitle, scoreText])


        return this.scoreArea
    }

}