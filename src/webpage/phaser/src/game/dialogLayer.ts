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
import { UIHelper, ImageButton } from "@root/UI/UIHelper";


export default class DialogLayer extends Container {
    public welcome: UI.Dialog


    /**
     * 
     * @param scene parent scene
     * @param x container 左上角X 在 scene 中的位置
     * @param y contaienr 左上角Y 在 scene 中的位置
     * @param children 
     */
    constructor(scene: Phaser.Scene, x?: number, y?: number, children?: Phaser.GameObjects.GameObject[]) {
        super(scene, x, y, children)
        // this.testObject()
        this.showWelcome()

    }

    testObject() {
        let testObjj = this.scene.add.image(0, 0,  'plate')
        this.add(testObjj)
    }


    showWelcome() {

        this.welcome = this.createWelcomeDialog(300, 500)
        this.welcome.popUp(500)
    }


    createWelcomeDialog(width: number, height: number): UI.Dialog {
        let scene = this.scene
        let makeContentLabel = (content: string) => {

            let x = width / 2
            let y = height / 2
            let contentLabel = scene.rexUI.add.label({
                x: 0,
                y: 0,
                width: 40, // Minimum width of round-rectangle
                height: 340, // Minimum height of round-rectangle            
                background: scene.rexUI.add.roundRectangle(40, 40, 100, 240, 0, 0xffffff),
                text: scene.add.text(0, 0, content, {
                    fontSize: '20px',
                    color: 0x888888,
                    padding: {
                        left: 20,
                        right: 20,
                        top: 20,
                        bottom: 20,
                    },                    
                    wordWrap: { width: 240, useAdvancedWrap: true }
                }),
                space: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10
                },
            }).layout()


            return contentLabel
        }

        let makeFixWidthPanel = (maxwidth: number, content: string) => {
            let sizer = scene.rexUI.add.fixWidthSizer({
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
                background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 10, 0xffffff),
                panel: {
                    child: makeContentLabel(content),
                    // child: makeFixWidthPanel(240, content),
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
            // insertTextToPanel(scrollPanel, content)

            return scrollPanel
        }

        // x y 用于定位panel的位置  默认 xy 是panel 的中心点
        let x = stageWidth / 2
        let y = stageHeight / 2

        let contentStr =
            `这是一个偷吃汉堡的游戏! \n
⚠️你只可以吃汉堡薯条，喝可乐。\n其他的你都不喜欢吃。\n另外你没有钱，\n只能在厨师看不到你的时候吃。\n\n
把整张脸都放在框内， 通过张嘴就可以偷吃啦过张嘴就可以偷吃啦过张嘴就可以偷吃啦过张嘴就可以偷吃啦
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
                this.createRexUIButton(this.scene, 'OK', 0xf57f17),
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

                // this.scene.resume(GAME_SCENE)


            }, this)
            .on('button.over', function (button, groupName, index, pointer, event) {
                button.getElement('background').setStrokeStyle(1, 0xffffff);
            })
            .on('button.out', function (button, groupName, index, pointer, event) {
                button.getElement('background').setStrokeStyle();
            });

        dialog.layout()//.pushIntoBounds()
        dialog.setDepth(31)
        return dialog
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

}