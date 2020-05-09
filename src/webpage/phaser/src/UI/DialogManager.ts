import { Scene } from "phaser";
import { UI_SCENE } from "@root/constants";

const stageWidth = document.body.clientWidth;
const stageHeight = document.body.clientHeight;


export default class UIManagerScene extends Phaser.Scene {


    public testView: UI.Dialog
    public holdsOn: UI.Dialog
    constructor() {
        super(UI_SCENE);
    }

    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: '/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
    }

    create() {
        this.holdsOn = this.createHoldsDialog(this, 300, 500)
        this.testView = this.createDemoDialog(this, 0, 0)

        this.testView.visible = false

    }

    update(time, delta) {
    }

    createHoldsDialog(scene: Scene, width: number, height: number): UI.Dialog {
        let x = stageWidth / 2
        let y = stageHeight / 2

        let content = `
The Fox went out on a chilly night\n
The Fox went out on a chilly night\n
The Fox went out on a chilly night\n`

        // 默认x y 是 Dialog 中心位置   也就是说 Pivot 默认是 center 
        let dialog = scene.rexUI.add.dialog({
            x: x,
            y: y,
            width: width,
            // height: height,

            // background 并不在意大小的
            background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0xf57f17),

            title: scene.rexUI.add.label({
                background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0xbc5100),
                text: scene.add.text(0, 0, 'Notice', {
                    fontSize: '20px'
                }),
                space: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10
                }
            }),

            content: scene.rexUI.add.label({
                width: 40, // Minimum width of round-rectangle
                height: 240, // Minimum height of round-rectangle            
                background: scene.rexUI.add.roundRectangle(0, 0, 100, 240, 20, 0xffffff),
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
            }),
            actions: [
                this.createButton(this, 'OK', 0xf57f17),
            ],

            actionsAlign: 'center',
            space: {
                title: 10,
                action: 45, // ?? 没有效果 
                content: 115, //指 content 下方的内容

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

    createButton(scene: Scene, text:string, color: any, space?: any) {
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

