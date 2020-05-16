import { Scene } from "phaser";
import { DOGCOOK, ASSETS_SCENE, UI_SCENE, EF_SCENE, GAME_SCENE, SOUNDKEY, MUSICKEY } from "@root/constants";
import GameSoundManager from "@root/game/soundManager";
// import { DOGCOOK } from "../constants";



export default class AssetsScene extends Scene {
    constructor() {
        super(ASSETS_SCENE)
    }

    preload() {
        this.loadUIAssets()    
        this.loadPics()
        this.loadEmojiAssets()
        this.loadDogeAnimationAssets() 
        
        this.loadMusic()
    }

    create() {

        // 这些逻辑不能放在 index 中  因为他们需要资源加载完成之后才能加载 
        this.scene.launch(GAME_SCENE)
        this.scene.launch(EF_SCENE)
        this.scene.launch(UI_SCENE)        

        GameSoundManager.initMusic(this)
    
    }




    loadPics() {
        let scene = this;
        // yarn run dev 的时候 这个资源也还是从 dist 中读取的
        scene.load.image('bgImg', 'assets/kitchen.png');
        scene.load.image('table', 'assets/table.png');
        scene.load.image('light', 'assets/light.png');

        scene.load.image('food0', 'assets/burger.png');
        scene.load.image('food1', 'assets/burrito.png');
        scene.load.image('food2', 'assets/cheese-burger.png');
        scene.load.image('food3', 'assets/chicken-leg.png');
        scene.load.image('food4', 'assets/french-fries.png');
        scene.load.image('food5', 'assets/donut.png');


        // // 应当使用 gif 中的某一帧
        // // scene.load.image('dogcook', 'assets/back.png');
        scene.load.image(DOGCOOK, `assets/dogeFrame/frame_00_delay-0.04s.gif`)

    }

    loadDogeAnimationAssets() {



        let scene = this
        let endIndex = 47

        for (let idx = 0; idx <= endIndex; idx++) {
            let idxStr = (idx < 10) ? '0' + idx : '' + idx
            let fname = `assets/dogeFrame/frame_${idxStr}_delay-0.04s.gif`
            let keyname = `dogeFrame${idx}`;

            scene.load.image(keyname, fname)

        }
    }

    loadEmojiAssets() {
        let scene = this;
        scene.load.image('sad', `assets/sad.png`)
        scene.load.image('cry', `assets/cry.png`)
        scene.load.image('sour', `assets/sour.png`)

    }

    loadUIAssets() {
        let scene = this;

        // let loadFn = scene.load.spritesheet
        // loadFn.apply(scene.load, ['button-sound-on', `assets/UI/button-sound-on.png`, { frameWidth: 80, frameHeight: 80 }])
        // loadFn.apply(scene.load, ['button-sound-off', `assets/UI/button-sound-off.png`, { frameWidth: 80, frameHeight: 80 }])
        // loadFn.apply(scene.load, ['button-settings', `assets/UI/button-settings.png`, { frameWidth: 80, frameHeight: 80 }])
        scene.load.image('background', 'assets/UI/background.png');


        scene.load.spritesheet('button-sound-on', `assets/UI/button-sound-on.png`, { frameWidth: 80, frameHeight: 80 })
        scene.load.spritesheet('button-sound-off', `assets/UI/button-sound-off.png`, { frameWidth: 80, frameHeight: 80 })
        scene.load.spritesheet('button-music-on', `assets/UI/button-music-on.png`, { frameWidth: 80, frameHeight: 80 })
        scene.load.spritesheet('button-music-off', `assets/UI/button-music-off.png`, { frameWidth: 80, frameHeight: 80 })

        scene.load.spritesheet('button-back', `assets/UI/button-back.png`, { frameWidth: 70, frameHeight: 70 })

        scene.load.spritesheet('button-settings', `assets/UI/button-settings.png`, { frameWidth: 80, frameHeight: 80 })                

        
    }


    loadMusic(){
        let scene = this
        scene.load.audio(SOUNDKEY, ['assets/audio/audio-button.m4a', 'assets/audio/audio-button.mp3', 'assets/audio/audio-button.ogg'])
        scene.load.audio(MUSICKEY, ['assets/audio/music-bitsnbites-liver.m4a', 'assets/audio/music-bitsnbites-liver.mp3', 'assets/audio/music-bitsnbites-liver.ogg'])
    }

}