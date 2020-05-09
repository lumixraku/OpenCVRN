import { Scene } from "phaser";
import { createHoldsDialog, createDemoDialog } from "./Dialogs";
import { UI_SCENE } from "@root/constants";

const stageWidth = document.body.clientWidth;
const stageHeight = document.body.clientHeight;


export default class UIManagerScene extends Phaser.Scene{

    
    public testView: UI.Dialog
    public holdsOn: UI.Dialog
    constructor() {
        debugger
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
        this.holdsOn = createHoldsDialog(this, 300, 500)
        this.testView = this.createDemoDialog(this, 0, 0)

    }

    createDemoDialog(scene: Scene, x: number, y: number):UI.Dialog {

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
    
    
}

