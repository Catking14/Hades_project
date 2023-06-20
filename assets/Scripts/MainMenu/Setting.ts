const {ccclass, property} = cc._decorator;

@ccclass
export default class Setting extends cc.Component {
    private curMasterVolume: number;
    private curMusicVolume: number;
    private curSFXVolume: number;
    private CameraShakeEnable: boolean;

    private MainMenuManager: any;
    private MasterVolumeSlider: any;
    private MusicVolumeSlider: any;
    private SFXVolumeSlider: any;
    private Toggle1: any;
    private Toggle2: any;

    onLoad(){
        this.MainMenuManager = cc.find("Canvas/bg/MainMenu").getComponent("MainMenuManager");
        this.curMasterVolume = this.MainMenuManager.curMasterVolume;
        this.curMusicVolume = this.MainMenuManager.curMusicVolume;
        this.curSFXVolume = this.MainMenuManager.curSFXVolume;

        this.MasterVolumeSlider = this.node.getChildByName("MasterVolume").getChildByName("slider")
        .getComponent(cc.Slider);
        this.MusicVolumeSlider = this.node.getChildByName("MusicVolume").getChildByName("slider")
        .getComponent(cc.Slider);
        this.SFXVolumeSlider = this.node.getChildByName("SFXVolume").getChildByName("slider")
        .getComponent(cc.Slider);
        this.MasterVolumeSlider.node.on("slide", this.MasterVolumeChanged, this);
        this.MusicVolumeSlider.node.on("slide", this.MusicVolumeChanged, this);
        this.SFXVolumeSlider.node.on("slide", this.SFXVolumeChanged, this);

        this.MasterVolumeSlider.progress = this.curMasterVolume;
        this.MusicVolumeSlider.progress = this.curMusicVolume;
        this.SFXVolumeSlider.progress = this.curSFXVolume;

        this.Toggle1 = this.node.getChildByName("CameraShake").getChildByName("toggle")
        .getChildByName("toggle1").getComponent(cc.Toggle);
        this.Toggle2 = this.node.getChildByName("CameraShake").getChildByName("toggle")
        .getChildByName("toggle2").getComponent(cc.Toggle);
        this.Toggle1.node.on("toggle", this.ToggleChanged, this);
        this.Toggle2.node.on("toggle", this.ToggleChanged, this);
    }

    // start () {}

    // update (dt) {}

    MasterVolumeChanged(){
        let progress = this.MasterVolumeSlider.progress; 
        this.MainMenuManager.MasterVolumeChanged(progress);
    }

    MusicVolumeChanged(){
        let progress = this.MusicVolumeSlider.progress; 
        this.MainMenuManager.MusicVolumeChanged(progress);
    }

    SFXVolumeChanged(){
        let progress = this.SFXVolumeSlider.progress; 
        this.MainMenuManager.SFXVolumeChanged(progress);
    }

    ToggleChanged(){
        if(this.Toggle1.isChecked && !this.Toggle2.isChecked){
            this.CameraShakeEnable = true;
            this.MainMenuManager.CameraShakeEnableChanged(true);
        }else if(!this.Toggle1.isChecked && this.Toggle2.isChecked){
            this.CameraShakeEnable = false;
            this.MainMenuManager.CameraShakeEnableChanged(false);
        }else{
            this.CameraShakeEnable = true;
            this.MainMenuManager.CameraShakeEnableChanged(true);
        }
    }
}
