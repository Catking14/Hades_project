const {ccclass, property} = cc._decorator;

@ccclass
export default class GameStart extends cc.Component {
    private changeScene: boolean = false;
    private camera: any;
    private currentZoom: any;
    private zoomSpeed = 7;


    onLoad(){
        let Startbtn = new cc.Component.EventHandler();
        Startbtn.target = this.node;
        Startbtn.component = "GameStart";
        Startbtn.handler = "handleStartButtonClick";
        this.node.getChildByName("game_start_button").getComponent(cc.Button).clickEvents.push(Startbtn);

        this.changeScene = false;
        this.camera = cc.find("Canvas/Main Camera").getComponent(cc.Camera);
        this.currentZoom = this.camera.zoomRatio;
    }

    // start () {}

    update(dt){
        if(this.changeScene){
            this.currentZoom += this.zoomSpeed * dt;
            this.camera.zoomRatio = this.currentZoom;
        }
    }

    handleStartButtonClick(){
        let direction = cc.v2(198.969, -98.12);
        cc.find("Canvas/Main Camera").runAction(cc.moveBy(0.5, direction));

        this.scheduleOnce(()=>{
            this.changeScene = true;
        }, 0.5)
        
        this.scheduleOnce(()=>{
            cc.director.loadScene("lobby");
        }, 1.2)
    }
}
