// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Warrior extends cc.Component {

    @property
    move_speed: number = 100;

    @property
    dash_speed: number = 1000;

    // animations
    _anim: cc.Animation = null;
    _anim_state: cc.AnimationState = null;

    // directions
    _facing_dir: number = 1;
    _move_dir: cc.Vec2 = null;

    // player actions
    _firing: boolean = false;
    _dashing: boolean = false;

    fire()
    {
        // console.log("?");
        this._firing = true;

        // break dash if fire
        if(this._dashing)
        {
            this._dashing = false;
        }

        // play attack animation
        this._anim.stop();
        this._anim_state = this._anim.play("warrior_attack1");

        this.scheduleOnce(() => {this._firing = false}, 0.45)
    }

    dash()
    {
        if(!this._firing)
        {
            this._dashing = true;

            if(this._move_dir.x == 0 && this._move_dir.y == 0)
            {
                this._move_dir = cc.v2(1, 0);

                this.scheduleOnce(() => 
                {
                    this._dashing = false;
                    this._move_dir = cc.v2(0, 0);   // reset moving direction
                }, 0.2);
            }
            else
            {
                this.scheduleOnce(() => 
                {
                    this._dashing = false;
                }, 0.2);
            }

            // play dash animation
            this._anim.stop();
            this._anim_state = this._anim.play("warrior_dash");
        }
    }

    animation_controller()
    {
        if(this._firing || this._dashing)
        {
            // console.log("?");
            // empty for nop
        }
        else if((this._move_dir.x != 0 || this._move_dir.y != 0) && (this._anim_state.name != "warrior_run" || !this._anim_state.isPlaying))
        {
            this._anim.stop();
            this._anim_state = this._anim.play("warrior_run");
        }
        else if((this._move_dir.x == 0 && this._move_dir.y == 0) && (this._anim_state.name != "warrior_idle" || !this._anim_state.isPlaying))
        {
            this._anim.stop();
            this._anim_state = this._anim.play("warrior_idle");
        }
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        // get animation component
        this._anim = this.node.getComponent(cc.Animation);
        this._anim_state = this._anim.getAnimationState("warrior_idle");
        this._move_dir = cc.v2(0, 0);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyPressed, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyRelease, this);
        cc.find("Canvas/Main Camera").on(cc.Node.EventType.MOUSE_DOWN, this.fire, this);
    }

    start () {

    }

    onKeyPressed(event)
    {
        switch(event.keyCode)
        {
            case cc.macro.KEY.w:
                // console.log(this._move_dir);
                this._move_dir.y = 1;
                break;
            case cc.macro.KEY.a:
                this._move_dir.x = -1;
                this._facing_dir = -1;
                break;
            case cc.macro.KEY.s:
                this._move_dir.y = -1;
                break;
            case cc.macro.KEY.d:
                this._move_dir.x = 1;
                this._facing_dir = 1;
                break;
            case cc.macro.KEY.space:
                this.dash();
        }
    }

    onKeyRelease(event)
    {
        switch(event.keyCode)
        {
            case cc.macro.KEY.w:
                // console.log(this._move_dir);
                this._move_dir.y = 0;
                break;
            case cc.macro.KEY.a:
                this._move_dir.x = 0;
                break;
            case cc.macro.KEY.s:
                this._move_dir.y = 0;
                break;
            case cc.macro.KEY.d:
                this._move_dir.x = 0;
                break;
        }
    }

    update (dt) 
    {
        // console.log(this._move_dir.x, this._move_dir.y);
        // console.log(this._facing_dir);
        this.animation_controller();

        if(this._dashing)
        {
            this.node.x += this.dash_speed * this._move_dir.x * dt;
            this.node.y += this.dash_speed * this._move_dir.y * dt;
        }
        else
        {
            this.node.x += this.move_speed * this._move_dir.x * dt;
            this.node.y += this.move_speed * this._move_dir.y * dt;
        }

        this.node.scaleX = this._facing_dir;
    }
}
