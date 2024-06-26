// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Lobby extends cc.Component {

    // initial player character
    @property(cc.Prefab)
    warrior: cc.Prefab = null;

    @property(cc.Prefab)
    archor: cc.Prefab = null;
    
    @property(cc.Prefab)
    viking: cc.Prefab = null;

    @property(cc.Prefab)
    wizard: cc.Prefab = null;

    @property(cc.Prefab)
    assassin: cc.Prefab = null;

    // follow selected player
    @property(cc.Node)
    follow: cc.Node = null;

    // volume
    @property
    volume: number = 0.1;

    // BGM
    @property(cc.AudioClip)
    BGM: cc.AudioClip = null;

    // camera 
    _camera: cc.Node = null;

    camera_follow()
    {
        let player_pos = this.follow.getPosition();
        let camera_pos = this._camera.getPosition();
    
        camera_pos.lerp(player_pos, 0.1, camera_pos);

        // if(camera_pos.x < 0)
        // {
        //     camera_pos.x = 0;
        // }
        // else if(camera_pos.x > 640)
        // {
        //     camera_pos.x = 640;
        // }

        // if(camera_pos.y < 0)
        // {
        //     camera_pos.y = 0;
        // }
        // else if(camera_pos.y > 960)
        // {
        //     camera_pos.y = 960;
        // }

        this._camera.setPosition(camera_pos);
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

        // cc.audioEngine.setMusicVolume(this.volume);
        // cc.audioEngine.setEffectsVolume(this.volume + 0.05);

        // generate warrior for default
        let p1;
        let cur_role = cc.find("Data").getComponent("Data").role;

        if(cur_role != "")
        {
            if(cur_role == "Warrior")
            {
                p1 = cc.instantiate(this.warrior);
            }
            else if(cur_role == "Wizard")
            {
                p1 = cc.instantiate(this.wizard);
                cc.find("Canvas/lobby/Wizard").active = false;
                cc.find("Canvas/lobby/Warrior").active = true;
            }
            else if(cur_role == "Archor")
            {
                p1 = cc.instantiate(this.archor);
                cc.find("Canvas/lobby/Archor").active = false;
                cc.find("Canvas/lobby/Warrior").active = true;
            }
            else if(cur_role == "Assassin")
            {
                p1 = cc.instantiate(this.assassin);
                cc.find("Canvas/lobby/Assassin").active = false;
                cc.find("Canvas/lobby/Warrior").active = true;
            }
            else
            {
                p1 = cc.instantiate(this.viking);
                cc.find("Canvas/lobby/Viking").active = false;
                cc.find("Canvas/lobby/Warrior").active = true;
            }
        }
        else
        {
            p1 = cc.instantiate(this.warrior);
        }

        p1.setPosition(-179.04, -207.689);
        cc.find("Canvas/New Node").addChild(p1);

        this.follow = p1;
    }

    start () 
    {
        cc.audioEngine.playMusic(this.BGM, true);
    }

    update (dt) 
    {
        this.camera_follow();
        
        cc.find("Data").getComponent("Data").role = this.follow.name;
    }
}
