declare namespace UI {
    class UIPlugin {
        constructor(scene: any, pluginManager: any);
        add: ObjectFactory;
        get viewport(): any;
    }    
    
    
    class ObjectFactory {
        static register(type: any, callback: any): void;
        constructor(scene: any);
        scene: any;
        dialog(config: any): Dialog;
        roundRectangle(x: any, y: any, width: any, height: any, radiusConfig: any, fillColor: any, fillAlpha?: any): RoundRectangle;
        label(config: any): Label;
        circle(x: any, y: any, radius: any, color: any)
    }

    class Label extends Sizer {
        constructor(scene: any, config: any);
        set text(arg: any);
        get text(): any;
        setText(value: any): Label;
        setActive(value: boolean): this;
        // setState(value: integer | string): this;
        // setName(value: string): this;
        appendText(value: any): void;
        layout(parent: any, newWidth: any, newHeight: any): Label;
        resize(width: any, height: any): Label;
        setOrientation(orientation: any): Label;
        setMinSize(minWidth: any, minHeight: any): Label;
        setMinWidth(minWidth: any): Label;
        setMinHeight(minHeight: any): Label;
        alignLeft(value: any): Label;
        alignRight(value: any): Label;
        alignCenterX(value: any): Label;
        alignTop(value: any): Label;
        alignBottom(value: any): Label;
        alignCenterY(value: any): Label;
        add(gameObjects: any): Label;
        remove(gameObjects: any, destroyChild: any): Label;
        clear(destroyChild: any): Label;
    }


    class Text {
        constructor(scene: any, x: any, y: any, text: any, style: any, type: any, parser: any);
        renderer: any;
        canvas: any;
        context: any;
        style: TextStyle;
        autoRound: boolean;
        _text: any;
        padding: {
            left: number;
            right: number;
            top: number;
            bottom: number;
        };
        width: number;
        height: number;
        dirty: boolean;
        _crop: any;
        texture: any;
        frame: any;
        canvasText: any;
        set text(arg: any);
        get text(): any;
        initRTL(): void;
        originX: number;
        setText(value: any): Text;
        setStyle(style: any): any;
        setFont(font: any): any;
        setFontFamily(family: any): any;
        setFontSize(size: any): any;
        setFontStyle(style: any): any;
        setFixedSize(width: any, height: any): any;
        setBackgroundColor(color: any): any;
        setFill(color: any): any;
        setColor(color: any): any;
        setStroke(color: any, thickness: any): any;
        setShadow(x: any, y: any, color: any, blur: any, shadowStroke: any, shadowFill: any): any;
        setShadowOffset(x: any, y: any): any;
        setShadowColor(color: any): any;
        setShadowBlur(blur: any): any;
        setShadowStroke(enabled: any): any;
        setShadowFill(enabled: any): any;
        setWrapMode(mode: any): any;
        setWrapWidth(width: any): any;
        setAlign(align: any): any;
        setLineSpacing(value: any): any;
        setPadding(left: any, top: any, right: any, bottom: any): Text;
        setResolution(value: any): any;
        setMaxLines(max: any): any;
        updateText(runWrap: any): Text;
        getTextMetrics(): {
            ascent: any;
            descent: any;
            fontSize: any;
        };
        toJSON(): any;
        preDestroy(): void;
        setInteractive(shape: any, callback: any, dropZone: any): Text;
        getWrappedText(text: any, start: any, end: any): any;
        getPlainText(text: any, start: any, end: any): string;
        getText(text: any, start: any, end: any): string;
        getSubString(text: any, start: any, end: any): string;
        copyPenManager(penManager: any): any;
        getPenManager(text: any, penManager: any): any;
        setSize(width: any, height: any): any;
        resize(width: any, height: any): any;
        set lineSpacing(arg: any);
        get lineSpacing(): any;
        get imageManager(): any;
        addImage(key: any, config: any): Text;
        drawAreaBounds(graphics: any, color: any): Text;
    }

