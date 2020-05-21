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


import { UI_SCENE, SETTINGS_SCENE, GAME_SCENE, MAIN_RED_LIGHT, MAIN_RED } from "../constants";
import { World } from "matter";
import { UIHelper, ImageButton } from "./UIHelper";
const stageWidth = document.body.clientWidth;
const stageHeight = document.body.clientWidth / 9 * 16;

const TopLeftToCenter = (width: number, height: number, topLeftPoint: Point): Point => {
    let halfW = width/2
    let halfH = height/2
    return new Point( 
        topLeftPoint.x - halfW,
        topLeftPoint.y - halfH
    )
}

export default class GameUIScene extends Phaser.Scene {

    public testView: UI.Dialog
    public welcome: UI.Dialog
    public getCaught: UI.Dialog
    public getCaughtText: PhaserText
    public testGraphic: Graphics
    public scoreArea: Container
    public scoreText: PhaserText

    // UI 
    private settingsBtn: ImageButton


    constructor() {
        super(UI_SCENE);
    }

    preload() {

        // 用到 rexUI scene 必须加载 scenePlugin
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: '/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
    }

    create() {
        this.bindEvents()

        this.addUIBtns()

        // this.showWelcome()
        // this.welcome.visible = false
        // this.getCaught = this.createGetCaughtDialog(stageWidth/2, stageHeight/2) 
        
        
        // this.testView = this.createDemoDialog(this, 0, 0)
        // this.testView.visible = false

        // this.testGraphic = this.add.graphics()
        // this.testGraphic.lineStyle(10, 0x00bb44)
        // this.testGraphic.strokeLineShape( new Phaser.Geom.Line(200, 300, 250, 300))
        // this.testGraphic.rotation = 2* Math.PI

        this.events.emit('afterCreate')
    }

    update(time, delta) {
    }

    showWelcome() {
        this.welcome = this.createWelcomeDialog(this, 300, 500)
        this.welcome.popUp(500)
    }

    bindEvents() {
        this.events.on('wake', () => {
            this.cameras.main.fadeIn(250)
        }, this)
    }


    createWelcomeDialog(scene: Scene, width: number, height: number): UI.Dialog {

        let makeContentLabel = (content: string) => {

            let x = width / 2
            let y = height / 2
            let contentLabel = scene.rexUI.add.label({
                x: 0,
                y: 0,
                width: 40, // Minimum width of round-rectangle
                height: 340, // Minimum height of round-rectangle            
                background: scene.rexUI.add.roundRectangle(40, 40, 100, 240, 0, 0x00ccbb),
                text: scene.add.text(0, 0, content, {
                    fontSize: '12px',
                    color: 0x888888

                }),
                space: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10
                }
            }).layout()


            return contentLabel
        }

        let makeFixWidthPanel = (maxwidth: number, content: string) => {
            let sizer = this.rexUI.add.fixWidthSizer({
                // child: makeContentLabel(content),
                space: {
                    left: 3,
                    right: 3,
                    top: 3,
                    bottom: 3,
                    item: 8,
                    line: 8,
                }
            })
            return sizer
        }

        let makeScrollSizer = (content: string): UI.ScrollablePanel => {
            // const COLOR_PRIMARY = 0x4e342e;
            // const COLOR_LIGHT = 0x7b5e57;
            // const COLOR_DARK = 0x260e04;

            let scrollPanel = scene.rexUI.add.scrollablePanel({
                x: width / 2,
                y: height / 2,
                width: 240, // Minimum width of round-rectangle ???
                height: 340, // Minimum height of round-rectangle ???      

                scrollMode: 0,
                background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 10, 0xffffff),
                panel: {
                    // child: makeContentLabel(content),
                    child: makeFixWidthPanel(240, content),
                    mask: {
                        padding: 1
                    },
                },

                // slider: {
                //     track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_DARK),
                //     thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, COLOR_LIGHT),
                // },

                space: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10,

                    panel: 0,
                }
            }).layout()

            let insertTextToPanel = (panel: UI.ScrollablePanel, content: string) => {
                var sizer = panel.getElement('panel');
                var scene = panel.scene;

                sizer.clear(true);
                var lines = content.split('\n');
                for (var li = 0, lcnt = lines.length; li < lcnt; li++) {
                    var words = lines[li].split(' ');
                    for (var wi = 0, wcnt = words.length; wi < wcnt; wi++) {
                        sizer.add(
                            scene.add.text(0, 0, words[wi], {
                                fontSize: 18,
                                color: '#666'
                            })
                            // .setInteractive()
                            // .on('pointerdown', function () {
                            //     this.scene.print.text = this.text;
                            //     this.setTint(Phaser.Math.Between(0, 0xffffff))
                            // })
                        );
                    }
                    if (li < (lcnt - 1)) {
                        sizer.addNewLine();
                    }
                }


                panel.layout();
                return panel;

            }
            insertTextToPanel(scrollPanel, content)
            return scrollPanel
        }

        // x y 用于定位panel的位置  默认 xy 是panel 的中心点
        let x = stageWidth / 2
        let y = stageHeight / 2

        let contentStr = 
