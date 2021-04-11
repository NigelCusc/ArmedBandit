const {ccclass, property} = cc._decorator;

@ccclass
export default class BanditControl extends cc.Component {
    // Start/Stop Button
    @property(cc.Node)
    public button: cc.Node = null;

    // Reel Prefab
    @property(cc.Prefab)
    public _reelPrefab = null;
    @property({ type: cc.Prefab })
    get reelPrefab(): cc.Prefab {
        return this._reelPrefab;
    }
    set reelPrefab(newPrefab: cc.Prefab) {
        this._reelPrefab = newPrefab;
        this.node.removeAllChildren();

        if (newPrefab !== null) {
            this.createBandit();
        }
    }
    
    // Set number of Reels
    @property({ type: cc.Integer })
    public _numberOfReels = 3;
    @property({ type: cc.Integer, range: [3, 6], slide: true })

    get numberOfReels(): number {
        return this._numberOfReels;
    }

    set numberOfReels(newNumber: number) {
        this._numberOfReels = newNumber;

        if (this.reelPrefab !== null) {
            this.createBandit();
        }
    }
   
    private reels = [];
    public spinning = false;

    // Create the Armed bandit. Reset Reels and set Tiles at random
    createBandit(): void {
        this.node.destroyAllChildren();
        this.reels = [];

        let newReel: cc.Node;
        // Create reels
        for (let i = 0; i < this.numberOfReels; i += 1) {
            newReel = cc.instantiate(this.reelPrefab);
            this.node.addChild(newReel);
            this.reels[i] = newReel;

            const reelScript = newReel.getComponent('ReelControl');
            reelScript.shuffle();
            reelScript.reelAnchor.getComponent(cc.Layout).enabled = false;
        }

        this.node.getComponent(cc.Widget).updateAlignment();
    }

    // Spin the Bandit Reels
    spin(): void {
        this.spinning = true;
        // Set button text to Stop
        this.button.getChildByName('Label').getComponent(cc.Label).string = 'STOP';
        for (let i = 0; i < this.numberOfReels; i += 1) {
            const theReel = this.reels[i].getComponent('ReelControl');
            // Spin the reel with delay
            theReel.doSpin(0.03 * i);
        }
    }
    
    lock(): void {
        this.button.getComponent(cc.Button).interactable = false;
    }
    
    stop(result: Array<Array<number>> = null): void {
        setTimeout(() => {
            this.spinning = false;
            this.button.getComponent(cc.Button).interactable = true;
            this.button.getChildByName('Label').getComponent(cc.Label).string = 'SPIN';
        }, 2500);

        const rngMod = Math.random() / 2;
        for (let i = 0; i < this.numberOfReels; i += 1) {
            const spinDelay = i < 2 + rngMod ? i / 4 : rngMod * (i - 2) + i / 4;
            const theReel = this.reels[i].getComponent('ReelControl');

            this.stopReel(theReel, result[i], spinDelay);
        }
    }

    private stopReel(theReel: any, result: number[], spinDelay: number): Promise<void> {
        if(result){
            var res = result.slice();
        }
        else{
            res = null;
        }
        return new Promise(function (resolve, reject) {
            setTimeout(() => {
            theReel.readyStop(res);
            resolve();
            }, spinDelay * 1000);
        });
    }

    activateGlow(option: boolean): void {
        for (let i = 0; i < this.numberOfReels; i += 1) {
            this.reels[i].getComponent('ReelControl').activateGlow(option);
        }
    }
}