    class RoundRectangle {
        constructor(scene: any, x: any, y: any, width: any, height: any, radiusConfig: any, fillColor: any, fillAlpha: any);
        updateData(): RoundRectangle;
        pathIndexes: any;
        set width(arg: any);
        get width(): any;
        set height(arg: any);
        get height(): any;
        resize(width: any, height: any): RoundRectangle;
        set iteration(arg: any);
        get iteration(): any;
        _iteration: any;
        setIteration(iteration: any): RoundRectangle;
        set radius(arg: any);
        get radius(): any;
        setRadius(value: any): RoundRectangle;
        set cornerRadius(arg: any);
        get cornerRadius(): any;
        setCornerRadius(value: any): RoundRectangle;
    }    

    class TextStyle {
        constructor(text: any, style: any);
        parent: any;
        metrics: any;
        setStyle(style: any, updateText: any): any;
        _font: any;
        color: any;
        syncFont(canvas: any, context: any): void;
        syncStyle(canvas: any, context: any): void;
        syncShadow(context: any, enabled: any): void;
        update(recalculateMetrics: any): any;
        buildFont(): TextStyle;
        setFont(font: any): any;
        fontFamily: any;
        fontSize: any;
        fontStyle: any;
        setFontFamily(family: any): any;
        setFontStyle(style: any): any;
        setFontSize(size: any): any;
        setTestString(string: any): any;
        testString: any;
        setFixedSize(width: any, height: any): any;
        fixedWidth: any;
        fixedHeight: any;
        setResolution(value: any): any;
        resolution: any;
        setLineSpacing(value: any): any;
        lineSpacing: any;
        setBackgroundColor(color: any): any;
        backgroundColor: any;
        setFill(color: any): any;
        setColor(color: any): any;
        setStroke(color: any, thickness: any): any;
        strokeThickness: any;
        stroke: any;
        setShadow(x: any, y: any, color: any, blur: any, shadowStroke: any, shadowFill: any): any;
        shadowOffsetX: any;
        shadowOffsetY: any;
        shadowColor: any;
        shadowBlur: any;
        shadowStroke: any;
        shadowFill: any;
        setShadowOffset(x: any, y: any): any;
        setShadowColor(color: any): any;
        setShadowBlur(blur: any): any;
        setShadowStroke(enabled: any): any;
        setShadowFill(enabled: any): any;
        setUnderline(color: any, thickness: any, offset: any): any;
        underlineColor: any;
        underlineThickness: any;
        underlineOffset: any;
        setUnderlineColor(color: any): any;
        setUnderlineThickness(thickness: any): any;
        setUnderlineOffset(offset: any): any;
        setWrapMode(mode: any): any;
        wrapMode: any;
        setWrapWidth(width: any): any;
        wrapWidth: any;
        setAlign(halign: any, valign: any): any;
        halign: any;
        valign: any;
        setHAlign(halign: any): any;
        setVAlign(valign: any): any;
        setMaxLines(max: any): any;
        maxLines: any;
        getTextMetrics(): {
            ascent: any;
            descent: any;
            fontSize: any;
        };
        get lineHeight(): any;
        toJSON(): {
            metrics: {
                ascent: any;
                descent: any;
                fontSize: any;
            };
        };
        destroy(): void;
    }
    

    class Dialog extends Sizer {
        constructor(scene: any, config: any);
        eventEmitter: any;
        setOrientation(orientation: any): Dialog;
        setMinSize(minWidth: any, minHeight: any): Dialog;
        setMinWidth(minWidth: any): Dialog;
        setMinHeight(minHeight: any): Dialog;
        alignLeft(value: any): Dialog;
        alignRight(value: any): Dialog;
        alignCenterX(value: any): Dialog;
        alignTop(value: any): Dialog;
        alignBottom(value: any): Dialog;
        alignCenterY(value: any): Dialog;
        resize(width: any, height: any): Dialog;
        add(gameObjects: any): Dialog;
        remove(gameObjects: any, destroyChild: any): Dialog;
        clear(destroyChild: any): Dialog;

