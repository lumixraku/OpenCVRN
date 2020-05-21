
console.log(Phaser.AUTO)
console.log(Phaser.AUTO)


import { MSG_TYPE_FACE, MSG_TYPE_CAM, MSG_TYPE_WEBVIEW_READY, UI_SCENE, BASE_SCENE} from '@root/constants';
// import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

const canvasELlem: HTMLCanvasElement = document.querySelector('#gameCanvas')

const stageWidth = document.body.clientWidth;
const stageHeight = document.body.clientWidth / 9 * 16;

const documentWidth = document.body.clientWidth
const documentHeight = document.body.clientHeight

canvasELlem.style.top = `${(documentHeight - stageHeight)/2}px`


import GameScene from '@game/game'
import GameUIScene from '@root/UI/GameUIScene'
import EFScene from '@root/UI/EffectScene'
import SettingsScene from '@root/UI/SettingsScene';

// import GameScene from 'game/game'
// import UIScene from 'UI/UIScene'
// import EFScene from 'UI/EffectScene'
import BaseScene from './BaseScene';
import AssetsScene from '@root/UI/AssetsScene';



const config: Phaser.Types.Core.GameConfig = {
    canvas: canvasELlem,
    type: Phaser.WEBGL,
    // parent: 'phaser-example',
    width: stageWidth,
    height: stageHeight,
    scene: [BaseScene, AssetsScene, GameScene, EFScene, GameUIScene, SettingsScene],
    transparent: true,
    physics: {
        default: 'matter',
        matter: {
            debug: false,
            enableSleeping: true
        }
    },    
    // physics: {
    //     default: 'arcade',
    //     arcade: {
    //         gravity: { y: 300 },
    //         debug: false
    //     }
    // },
    // 这个 npm 包存在问题 //这样引入会报错
    // plugins: {
    //     scene: [
    //     {´´´´´´´´´´´
    //         key: 'rexUI',
    //         plugin: UIPlugin,
    //         mapping: 'rexUI'
    //     },
    //     ]
    // }    
};
const game = new Phaser.Game(config);
console.log(game.scene.isSleeping(BASE_SCENE)) 
// game.scene.add(UI_SCENE, UIManagerScene)
// game.scene.getScene()  game.scene 是 SceneManager  getScene()才是 Phaser.Scene




import { changeMouth, setPreview, testClickEvent } from 'test'

changeMouth(game)
setPreview()
testClickEvent(game)

