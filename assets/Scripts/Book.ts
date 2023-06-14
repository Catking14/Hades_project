const { ccclass, property } = cc._decorator;

@ccclass
export default class Book extends cc.Component {
    @property(cc.Prefab)
    main_book_prefab: cc.Prefab = null;

    @property(cc.Prefab)
    setting_prefab: cc.Prefab = null;

    private master_volume: number = 0.5;
    private music_volume: number = 0.3;
    private sfx_volume: number = 0.3;

    private isopen: boolean = false;
    private animation_flag: boolean = false;

    private animation: cc.Animation;
    private main_book: cc.Node = null;

    onLoad() {

    }

    start() {
        cc.systemEvent.on("keydown", this.onKeyDown, this);
        this.set_volume();
    }

    onKeyDown(event){
        if (this.animation_flag)
            return;
        if(event.keyCode == cc.macro.KEY.escape){
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
        this.animation.play("open");
        this.animation_flag = true;
        this.isopen = true;
        this.scheduleOnce(() => {
            this.animation_flag = false;
            this.create_page("setting");
        }, 0.5);
        console.log("book open");
    }

    closebook() {
        this.animation.play("close");
        this.animation_flag = true;
        this.isopen = false;
        this.clear_page();
        this.scheduleOnce(() => {
            this.animation_flag = false;
            this.node.removeAllChildren();
        }, 0.5);
        console.log("book close");
    }

    clear_page() {
        this.main_book.removeAllChildren();
    }

    create_page(name: string) {
        if (name === "setting") {
            let new_page = cc.instantiate(this.setting_prefab);
            let slide_array = new_page.getComponentsInChildren(cc.Slider);

            let master_EventHandler = new cc.Component.EventHandler();
            master_EventHandler.target = this.node;
            master_EventHandler.component = 'Book';
            master_EventHandler.handler = 'master_volume_handler';
            slide_array[0].slideEvents.push(master_EventHandler);
            slide_array[0].progress = this.master_volume;

            let music_EventHandler = new cc.Component.EventHandler();
            music_EventHandler.target = this.node;
            music_EventHandler.component = 'Book';
            music_EventHandler.handler = 'music_volume_handler';
            slide_array[1].slideEvents.push(music_EventHandler);
            slide_array[1].progress = this.music_volume;

            let sfx_EventHandler = new cc.Component.EventHandler();
            sfx_EventHandler.target = this.node;
            sfx_EventHandler.component = 'Book';
            sfx_EventHandler.handler = 'sfx_volume_handler';
            slide_array[2].slideEvents.push(sfx_EventHandler);
            slide_array[2].progress = this.sfx_volume;

            this.main_book.addChild(new_page);
        }
    }

    set_volume() {
        cc.audioEngine.setMusicVolume(this.master_volume * this.music_volume);
        cc.audioEngine.setEffectsVolume(this.master_volume * this.sfx_volume);
    }

    master_volume_handler(event) {
        this.master_volume = event.progress;
        this.set_volume();
    }

    music_volume_handler(event) {
        this.music_volume = event.progress;
        this.set_volume();
    }

    sfx_volume_handler(event) {
        this.sfx_volume = event.progress;
        this.set_volume();
    }
}