        layout():this;
        pushIntoBounds():this;
        popUp(v: any):this;
    }


    
    class Sizer extends BaseSizer {
        constructor(scene: any, x: any, y: any, minWidth: any, minHeight: any, orientation: any, config: any);
        sizerChildren: any[];
        setOrientation(orientation: any): Sizer;
        orientation: any;
        get childrenProportion(): any;
        _childrenProportion: any;
        setMinSize(minWidth: any, minHeight: any): Sizer;
        setMinWidth(minWidth: any): Sizer;
        setMinHeight(minHeight: any): Sizer;
        alignLeft(value: any): Sizer;
        alignRight(value: any): Sizer;
        alignCenterX(value: any): Sizer;
        alignTop(value: any): Sizer;
        alignBottom(value: any): Sizer;
        alignCenterY(value: any): Sizer;
        resize(width: any, height: any): Sizer;
        add(gameObjects: any): Sizer;
        remove(gameObjects: any, destroyChild: any): Sizer;
        clear(destroyChild: any): Sizer;

    }

    class BaseSizer extends Container {
        constructor(scene: any, x: any, y: any, minWidth: any, minHeight: any, config: any);
        isRexSizer: boolean;
        rexSizer: {};
        backgroundChildren: any;
        space: any;
        setMinSize(minWidth: any, minHeight: any): BaseSizer;
        setMinWidth(minWidth: any): BaseSizer;
        minWidth: any;
        setMinHeight(minHeight: any): BaseSizer;
        minHeight: any;
        get childrenWidth(): any;
        _childrenWidth: any;
        get childrenHeight(): any;
        _childrenHeight: any;
        set left(arg: number);
        get left(): number;
        alignLeft(value: any): BaseSizer;
        set right(arg: any);
        get right(): any;
        alignRight(value: any): BaseSizer;
        set centerX(arg: number);
        get centerX(): number;
        alignCenterX(value: any): BaseSizer;
        set top(arg: number);
        get top(): number;
        alignTop(value: any): BaseSizer;
        set bottom(arg: any);
        get bottom(): any;
        alignBottom(value: any): BaseSizer;
        set centerY(arg: number);
        get centerY(): number;
        alignCenterY(value: any): BaseSizer;
        get innerLeft(): any;
        get innerRight(): number;
        get innerTop(): any;
        get innerBottom(): number;
        get innerWidth(): number;
        get innerHeight(): number;
        resize(width: any, height: any): BaseSizer;
        add(gameObjects: any): BaseSizer;
        remove(gameObjects: any, destroyChild: any): BaseSizer;
        clear(destroyChild: any): BaseSizer;
    }

    class Container extends Base {
        constructor(scene: any, x: any, y: any, width: any, height: any, children: any);
        type: string;
        isRexContainerLite: boolean;
        syncChildrenEnable: boolean;
        _active: any;
        _mask: any;
        _scrollFactorX: any;
        _scrollFactorY: any;
        resize(width: any, height: any): Container;
        set x(arg: any);
        get x(): any;
        _x: any;
        set y(arg: any);
        get y(): any;
        _y: any;
        set rotation(arg: any);
        get rotation(): any;
        set scaleX(arg: any);
        get scaleX(): any;
        set scaleY(arg: any);
        get scaleY(): any;
        set flipX(arg: any);
        get flipX(): any;
        set flipY(arg: any);
        get flipY(): any;
        set visible(arg: any);
        get visible(): any;
        set alpha(arg: any);
        get alpha(): any;
        set active(arg: any);
        get active(): any;
        set mask(arg: any);
        get mask(): any;
        set scrollFactorX(arg: any);
        get scrollFactorX(): any;
        set scrollFactorY(arg: any);
        get scrollFactorY(): any;
        get list(): any[];
        add(gameObjects: any): Container;
        remove(gameObjects: any, destroyChild: any): Container;
        clear(destroyChild: any): Container;
    }

    class Base {
        constructor(scene: any, x: any, y: any, width: any, height: any);
        children: any[];
        destroy(fromScene: any): void;
        contains(gameObject: any): boolean;
        add(gameObjects: any): Base;
        remove(gameObjects: any, destroyChild: any): Base;
        clear(destroyChild: any): Base;
    }
    
}

declare module 'UI' {
    export = UI;
}



