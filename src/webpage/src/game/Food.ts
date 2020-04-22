import * as PIXI from 'pixi.js'
import { Vector2 } from '@game/Vector'
import { IResourceDictionary, ITextureDictionary } from 'pixi.js';


const Application = PIXI.Application;
const Container = PIXI.Container;
const loader = PIXI.loader;
const resources = PIXI.loader.resources;
const TextureCache = PIXI.utils.TextureCache;
const Sprite = PIXI.Sprite;


class Food extends PIXI.Sprite {
    eating: boolean
    moving: boolean
    miss: boolean
    textures: ITextureDictionary
    width: number
    height: number
    bounds: PIXI.Rectangle
    degree: number; //弧度制 45° 就用数字45 表示

    constructor() {
        let resourceMap = resources["/images/animals.json"].textures;
        super(resourceMap["cat.png"]);
        this.textures = resourceMap
        // new Sprite(resourceMap["cat.png"]);
        this.bounds = this.getBounds()
        this.width = this.bounds.width
        this.height = this.bounds.height
        this.pivot.x = this.width / 2
        this.pivot.y = this.height / 2

        this.degree = 0
    }

    changeTexture() {
        this.texture = this.textures["hedgehog.png"]
    }

    centerPosToLeftTopPos(x: number, y: number): Vector2 {
        return new Vector2(x - this.width / 2, y - this.height / 2)
    }
}


export default Food