# Phaser 3 Webpack Project Template

A Phaser 3 Project Template


## Start
At first this project was generated by `phaser3-project-template`,  a package that mentioned in offical doc, but there was no typescript config.

Then I followed this article and update webpack version.

https://www.freecodecamp.org/news/how-to-build-a-simple-game-in-the-browser-with-phaser-3-and-typescript-bdc94719135/


Then I found [phaser3-typescript-project-template](https://github.com/photonstorm/phaser3-typescript-project-template), it was build by rollup.

I prefer rollup than webpack.

### Not compile phaser
By now, you can start to develop. But phaser itself would be packaged into your dist.js each time when you change your code, that would be very slow.

Phaser should be import as a third lib. It should not be package in your dist.js.


Remove `import 'phaser'` in your code. then add phaser.d.ts in your src folder. Add phaser.min.js in html.


## Tutourial
https://phaser.io/tutorials/making-your-first-phaser-3-game/part1

https://phaser.io/tutorials/getting-started-phaser3/part5

http://labs.phaser.io/   对应的repo  git@github.com:photonstorm/phaser3-examples.git


### About extends sprite in Phaser3
https://phasergames.com/extend-a-sprite-in-phaser-3/?mc_cid=3f4ee26e5d&mc_eid=a4d9ee0291


### About RexUI
https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-overview/
https://codepen.io/rexrainbow/pen/MPZWZG
https://github.com/rexrainbow/phaser3-rex-notes

## some tips to understand Phaser
- 创建对象的方式
- 利用scene 来实现层级
- Phaser.Sprite 中可以 play 动画  但是 Phaser.Image 不行
- Phaser 可以通过操作 frame 来切换 image 实际显示的内容


## Trouble Shooting



### About webpack config.
If you config baseUrl in tsconfig.json, Go to defintion would works fine in vscode after `window reload`, but webpack does not recoginize it.

You need `TsconfigPathsPlugin` to read module path settings in tsconfig.

Read more

https://www.npmjs.com/package/tsconfig-paths-webpack-plugin

https://stackoverflow.com/questions/41081851/baseurl-and-paths-resolution-using-webpack-2-and-awesome-typescript-loader

https://github.com/s-panferov/awesome-typescript-loader/issues/311


### webpack `__extends not defined`
set `"noEmitHelpers": false,`


### About Rollup Config
(!) Missing global variable name
Use output.globals to specify browser global variable names corresponding to external modules
phaser (guessing 'phaser')

https://github.com/rollup/rollup-plugin-babel/issues/162


### Physics.add Error

https://github.com/photonstorm/phaser/issues/3754


### About d.ts for ES6

https://github.com/microsoft/dts-gen/issues/42
Doesn't seem to be working on ES6 modules at all

https://github.com/Microsoft/dts-gen/issues/86
Even peer dependencies installed still not work.


https://stackoverflow.com/questions/46636318/dts-gen-fails-to-find-globally-installed-modules/46640889#46640889
The post suggests not installing global but local instead.

### About webfontloader
'WebFont' refers to a UMD global, but the current file is a module. Consider adding an import instead.


```
import * as WebFont from 'webfontloader';
```
webfontloader are written in UMD, so you should import like this.


The method mentioned above would not working.
See this https://github.com/typekit/webfontloader/issues/393
```
window.WebFont.load(...);
```


### Tweens
https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ease-function/


### sleep & wake
https://www.html5gamedevs.com/topic/39799-scene-wake-is-not-called/

```
            this.scene.sleep('sceneA')
            this.scene.launch('sceneB')
            this.scene.wake('sceneB');
```
https://stackoverflow.com/questions/53238869/phaser3-scenes-transitions

In phaser 3, the start function actually SHUTS DOWN the previous scene as it starts the new one.


## Read More

### Progressbar
https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/?a=13

### multi scenes
https://www.html5gamedevs.com/topic/37708-setting-up-a-game-for-multiple-scenes-using-preload-create-and-update/

https://labs.phaser.io/edit.html?src=src%5Cscenes%5Cchange%20scene%20from%20create%20es6.js

### Some Fonts
https://www.cufonfonts.com/fonts/list/language/english/2
https://www.1001fonts.com/comic+google-web-fonts.html?page=2&items=10


### Spritesheets VS. Atlas
https://www.html5gamedevs.com/topic/3007-spritesheets-v-atlases/