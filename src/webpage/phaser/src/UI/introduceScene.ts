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

import { EF_SCENE, SETTINGS_SCENE, BACKGROUND, stageHeight, stageWidth, GAME_SCENE, UI_SCENE } from "@root/constants";
import { ImageButton, UIHelper } from "./UIHelper";
import EffectScene from "./EffectScene";
import GameSoundManager from "@root/game/soundManager";

const fontTitleStyle = { font: '46px Berlin', fill: '#ffde00', stroke: '#000', strokeThickness: 7, align: 'center' };
const fontSettingsStyle = { font: '38px Berlin', fill: '#ffde00', stroke: '#000', strokeThickness: 5, align: 'center' };


const frameWidth = 80
const frameHeight = 80
const settingsLeft = stageWidth / 2 - 120
export default class IndtroduceScene extends Phaser.Scene {
    private soundBtn: ImageButton
    private textSound: PhaserText
    private musicBtn: ImageButton
    private textMusic: PhaserText
    private backBtn: ImageButton

    constructor() {
        super(SETTINGS_SCENE)
    }

    preload() {

    }


    create() {


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
            const COLOR_PRIMARY = 0x4e342e;
            const COLOR_LIGHT = 0x7b5e57;
            const COLOR_DARK = 0x260e04;

            let scrollPanel = scene.rexUI.add.scrollablePanel({
                x: width / 2,
                y: height / 2,
                width: 240, // Minimum width of round-rectangle ???
                height: 340, // Minimum height of round-rectangle ???      

                scrollMode: 0,
                background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 10, 0xcccccc),
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
                                fontSize: 18
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

        let contentStr = `Phaser is a fast, free, and fun open source HTML5 game framework that offers WebGL and Canvas rendering across desktop and mobile web browsers. Games can be compiled to iOS, Android and native apps by using 3rd party tools. You can use JavaScript or TypeScript for development.
        Along with the fantastic open source community, Phaser is actively developed and maintained by Photon Storm. As a result of rapid support, and a developer friendly API, Phaser is currently one of the most starred game frameworks on GitHub.
        Thousands of developers from indie and multi-national digital agencies, and universities worldwide use Phaser. You can take a look at their incredible games.`

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

            }, this)
            .on('button.over', function (button, groupName, index, pointer, event) {
                button.getElement('background').setStrokeStyle(1, 0xffffff);
            })
            .on('button.out', function (button, groupName, index, pointer, event) {
                button.getElement('background').setStrokeStyle();
            });

        dialog.layout()//.pushIntoBounds()
        dialog.visible = false
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