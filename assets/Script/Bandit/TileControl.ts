const {ccclass, property} = cc._decorator;

@ccclass
export default class TileControl extends cc.Component {

    @property({ type: [cc.SpriteFrame], visible: true })
    private textures = [];
    
    // Glow over tile
    @property(cc.Node)
    public glowNode = null;

    async onLoad(): Promise<void> {
        await this.loadTextures();
        this.glowNode.active = false;
    }

    async resetInEditor(): Promise<void> {
        await this.loadTextures();
        this.glowNode.active = false;
        this.setRandom();
    }

    // Load images and fill texture array
    async loadTextures(): Promise<boolean> {
        const self = this;
        return new Promise<boolean>(resolve => {
            cc.loader.loadResDir('Texture/Tiles', cc.SpriteFrame, function afterLoad(err, loadedTextures) {
                self.textures = loadedTextures;
                resolve(true);
            });
        });
    }

    // Set tile to random image
    setRandom(): void {
        const randomIndex = Math.floor(Math.random() * this.textures.length);
        this.setTile(randomIndex);
    }
    
    // Set tile by index number
    setTile(index: number): void {
        this.node.getComponent(cc.Sprite).spriteFrame = this.textures[index];
    }

    // Show glow underneath
    activateGlow(option: boolean) {
        this.glowNode.active = option;
    }
}
