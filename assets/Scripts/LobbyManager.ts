// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Lobby extends cc.Component {

    // follow selected player
    @property(cc.Node)
    follow: cc.Node = null;

    // volume
    @property
    volume: number = 0.1;

    // camera 
    _camera: cc.Node = null;

    camera_follow()
    {
        let player_pos = this.follow.getPosition();
        let camera_pos = this._camera.getPosition();
    
        camera_pos.lerp(player_pos, 0.1, camera_pos);

        if(camera_pos.x < 0)
        {
            camera_pos.x = 0;
        }
        else if(camera_pos.x > 640)
        {
            camera_pos.x = 640;
        }

        if(camera_pos.y < 0)
        {
            camera_pos.y = 0;
        }
        else if(camera_pos.y > 960)
        {
            camera_pos.y = 960;
        }

        this._camera.setPosition(camera_pos);
    }

    z_transform()
    {
        
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        let physics_manager = cc.director.getPhysicsManager();

        // enable physics function
        physics_manager.enabled = true;
        // physics_manager.debugDrawFlags = 1;

        // get cameras
        this._camera = cc.find("Canvas/Main Camera");

        cc.audioEngine.setMusicVolume(this.volume);
        cc.audioEngine.setEffectsVolume(this.volume + 0.05);
    }

    start () {

    }

    update (dt) 
    {
        this.camera_follow();
    }
}
