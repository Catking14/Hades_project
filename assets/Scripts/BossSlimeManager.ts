// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameManager from "./GameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BossSlimeManager extends cc.Component {

    // follow selected player
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

    @property(cc.AudioClip)
    BGM: cc.AudioClip = null;

    // player characters
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

    // camera 
    _camera: cc.Node = null;

    // play timer
    timer: number = 0;

    camera_follow() {
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

    camera_shake() {
        if(cc.find("Data").getComponent("Data").CameraShakeEnable)
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
    }

    z_transform() {

    }

    player_die()
    {
        // stop bgm
        cc.audioEngine.stopMusic();

        // store data
        this.unscheduleAllCallbacks();
        
        // store data to DATA node
        cc.find("Data").getComponent("Data").money = this.follow.getComponent(this.follow.name).money;
        cc.find("Data").getComponent("Data").time += this.timer;

        // change scene
        cc.director.loadScene("die_scene");
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let physics_manager = cc.director.getPhysicsManager();

        // enable physics function
        physics_manager.enabled = true;
        // physics_manager.debugDrawFlags = 1;

        // get cameras
        this._camera = cc.find("Canvas/Main Camera");
        // physics_manager.debugDrawFlags = 1;
    }

    start() {
        // generate selected player
        let p1;
        let player_role = cc.find("Data").getComponent("Data").role;

        if (player_role == "Wizard") {
            p1 = cc.instantiate(this.wizard);
        }
        else if (player_role == "Archor") {
            p1 = cc.instantiate(this.archor);
        }
        else if (player_role == "Assassin") {
            p1 = cc.instantiate(this.assassin);
        }
        else if (player_role == "Viking") {
            p1 = cc.instantiate(this.viking);
        }
        else {
            p1 = cc.instantiate(this.warrior);
        }

        this.follow = p1;
        cc.find("Canvas/New Node").addChild(p1);
        this.schedule(() => {this.timer += 1}, 1);
        let bgm = cc.audioEngine.playMusic(this.BGM,true);
        let vol = cc.find("Data").getComponent("Data").curMusicVolume * cc.find("Data").getComponent("Data").curMasterVolume;
        cc.audioEngine.setVolume(bgm,vol * 1.5);
    }

    update(dt) {
        this.camera_follow();
    }

    player_clear_stage(){
        cc.find("Data").getComponent("Data").money = this.follow.getComponent(this.follow.name).money;
        cc.find("Data").getComponent("Data").time += this.timer;
        cc.find("Data").getComponent("Data").clear++;
    }
}
