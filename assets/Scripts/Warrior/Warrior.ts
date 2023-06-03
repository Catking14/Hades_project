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

    // keyboard status
    _w_pressed: boolean = false;
    _a_pressed: boolean = false;
    _s_pressed: boolean = false;
    _d_pressed: boolean = false;
    _space_pressed: boolean = false;

    // physicsBox Collider
    _collider: cc.PhysicsBoxCollider = null;


    fire()
    {
        // console.log("?");
        if(!this._firing)
        {
            this._firing = true;

            // break dash if fire
            if(this._dashing)
            {
                this._dashing = false;
            }

            // play attack animation
            this._anim.stop();
            
            if(this._facing_dir == 1)
            {
                this._anim_state = this._anim.play("warrior_attack1");
            }
            else
            {
                this._anim_state = this._anim.play("warrior_attack1_left");
            }

            this.scheduleOnce(() => 
            {
                this._firing = false;

                // return to idle hitbox
                this.hit_box_fix();
            }, 0.45)
        }
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

    // fix hitbox property 
    hit_box_fix()
    {
        this._collider.size = new cc.Size(24, 37.6);

        if(this._facing_dir == 1)
        {
            this._collider.offset = cc.v2(-0.2, 0.5);
        }
        else
        {
            this._collider.offset = cc.v2(1.3, 0.1);
        }
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        // get animation component
        this._anim = this.node.getComponent(cc.Animation);
        this._anim_state = this._anim.getAnimationState("warrior_idle");

        // initial direction, 0 to stop
        this._move_dir = cc.v2(0, 0);

        // physicsBoxCollider
        this._collider = this.node.getComponent(cc.PhysicsBoxCollider);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyPressed, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyRelease, this);
        cc.find("Canvas/Main Camera").on(cc.Node.EventType.MOUSE_DOWN, this.fire, this);
    }

    start () {

    }

    onKeyPressed(event)
    {
        // console.log(this._move_dir);
        switch(event.keyCode)
        {
            case cc.macro.KEY.w:
                this._move_dir.y = 1;
                this._w_pressed = true;
                break;
            case cc.macro.KEY.a:
                this._move_dir.x = -1;
                this._facing_dir = -1;
                this._a_pressed = true;

                // fix hitbox offset
                this.hit_box_fix();
                break;
            case cc.macro.KEY.s:
                this._move_dir.y = -1;
                this._s_pressed = true;
                break;
            case cc.macro.KEY.d:
                this._move_dir.x = 1;
                this._facing_dir = 1;
                this._d_pressed = true;

                // fix hitbox offset
                this.hit_box_fix();
                break;
            case cc.macro.KEY.space:
                if(!this._space_pressed)
                {
                    this._space_pressed = true;
                    this.dash();
                }
                break;
        }
    }

    onKeyRelease(event)
    {
        // console.log(this._move_dir);
        switch(event.keyCode)
        {
            case cc.macro.KEY.w:
                this._w_pressed = false;
                break;
            case cc.macro.KEY.a:
                this._a_pressed = false;
                break;
            case cc.macro.KEY.s:
                this._s_pressed = false;
                break;
            case cc.macro.KEY.d:
                this._d_pressed = false;
                break;
            case cc.macro.KEY.space:
                this._space_pressed = false;
        }

        // vertical
        // both pressed or non of them are pressed
        if((this._w_pressed && this._s_pressed) || (!this._w_pressed && !this._s_pressed))
        {
            this._move_dir.y = 0;
        }
        else if(this._w_pressed)
        {
            this._move_dir.y = 1;
        }
        else
        {
            this._move_dir.y = -1;
        }

        // horizontal
        // both pressed or non of them are pressed
        if((this._a_pressed && this._d_pressed) || (!this._a_pressed && !this._d_pressed))
        {
            this._move_dir.x = 0;
        }
        else if(this._d_pressed)
        {
            this._move_dir.x = 1;
            this._facing_dir = 1;
        }
        else
        {
            this._move_dir.x = -1;
            this._facing_dir = -1;
        }

        // fix hitbox offset
        this.hit_box_fix();
    }

    update (dt) 
    {
        // console.log(this._move_dir.x, this._move_dir.y);
        // console.log(this._facing_dir);
        this.animation_controller();

        // update collider change anytime
        this._collider.apply();

        if(this._dashing)
        {
            this.node.x += this.dash_speed * this._move_dir.x * dt;
            this.node.y += this.dash_speed * this._move_dir.y * dt;
        }
        else if(!this._firing)
        {
            this.node.x += this.move_speed * this._move_dir.x * dt;
            this.node.y += this.move_speed * this._move_dir.y * dt;
        }

        this.node.scaleX = this._facing_dir;
    }
}