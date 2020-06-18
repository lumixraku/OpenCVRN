import { Scene } from "phaser";
import { DOGCOOK, ASSETS_SCENE, UI_SCENE, EF_SCENE, GAME_SCENE, SOUNDKEY, MUSICKEY, stageWidth, stageHeight, GetTheme } from "@root/constants";
import GameSoundManager from "@root/game/soundManager";
// import { DOGCOOK } from "../constants";


export default class AssetsScene extends Scene {
    private bgColor: Graphics
    private progressBar: Graphics
    private loadingText: PhaserText
    private assetText: PhaserText
    private percentText:PhaserText

    constructor() {
        super(ASSETS_SCENE)
    }

    preload() {
        this.addLoadingProgressUI()

        this.load.on('progress', (value) => {
            value = value.toFixed(2)
            this.percentText.setText( value * 100 + '%');
            this.progressBar.clear();
            this.progressBar.fillStyle(0xffde00, 1);
            this.progressBar.fillRect(stageWidth/2 - 150, stageHeight/2, 300 * value, 30);
        });


        // not work
        this.load.on('fileprogress', (file, value)  =>  {
            this.assetText.setText('Loading asset: ' + file.key);
        });

        this.load.on('complete', () => {
            this.progressBar.destroy();
            // this.progressBox.destroy();
            this.loadingText.destroy();
            this.percentText.destroy();
            this.assetText.destroy();
        });


        this.loadUIAssets()
        this.loadPics()
        this.loadEmojiAssets()
        this.loadDogeAnimationAssets()

        this.loadMusic()        

    }

    create() {

        // 这些逻辑不能放在 index.ts 中  因为他们需要资源加载完成之后才能加载      
        this.scene.switch(GAME_SCENE)
    }

    addLoadingProgressUI() {
        this.bgColor = this.add.graphics()
        this.bgColor.beginPath()
        // this.bgColor.strokeRoundedRect(0, 0, stageWidth, stageHeight, 20)
        this.bgColor.fillStyle(0xeeeeee)
        this.bgColor.fillRoundedRect(0, 0, stageWidth, stageHeight, 20)
        this.bgColor.closePath()

        this.progressBar = this.add.graphics();

        this.loadingText = this.make.text({
            x: stageWidth / 2 -50,
            y: stageHeight / 2 - 50,
            text: 'Loading... ',
            style: {
                font: '18px monospace',
                fill: '#666666'
            }
        }).setOrigin(0.5)

        this.percentText = this.make.text({
            x: stageWidth / 2 + 50 ,
            y: stageHeight / 2 - 50,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#666666'
            }            
        }).setOrigin(0.5)
        this.assetText = this.make.text({
            x: stageWidth / 2,
            y: stageHeight / 2 + 150,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#666666'
            }
        }).setOrigin(0.5)

    }



    loadPics() {
        let scene = this;
        let theme = GetTheme()
        // yarn run dev 的时候 这个资源也还是从 dist 中读取的
        scene.load.image('cookbody', `assets/${theme}/cookdefault.png`)
        scene.load.image('cookchecking', `assets/${theme}/cookchecking.png`);
        scene.load.image('bgImg', `assets/${theme}/kitchen.jpg`);
        scene.load.image('table', `assets/${theme}/fixedTable.png`);
        scene.load.image('hat', `assets/${theme}/hat.png`);
        scene.load.image('body', `assets/${theme}/body.png`)

        // online tool https://gammafp.com/tools/
        scene.load.atlas("foods", "assets/food/food-by-atlas-packer.png", "assets/food/food-by-atlas-packer_atlas.json")


        scene.load.image('plate', 'assets/plate.png')
        scene.load.image('coin', 'assets/coin.png');
        scene.load.image('hammer', 'assets/hammer.png');
        scene.load.image('dizzy1', 'assets/dizzy1.png');
        scene.load.image('dizzy2', 'assets/dizzy2.png');
           
        scene.load.image('ground', 'assets/ground.png');
        // // 应当使用 gif 中的某一帧
        // // scene.load.image('dogcook', 'assets/back.png');

        scene.load.image(DOGCOOK, `assets/dogeFrame/frame_00_delay-0.04s.gif`)

    }

    loadDogeAnimationAssets() {

        let scene = this
        scene.load.atlas("dogeTurn", "assets/dogeFrame/dogeTurn.png", "assets/dogeFrame/dogeTurn.json")
        // scene.load.atlas("dogeTurnBack", "assets/dogeFrame/dogeTurnBack.png", "assets/dogeFrame/dogeTurnBack.json")
        // scene.load.atlas("dogeCookAgain", "assets/dogeFrame/dogeCookAgain.png", "assets/dogeFrame/dogeCookAgain.json")



        // let endIndex = 47
        // for (let idx = 0; idx <= endIndex; idx++) {
        //     let idxStr = (idx < 10) ? '0' + idx : '' + idx
        //     let fname = `assets/dogeFrame/frame_${idxStr}_delay-0.04s.gif`
        //     let keyname = `dogeFrame${idx}`;
        //     scene.load.image(keyname, fname)
        // }
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
        // scene.load.atlas('UIButtons', 'assets/UI/UIButtons.png', 'assets/UI/UIButtons.json')
    }


    loadMusic(){
        let scene = this
        scene.load.audio(SOUNDKEY, ['assets/audio/audio-button.m4a', 'assets/audio/audio-button.mp3', 'assets/audio/audio-button.ogg'])
        scene.load.audio(MUSICKEY, ['assets/audio/music-bitsnbites-liver.m4a', 'assets/audio/music-bitsnbites-liver.mp3', 'assets/audio/music-bitsnbites-liver.ogg'])
    }

}