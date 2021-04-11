const {ccclass, property} = cc._decorator;

// sound type enum
export enum SoundType {
    E_Sound_Win = 0,
    E_Sound_Reel_Start,
    E_Sound_Reel_Spin,
    E_Sound_Reel_Stop,
    E_Sound_Mouse_Click
}

@ccclass
export default class AudioSourceControl extends cc.Component {

    @property({type:cc.AudioClip})
    winSound: cc.AudioClip = null;

    @property({type:cc.AudioClip})
    ReelStartSound: cc.AudioClip = null;
    
    @property({type:cc.AudioClip})
    ReelSpinSound: cc.AudioClip = null;
    
    @property({type:cc.AudioClip})
    ReelStopSound: cc.AudioClip = null;

    @property({type:cc.AudioClip})
    MouseClickSound: cc.AudioClip = null;

    start () {
        // put background music here.
    }

    playSound (type: SoundType) {
        if (type == SoundType.E_Sound_Win) {
            cc.audioEngine.playEffect(this.winSound, false);
        }
        else if (type == SoundType.E_Sound_Reel_Start) {
            cc.audioEngine.playEffect(this.ReelStartSound, false);
        }
        else if (type == SoundType.E_Sound_Reel_Spin) {
            cc.audioEngine.playEffect(this.ReelSpinSound, false);
        }
        else if (type == SoundType.E_Sound_Reel_Stop) {
            cc.audioEngine.playEffect(this.ReelStopSound, false);
        }
        else if (type == SoundType.E_Sound_Mouse_Click) {
            cc.audioEngine.playEffect(this.MouseClickSound, false);
        }
    }
}
