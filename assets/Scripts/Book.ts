const { ccclass, property } = cc._decorator;

@ccclass
export default class Book extends cc.Component {
    @property(cc.Prefab)
    main_book_prefab: cc.Prefab = null;

    @property(cc.Prefab)
    setting_prefab: cc.Prefab = null;

    @property(cc.Prefab)
    left_page_prefab: cc.Prefab = null;

    private master_volume: number = 0.5;
    private music_volume: number = 0.3;
    private sfx_volume: number = 0.3;

    private isopen: boolean = false;
    private animation_flag: boolean = false;

    private animation: cc.Animation;
    private _player;
    private Data;
    private main_book: cc.Node = null;
    private left_page: cc.Node = null;
    private right_page: cc.Node = null;
    private toggle_array;

    onLoad() {

    }

    start() {
        cc.systemEvent.on("keydown", this.onKeyDown, this);
        this.Data = cc.find("Data").getComponent("Data");
        this.master_volume = this.Data.curMasterVolume;
        this.music_volume = this.Data.curMusicVolume;
        this.sfx_volume = this.Data.curSFXVolume;
        this.Data.setVolume();
        if(cc.director.getScene().name == "BossSlime" || cc.director.getScene().name == "BossBeholder")
        {
            this._player = cc.find("BossSlimeManager").getComponent("BossSlimeManager").follow;
        }
        else
        {
            this._player = cc.find("Game Manager").getComponent("GameManager").follow;
        }
    }

    onKeyDown(event) {
        if (this.animation_flag)
            return;
        if (event.keyCode == cc.macro.KEY.escape) {
            if (this.isopen) {
                this.closebook();
            }
            else {
                this.openbook();
            }
        }
    }

    openbook() {
        let new_book = cc.instantiate(this.main_book_prefab);
        this.main_book = new_book;
        this.animation = new_book.getComponent(cc.Animation);
        this.node.addChild(new_book);
        this.animation.play("book_flip_left");
        this.animation_flag = true;
        this.isopen = true;
        this.scheduleOnce(() => {
            this.animation_flag = false;
            this.create_page("setting");
            this.create_page("statistics");
        }, 0.5);
        cc.find("Canvas/New Node").active = false;
    }

    closebook() {
        this.animation.play("book_flip_right");
        this.animation_flag = true;
        this.isopen = false;
        this.clear_page();
        this.scheduleOnce(() => {
            this.animation_flag = false;
            this.node.removeAllChildren();
            cc.find("Canvas/New Node").active = true;
        }, 0.5);
    }

    clear_page() {
        this.left_page.destroy();
        this.right_page.destroy();
    }

    create_page(name: string) {
        if (name === "setting") {
            let new_page = cc.instantiate(this.setting_prefab);
            this.node.addChild(new_page);
            this.right_page = new_page;

            let slide_array = new_page.getComponentsInChildren(cc.Slider);

            slide_array[0].progress = this.master_volume;
            slide_array[1].progress = this.music_volume;
            slide_array[2].progress = this.sfx_volume;

            slide_array[0].node.on("slide", this.master_volume_handler, this);
            slide_array[1].node.on("slide", this.music_volume_handler, this);
            slide_array[2].node.on("slide", this.sfx_volume_handler, this);

            this.toggle_array = new_page.getChildByName("toggle").getComponentsInChildren(cc.Toggle);
            this.toggle_array[0].isChecked = this.Data.CameraShakeEnable;
            this.toggle_array[1].isChecked = !this.Data.CameraShakeEnable;
            this.toggle_array[0].node.on("toggle", this.shake_handler, this);
            this.toggle_array[1].node.on("toggle", this.shake_handler, this);
        }
        else if (name === "statistics") {
            let new_page = cc.instantiate(this.left_page_prefab);
            this.node.addChild(new_page);
            this.left_page = new_page;
            new_page.getChildByName("hp_value").getComponent(cc.Label).string = this._player.getComponent(this._player.name).HP + " / " + this.Data.HP;
            new_page.getChildByName("heal_value").getComponent(cc.Label).string = this._player.getComponent(this._player.name).heal;
            new_page.getChildByName("CD_value").getComponent(cc.Label).string = "- " + this.Data.dash;
            new_page.getChildByName("damage_value").getComponent(cc.Label).string = "+ " + this.Data.damage;
            new_page.getChildByName("money_value").getComponent(cc.Label).string = this._player.getComponent(this._player.name).money.toString();
        }
    }

    master_volume_handler(event) {
        this.master_volume = event.progress;
        this.Data.curMasterVolume = event.progress;
        this.Data.setVolume();
    }

    music_volume_handler(event) {
        this.music_volume = event.progress;
        this.Data.curMusicVolume = event.progress;
        this.Data.setVolume();
    }

    sfx_volume_handler(event) {
        this.sfx_volume = event.progress;
        this.Data.curSFXVolume = event.progress;
        this.Data.setVolume();
    }

    shake_handler(event) {
        if (this.toggle_array[0].isChecked && !this.toggle_array[1].isChecked) {
            this.Data.CameraShakeEnable = true;
        }
        else {
            this.Data.CameraShakeEnable = false;
        }
    }
}