`这是一个偷吃汉堡的游戏! \n
⚠️你只可以吃汉堡薯条，喝可乐。\n其他的你都不喜欢吃。\n另外你没有钱，\n只能在厨师看不到你的时候吃。\n\n
把整张脸都放在框内， 通过张嘴就可以偷吃啦
`

        // 默认x y 是 Dialog 中心位置   也就是说 Pivot 默认是 center 
        let dialog = scene.rexUI.add.dialog({
            x: x,
            y: y,
            width: width,
            // height: height,

            // background 并不在意大小的
            background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, MAIN_RED),

            title: scene.rexUI.add.label({
                background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, MAIN_RED_LIGHT),
                text: scene.add.text(0, 0, 'Eat Burger AR Game', {
                    fontSize: '20px',
                    color: '#FC6158', //string
                }),
                space: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10
                }
            }),

            // content: makeContentLabel(contentStr),
            content: makeScrollSizer(contentStr),
            actions: [
                this.createRexUIButton(this, 'OK', 0xf57f17),
            ],

            actionsAlign: '  center  ',
            space: {
                title: 10,
                action: 45, // ?? 没有效果 
                content: 25, //指 content 下方的空白区域高度

                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
            }
        })

        dialog
            .on('button.click', function (button, groupName, index, pointer, event) {
                // this.print.text += groupName + '-' + index + ': ' + button.text + '\n';
                dialog.scaleDownDestroy(100);

                this.scene.resume(GAME_SCENE)


            }, this)
            .on('button.over', function (button, groupName, index, pointer, event) {
                button.getElement('background').setStrokeStyle(1, 0xffffff);
            })
            .on('button.out', function (button, groupName, index, pointer, event) {
                button.getElement('background').setStrokeStyle();
            });

        dialog.layout()//.pushIntoBounds()
            

        return dialog
    }

    createDemoDialog(scene: Scene, x: number, y: number): UI.Dialog {

        scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0xe91e63)
        return scene.rexUI.add.dialog({
            x: x,
            y: y,

            background: scene.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0xf57f17),

            title: scene.rexUI.add.label({
                background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0xbc5100),
                text: scene.add.text(0, 0, 'Pick a color', {
                    fontSize: '20px'
                }),
                space: {
                    left: 15,
                    right: 15,
                    top: 10,
                    bottom: 10
                }
            }),

            actions: [
                scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0xe91e63),
                scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x673ab7),
                scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x2196f3),
                scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x00bcd4),
                scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x4caf50),
                scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0xcddc39),
            ],

            actionsAlign: 'left',

            space: {
                title: 10,
                action: 5,

                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
            }
        })
            .layout()
            .pushIntoBounds()
            //.drawBounds(this.add.graphics(), 0xff0000)
            .popUp(500);



    }

    createCaughtText(x: number, y: number, cb: Function): Container {
        let containerWidth = 400
        let containerHeight = 100
        let containerPos = new Point(stageWidth / 2, stageHeight / 2 * 1.6)
        let container = this.add.container(containerPos.x, containerPos.y)


        // (250,  50) 这个点是相对于容器左上角而言的
        let toastPos = TopLeftToCenter(400, 100, new Point(250,  50) )
        let toastText = this.add.text(toastPos.x, toastPos.y ,
            'You get Caught!!', 
            { 
                fontFamily: 'Berlin',
                stroke: '#000',
                fontSize: 30, 
                strokeThickness: 4, 
                align: 'center'
            }
        )
        // this.hasCaughtToast = true
        // toastText.x = stageWidth / 2
        // toastText.y = stageHeight / 2
        toastText.setOrigin(0.5)

        // let bg = this.rexUI.add.roundRectangle(0, 0, 100, 240, 0, 0x00ccbb)
        // 使用graphics的时候都是从左上角开始画  
        // 而 container 的默认origin 是中心位置， （且无法更改？？）
        // 添加元素的时候也是将子元素的origin 和 父容器的origin 对齐
        // graphic 的 origin 是左上角

        // f9ebe9
        let bg = UIHelper.drawRoundRectWithBorder(
            this,
            new Rectagle(-containerWidth / 2, -containerHeight / 2, containerWidth, containerHeight),
            20,
            MAIN_RED_LIGHT,
            5,
            MAIN_RED,
        )
        
        let AlternativeEmoji = ['sad', 'cry', 'sour']
        let hitEmoji = Phaser.Math.RND.pick(AlternativeEmoji)

        let emojiPos = TopLeftToCenter(400, 100, new Point(50, 50))
    
        let emojiFace = this.add.image(emojiPos.x, emojiPos.y, hitEmoji)
        emojiFace.setScale(0.2)

        
        container.add([bg, emojiFace, toastText])
        container.setScale(0)

        this.tweens.add({
            targets: container,
            scale: 1,
            duration: 132,
            x: containerPos.x,
            y: containerPos.y,
            ease: ' Elastic.In',
            onComplete: () => {
                setTimeout(() => {
                    this.tweens.add({
                        targets: container,
                        // y: stageHeight * 1.2,
                        x: containerPos.x,
                        y: containerPos.y,                        
                        scale: 0,
                        duration: 132,
                        ease: ' Elastic.Out',
                        onComplete: () => {
                            container.destroy()
                        }
                    })
                }, 532)
            }
        })
        return container
    }

    createGetCaughtDialog(x: number, y: number): UI.Dialog {
        let scene = this
        scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0xe91e63)

        // 你被抓住了 计划从左移动到右 这样的形式进入屏幕 显示
        // 然后发现做不到  Dialog 一定会在屏幕区域内显示
        let popup = scene.rexUI.add.dialog({
            x: 0, // 所以一开始在左边放起来
            y: 0,

            background: scene.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0xf57f17),
            content: scene.rexUI.add.label({
                background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0xbc5100),
                text: scene.add.text(0, 0, '\nYou get Caught!!\n', {
                    fontSize: '30px'
                }),
                space: {
                    left: 15,
                    right: 15,
                    top: 10,
                    bottom: 10
                }
            }),
            // title: scene.rexUI.add.label({
            //     background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0xbc5100),
            //     text: scene.add.text(0, 0, 'Pick a color', {
            //         fontSize: '20px'
            //     }),
            //     space: {
            //         left: 15,
            //         right: 15,
            //         top: 10,
            //         bottom: 10
            //     }
            // }),

            // actions: [
            //     scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0xe91e63),
            //     scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x673ab7),
            //     scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x2196f3),
            //     scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x00bcd4),
            //     scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x4caf50),
            //     scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0xcddc39),
            // ],

            actionsAlign: 'left',

            space: {
                title: 10,
                action: 5,

                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
            }
        })
            .layout()
            .pushIntoBounds()
        //.drawBounds(this.add.graphics(), 0xff0000)
        // .popUp(500);

        // this.tweens.add({
        //     targets: popup,
        //     x: stageWidth/2,
        //     y: stageHeight/2,
        //     duration: 400,
        //     ease: 'Power3',
        //     yoyo: true,
        //     onComplete: () => {

        //     }
        // })

        return popup

    }

    createRexUIButton(scene: Scene, text: string, color: any, space?: any) {
        return scene.rexUI.add.label({
            x: 0,
            y: 100,
            width: 40, // Minimum width of round-rectangle
            height: 40, // Minimum height of round-rectangle

            background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x5e92f3),

            text: scene.add.text(0, 0, text, {
                fontSize: '24px'
            }),

            space: space || {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }
        });
    }


    addUIBtns() {
        
        let settingsClick = (e) => {
            UIHelper.fadeToAddAnotherScene(SETTINGS_SCENE, this)


            // this.scene.get(SETTINGS_SCENE).cameras.main.fadeIn(0)
            // this.cameras.main.fadeOut(250);

            // if (!this.scene.isActive(SETTINGS_SCENE) &&
            //     !this.scene.isPaused(SETTINGS_SCENE) &&
            //     !this.scene.isSleeping(SETTINGS_SCENE)
            // ) {
            //     this.scene.launch(SETTINGS_SCENE)
            // } else {
            //     if (this.scene.isSleeping(SETTINGS_SCENE)) {
            //         this.scene.wake(SETTINGS_SCENE);
            //     }
            // }
        }
        settingsClick.bind(this)
        this.settingsBtn = new ImageButton(this, 50, 50, 'button-settings', settingsClick)
        this.add.existing(this.settingsBtn);

    }

}

