const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginSignupMenuManager extends cc.Component {
    @property(cc.Prefab)
    GameStartEffect: cc.Prefab = null;
    @property(cc.Prefab)
    Reel: cc.Prefab = null;
    @property(cc.Prefab)
    SignupMenu: cc.Prefab = null;
    @property(cc.Prefab)
    LoginMenu: cc.Prefab = null;

    private changeScene: boolean = false;
    private camera: any;
    private currentZoom: any;
    private zoomSpeed = 2.5;

    onLoad(){
        const reel = cc.instantiate(this.Reel);
        this.node.addChild(reel);

        this.scheduleOnce(()=>{
            const login_menu = cc.instantiate(this.LoginMenu);
            this.node.addChild(login_menu);
        }, 0.43);

        this.changeScene = false;
        this.camera = cc.find("Canvas/Main Camera").getComponent(cc.Camera);
        this.currentZoom = this.camera.zoomRatio;
        console.log(this.currentZoom);
    }

    // start () {

    // }

    update(dt){
        if(this.changeScene){
            this.currentZoom += this.zoomSpeed * dt;
            this.camera.zoomRatio = this.currentZoom;
        }
    }

    SwitchToSignupMenu(){
        cc.find("Canvas/bg/Reel").getComponent(cc.Animation).play("reel_inverse");
        this.scheduleOnce(()=>{
            cc.find("Canvas/bg/Reel").destroy();
            const reel = cc.instantiate(this.Reel);
            this.node.addChild(reel);
        }, 0.43);
        
        this.scheduleOnce(()=>{
            const signup_menu = cc.instantiate(this.SignupMenu);
            this.node.addChild(signup_menu);
        }, 0.86)
    }

    SwitchToLoginMenu(){
        cc.find("Canvas/bg/Reel").getComponent(cc.Animation).play("reel_inverse");
        this.scheduleOnce(()=>{
            cc.find("Canvas/bg/Reel").destroy();
            const reel = cc.instantiate(this.Reel);
            this.node.addChild(reel);
        }, 0.43);
        
        this.scheduleOnce(()=>{
            const login_menu = cc.instantiate(this.LoginMenu);
            this.node.addChild(login_menu);
        }, 0.86);
    }

    PrepareToStartGame(){
        cc.find("Canvas/bg/Reel").getComponent(cc.Animation).play("reel_inverse");
        this.scheduleOnce(()=>{
            cc.find("Canvas/bg/Reel").destroy();
            const reel = cc.instantiate(this.Reel);
            this.node.addChild(reel);
        }, 0.43);

        this.scheduleOnce(()=>{
            const game_start_scene = cc.instantiate(this.GameStartEffect);
            this.node.addChild(game_start_scene);
        }, 0.86)

        this.scheduleOnce(()=>{
            console.log(1);
            let Startbtn = new cc.Component.EventHandler();
            Startbtn.target = this.node;
            Startbtn.component = "LoginSignupMenuManager";
            Startbtn.handler = "handleStartButtonClick";
            cc.find("Canvas/bg/GameStartScene/click_to_start").on(cc.Node.EventType.MOUSE_ENTER, this.handleStartButtonMouseEnter);
            cc.find("Canvas/bg/GameStartScene/click_to_start").on(cc.Node.EventType.MOUSE_LEAVE, this.handleStartButtonHover);
            cc.find("Canvas/bg/GameStartScene/click_to_start").getComponent(cc.Button).clickEvents.push(Startbtn);
        }, 5)
    }

    handleStartButtonMouseEnter(){
        cc.find("Canvas/bg/GameStartScene/click_to_start/Background/label").getComponent(cc.Label).fontSize = 50;
    }

    handleStartButtonHover(){
        cc.find("Canvas/bg/GameStartScene/click_to_start/Background/label").getComponent(cc.Label).fontSize = 40;
    }

    handleStartButtonClick(){
        cc.find("Canvas/bg/GameStartScene/click_to_start").off(cc.Node.EventType.MOUSE_ENTER, this.handleStartButtonMouseEnter);
        cc.find("Canvas/bg/GameStartScene/click_to_start").off(cc.Node.EventType.MOUSE_LEAVE, this.handleStartButtonHover);
        cc.find("Canvas/bg/GameStartScene/click_to_start/Background/label").getComponent(cc.Label).fontSize = 50;

        this.changeScene = true;

        this.scheduleOnce(()=>{
            cc.director.loadScene("MainMenu");
        }, 0.6)
    }
}
