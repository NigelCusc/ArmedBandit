import AudioSourceControl, { SoundType } from "../AudioSource";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ReelControl extends cc.Component {    
    @property(AudioSourceControl)
    audioSourceControl: AudioSourceControl = null;

    @property({ type: cc.Node })
    public reelAnchor = null;

    // Tiles
    @property({ type: [cc.Node], visible: false })
    private tiles = [];
    @property({ type: cc.Prefab })
    public _tilePrefab = null;
    @property({ type: cc.Prefab })
    get tilePrefab(): cc.Prefab {
      return this._tilePrefab;
    }
    set tilePrefab(newPrefab: cc.Prefab) {
      this._tilePrefab = newPrefab;
      this.reelAnchor.removeAllChildren();
      this.tiles = [];
  
      if (newPrefab !== null) {
        this.createReel();
        this.shuffle();
      }
    }
    
    // Reel result
    private result: Array<number> = [];
    public stopSpinning = false; 

    createReel(): void {
      let newTile: cc.Node;
      // Create number of tiles forming a reel
      for (let i = 0; i < 5; i += 1) {
        newTile = cc.instantiate(this.tilePrefab);
        this.reelAnchor.addChild(newTile);
        this.tiles[i] = newTile;
      }
    }
    
    shuffle(): void {
      // Randomise each 
      for (let i = 0; i < this.tiles.length; i += 1) {
        this.tiles[i].getComponent('TileControl').setRandom();
      }
    }
    
    readyStop(newResult: Array<number>): void {
      this.result = (newResult == null) ? newResult : newResult.reverse();
      this.stopSpinning = true;
    }
    
    changeCallback(element: cc.Node = null): void {
      const el = element;
      if (el.position.y * -1 > 288) {
        el.position = cc.v3(0, -288 * -1);
  
        let pop = null;
        if (this.result != null && this.result.length > 0) {
          pop = this.result.pop();
        }
  
        if (pop != null && pop >= 0) {
          el.getComponent('TileControl').setTile(pop);
          el.getComponent('TileControl').activateGlow(true);
        } else {
          el.getComponent('TileControl').setRandom();
        }
      }
    }

    // Check if stopSpinning is true
    checkEndCallback(element: cc.Node = null): void {
      const el = element;
      if (this.stopSpinning) {
        this.doStop(el);
      } else {
        this.doSpinning(el);
      }
    }
    
    // Start Spinning reel with windUp delay
    doSpin(windUp: number): void {
      this.stopSpinning = false;
      // Sound
      this.audioSourceControl.playSound(SoundType.E_Sound_Reel_Start);
  
      this.reelAnchor.children.forEach(element => {   
        const delay = cc.tween(element).delay(windUp);
        const start = cc.tween(element).by(0.25, { position: cc.v2(0, 144 * -1) }, { easing: 'backIn' });
        const doChange = cc.tween().call(() => this.changeCallback(element));
        const callSpinning = cc.tween(element).call(() => this.doSpinning(element, 5));
        
        element.getComponent('TileControl').activateGlow(false);
        delay
          .then(start)
          .then(doChange)
          .then(callSpinning)
          .start();
      });
    }
    
    // Spin reel. Repeated until checkEnd is true
    doSpinning(element: cc.Node = null, times = 1): void {   
      // Sound
      this.audioSourceControl.playSound(SoundType.E_Sound_Reel_Spin);
      
      const move = cc.tween().by(0.04, { position: cc.v2(0, -144) });
      const doChange = cc.tween().call(() => this.changeCallback(element));
      const repeat = cc.tween(element).repeat(times, move.then(doChange));
      const checkEnd = cc.tween().call(() => this.checkEndCallback(element));
  
      repeat.then(checkEnd).start();
    }
    
    // Stop the reel from spinning
    doStop(element: cc.Node = null): void {
      // Sound
      this.audioSourceControl.playSound(SoundType.E_Sound_Reel_Stop);

      const move = cc.tween(element).by(0.04, { position: cc.v2(0, -144) } as any);
      const doChange = cc.tween().call(() => this.changeCallback(element));
      const end = cc.tween().by(0.2, { position: cc.v2(0, -144) }, { easing: 'bounceOut' });
      
      move
        .then(doChange)
        .then(move)
        .then(doChange)
        .then(end)
        .then(doChange)
        .start();
    }

    activateGlow(option: boolean): void {
      this.reelAnchor.children.forEach(element => {
        element.getComponent('TileControl').activateGlow(option);
      });
    }
}
    