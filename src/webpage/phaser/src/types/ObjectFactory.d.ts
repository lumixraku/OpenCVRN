export default ObjectFactory;
declare class ObjectFactory {
    static register(type: any, callback: any): void;
    constructor(scene: any);
    scene: any;
}
