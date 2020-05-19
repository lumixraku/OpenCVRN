import { EF_SCENE, SETTINGS_SCENE, BACKGROUND, stageHeight, stageWidth, GAME_SCENE, UI_SCENE } from "@root/constants";
import { ImageButton, UIHelper } from "./UIHelper";
import EffectScene from "./EffectScene";
import GameSoundManager from "@root/game/soundManager";
import PhaserImage = Phaser.GameObjects.Image;


const fontTitleStyle = { font: '46px Berlin', fill: '#ffde00', stroke: '#000', strokeThickness: 7, align: 'center' };
const fontSettingsStyle = { font: '38px Berlin', fill: '#ffde00', stroke: '#000', strokeThickness: 5, align: 'center' };


const frameWidth = 80
const frameHeight = 80
const settingsLeft = stageWidth / 2 - 120
export default class SettingsScene extends Phaser.Scene {
    private soundBtn: ImageButton
    private textSound: PhaserText
    private musicBtn: ImageButton
    private textMusic: PhaserText
    private backBtn: ImageButton

        constructor() {
            super(SETTINGS_SCENE)
        }

        preload () {

        }


        create() {
            this.cameras.main.fadeIn(0)

            this.bindEvents()

            this.createBackground()
            this.createTitle()
            this.createSoundBtn()
            this.createMusicBtn()
            this.createBackBtn()
            
        }
        bindEvents() {
            this.events.on('wake', () => {
                this.cameras.main.fadeIn(0)
            }, this)
        }


        createBackground() {
            this.add.sprite(0, 0, BACKGROUND).setOrigin(0, 0);
            
        }


        createTitle() {

            // text 的默认origin 是 0 0
            let settingsText = this.add.text(stageWidth/2, 50, 'settings', fontTitleStyle);
            settingsText.setOrigin(0.5, 0.5)

        }

        createBackBtn() {

            let backClick = () => {
                GameSoundManager.playSound()
                UIHelper.fadeToPrevScene(UI_SCENE, this)
                // this.scene.get(UI_SCENE).cameras.main.fadeIn(0)
                // this.cameras.main.fadeOut(250);
                // this.time.addEvent({
                //     delay: 250,
                //     callback: function () {
                //         this.scene.sleep(SETTINGS_SCENE);
                //     },
                //     callbackScope: this                    
                // })

            }

            this.backBtn = new ImageButton(this, 50, 50, 'button-back', backClick)
            this.add.existing(this.backBtn)

        }


        createSoundBtn(){
            let clickSound = () => {
                GameSoundManager.toggleSoundMode()
                if ( GameSoundManager.soundMode) {
                    this.textSound.text = 'Sound: OFF'
                }else {
                    this.textSound.text = 'Sound: ON!'

                }
            }

            let soundHeight = 150
            this.soundBtn = new ImageButton(this, settingsLeft, soundHeight, 'button-sound-on', clickSound);
            this.textSound = this.add.text(settingsLeft + frameHeight / 2, soundHeight, 'Sound: ON!', fontSettingsStyle);
            this.textSound.setOrigin(0, 0.5);
            this.add.existing(this.soundBtn)
        }



        createMusicBtn(){
            let clickMusic = () => {
                GameSoundManager.toogleMusicMode()
                if (!GameSoundManager.musicMode) {
                    this.textMusic.text = 'Music: OFF'
                } else {
                    this.textMusic.text = 'Music: ON!'

                }
            }

            let musicHeight = 250
            this.musicBtn = new ImageButton(this, settingsLeft, musicHeight, 'button-music-on', clickMusic);
            this.textMusic = this.add.text(settingsLeft + frameHeight / 2, musicHeight, 'Music: ON!', fontSettingsStyle);
            this.textMusic.setOrigin(0, 0.5);


            this.add.existing(this.musicBtn)            

        }
}