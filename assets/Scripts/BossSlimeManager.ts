// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class BossSlimeManager extends cc.Component {

    // follow selected player
    @property(cc.Node)
    follow: cc.Node = null;

    // volume
    @property
    volume: number = 0.1;

    @property
    shake_duration: number = 0.3;

    @property
    shakes: number = 5;

    @property
    shake_scale: number = 20;

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

    camera_shake()
    {
        // generate random points 
        let points = [];
        let camera_pos = this._camera.getPosition();
        let player_pos = this.follow.getPosition();
        let idx = 0;

        for(let i = 0;i < this.shakes;i++)
        {
            points.push({x: Math.random() * 2 - 1, y: Math.random() * 2 - 1});
        }

        // quinitic interpolation
        let smooth = (x) =>
        {
            return 6 * (x**5) - 15 * (x**4) + 10 * (x**3);
        }

        // interpolate with linear method and smoothed data
        let perlin_shake = () =>
        {
            let UI = this._camera.getChildByName("UI");
            let new_x = player_pos.x + smooth(points[idx].x) * this.shake_scale;
            let new_y = player_pos.y + smooth(points[idx].y) * this.shake_scale;

            // this._camera.setPosition(player_pos.x + points[idx].x * this.shake_scale, player_pos.y + points[idx].y * this.shake_scale);
            // camera_pos.lerp(cc.v2(player_pos.x + points[idx].x * this.shake_scale, player_pos.y + points[idx].y * this.shake_scale), 0.5, camera_pos);
            camera_pos.lerp(cc.v2(new_x, new_y), 0.15, camera_pos);

            this._camera.setPosition(camera_pos);
            UI.setPosition(cc.v2(points[idx].x * this.shake_scale, points[idx].y * this.shake_scale));

            idx++;
        }

        this.schedule(perlin_shake, this.shake_duration);

        this.scheduleOnce(() =>
        {
            this.unschedule(perlin_shake);
        }, this.shake_duration * this.shakes);

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
        physics_manager.debugDrawFlags = 1;
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
