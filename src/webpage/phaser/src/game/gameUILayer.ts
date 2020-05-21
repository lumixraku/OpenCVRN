import { Scene } from "phaser";
import PhaserImage = Phaser.GameObjects.Image;
import Sprite = Phaser.GameObjects.Sprite;
import Circle = Phaser.Geom.Circle;
import Point = Phaser.Geom.Point;
import Rectagle = Phaser.Geom.Rectangle;
import Graphics = Phaser.GameObjects.Graphics;
import PhaserText = Phaser.GameObjects.Text;
import Container = Phaser.GameObjects.Container
import InputButton = Phaser.Input.Gamepad.Button
import Group = Phaser.GameObjects.Group

import { UI_SCENE, SETTINGS_SCENE, GAME_SCENE, MAIN_RED_LIGHT, MAIN_RED, stageHeight, stageWidth } from "../constants";
import { UIHelper } from "@root/UI/UIHelper";

// 根据contaienr 的大小计算左上角坐标相对于中心位置的偏移
const TopLeftToCenter = (width: number, height: number, topLeftPoint: Point): Point => {
    let halfW = width / 2
    let halfH = height / 2
    return new Point(
        topLeftPoint.x - halfW,
        topLeftPoint.y - halfH
    )
}


const coinScorePos = new Point(210, 50) // 相对于 0 0 左上角而言
const coinSize = 25
const originCoinScale = coinSize / 512

export default class GameUI extends Container{
    public scene: Scene

    public testGrphics: Graphics
    public caughtTextTipContainer: Container

    public scoreArea: Container
    public scoreText: PhaserText

    /**
     * 
     * @param scene parent scene
     * @param x container 左上角X 在 scene 中的位置
     * @param y contaienr 左上角Y 在 scene 中的位置
     * @param children 
     */
    constructor(scene: Phaser.Scene, x?: number, y?: number, children?: Phaser.GameObjects.GameObject[]){ 
        super(scene,x, y, children)    
           
        this.testObject()
        this.createScoreArea()

        setInterval( ()=> {
            this.createCaughtText( ()=>{})
        }, 2000 )
        
    }

    testObject(){
        this.testGrphics =  new Graphics(this.scene)
        this.testGrphics.lineStyle(50, 0x44bb44)
        this.testGrphics.strokeLineShape( new Phaser.Geom.Line(0,0,  300, 0))
        this.testGrphics.strokeLineShape(new Phaser.Geom.Line(0, 0, 0, 300))
        this.add(this.testGrphics)
    }
    

    createCaughtText(cb: Function): Container {
        let containerWidth = 400
        let containerHeight = 100

        // container 的中心点所在父容器的位置
        let containerPos = new Point(stageWidth / 2, stageHeight / 2 * 1.6)
        let caughtContainer = this.scene.add.container(containerPos.x, containerPos.y)


        let toastPos = TopLeftToCenter(400, 100, new Point(250, 50))
        let toastText = this.scene.add.text(toastPos.x, toastPos.y,
            'You get Caught!!',
            {
                fontFamily: 'Berlin',
                stroke: '#000',
                fontSize: 30,
                strokeThickness: 4,
                align: 'center'
            }
        )

        toastText.setOrigin(0.5)

        // bg 的位置是相对于 container 中心点而言的
        let bg = UIHelper.drawRoundRectWithBorder(
            this.scene,
            new Rectagle(-containerWidth / 2, -containerHeight / 2, containerWidth, containerHeight),
            20,
            MAIN_RED_LIGHT,
            5,
            MAIN_RED,
        )

        let AlternativeEmoji = ['sad', 'cry', 'sour']
        let hitEmoji = Phaser.Math.RND.pick(AlternativeEmoji)

        let emojiPos = TopLeftToCenter(400, 100, new Point(50, 50))

        let emojiFace = this.scene.add.image(emojiPos.x, emojiPos.y, hitEmoji)
        emojiFace.setScale(0.2)


        caughtContainer.add([bg, emojiFace, toastText])
        caughtContainer.setScale(0)

        this.add(caughtContainer)

        this.scene.tweens.add({
            targets: caughtContainer,
            scale: 1,
            duration: 132,
            x: containerPos.x,
            y: containerPos.y,
            ease: ' Elastic.In',
            onComplete: () => {
                setTimeout(() => {
                    this.scene.tweens.add({
                        targets: caughtContainer,
                        // y: stageHeight * 1.2,
                        x: containerPos.x,
                        y: containerPos.y,
                        scale: 0,
                        duration: 132,
                        ease: ' Elastic.Out',
                        onComplete: () => {
                            caughtContainer.destroy()
                        }
                    })
                }, 532)
            }
        })
        return caughtContainer
    }        


    // 由于 coin 悬浮在这个界面上方  所以 gameUILayer 要比 gameEffect 低一层
    createScoreArea(): Container {
        let scene = this.scene

        // score container 所在 parent container 的位置 
        let scoreAreaCenter = new Point(stageWidth / 2, 50)
        this.scoreArea = scene.add.container(scoreAreaCenter.x, scoreAreaCenter.y)
        this.add(this.scoreArea)

        
        let graphicsTopLeft = new Point(0 - scoreAreaCenter.x, 0 - scoreAreaCenter.y)
        let bg = scene.add.graphics()
        
        bg.beginPath()
        bg.fillStyle(MAIN_RED) //yellow
        bg.fillRect(graphicsTopLeft.x, graphicsTopLeft.y, stageWidth, 100)
        bg.closePath()


        let scoreBoxWidth = 300
        let scoreBoxHeight = 66
        let scoreBoxRadius = scoreBoxHeight / 2
        let scoreBoxBorder = 10

        // rectagle 的左上角会和红色title 的中心区域对齐
        let scoreBoxRectagle = new Rectagle(
            -50,
            0 - scoreBoxHeight/2,
            scoreBoxWidth,
            scoreBoxHeight
        )
        let scoreBox = UIHelper.drawRoundRectWithBorder(scene, scoreBoxRectagle, scoreBoxRadius, MAIN_RED, scoreBoxBorder, MAIN_RED_LIGHT)
        

        let scoreTitlePos = new Point(50, 0) // 相对于父元素的中心点而言
        let scoreTitle = scene.add.text(
            scoreTitlePos.x,
            scoreTitlePos.y,
            'score:',
            { fontFamily: 'Arial', fontSize: 22, color: '#ffffff' }
        )
        scoreTitle.setOrigin(0.5)

        let scorePos = new Point(100, 0) // 相对于父元素的中心点而言
        let scoreText = this.scoreText = scene.add.text(
            scorePos.x,
            scorePos.y,
            '0',
            { fontFamily: 'Arial', fontSize: 22, color: '#ffffff' }
        )
        scoreText.setOrigin(0.5)

        let coinIcon = scene.add.image(0, 0, 'coin')
        coinIcon.setScale(originCoinScale)
            
        this.scoreArea.add([bg, scoreBox, scoreTitle, scoreText, coinIcon])
        


        return this.scoreArea
    }

}