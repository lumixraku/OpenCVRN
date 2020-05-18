import { Scene } from "phaser";
import HTML5AudioSound = Phaser.Sound.HTML5AudioSound
import BaseSound = Phaser.Sound.BaseSound
import { SOUNDKEY, MUSICKEY } from "@root/constants";
import { Base } from "UI";

export default class GameSoundManager {
    static soundMode: boolean = true
    static musicMode: boolean = true

    static sound: BaseSound
    static bgmusic:BaseSound

    static scene: Scene
    

    static initMusic(scene: Scene){
        GameSoundManager.scene = scene
        

        GameSoundManager.sound = GameSoundManager.scene.sound.add(SOUNDKEY, {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0            
        });

        GameSoundManager.bgmusic = GameSoundManager.scene.sound.add(MUSICKEY, {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        })
        GameSoundManager.bgmusic.play()
    }



    static toggleSoundMode(){
        GameSoundManager.soundMode = !GameSoundManager.soundMode
        
        
    }

    static playSound() {
        if (GameSoundManager.soundMode && GameSoundManager.sound) {
            GameSoundManager.sound.play()
        }
    }


    static toogleMusicMode(){
        GameSoundManager.musicMode = !GameSoundManager.musicMode
        if (!GameSoundManager.musicMode) {
            GameSoundManager.bgmusic.pause()
        }else{
            GameSoundManager.bgmusic.resume()
        }
    }
}