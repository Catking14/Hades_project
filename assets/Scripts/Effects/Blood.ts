// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Blood extends cc.Component {

    @property(cc.SpriteFrame)
    blood_pool: cc.SpriteFrame = null;

    die: boolean = false;

    _sprite: cc.Sprite = null;
    _anim: cc.Animation = null;
    _blood_node_pool: cc.NodePool = null;

    reuse()
    {
        // // init stuff
        // this._sprite = this.node.getComponent(cc.Sprite);
        // this._anim = this.node.getComponent(cc.Animation);

        this.node.zIndex += 5;  // restore zIndex for reuse

        // blood 1: 0.42s
        // blood 2: 0.32s
        // blood 3: 0.35s

        // console.log("in?");

        let token = Math.floor(Math.random() * 3);

        switch(token)
        {
            case 0:
                this._anim.play("blood1");
                this.node.anchorX = 0.5;

                if(this.die)
                {
                    this.scheduleOnce(() => 
                    {
                        this._sprite.spriteFrame = this.blood_pool;
                        this.node.zIndex -= 5;
                        this._anim.stop();
                    }, 0.42);

                    this.scheduleOnce(() => {this._blood_node_pool.put(this.node);}, 5);
                }
                else
                {
                    this.node.zIndex -= 5;
                    this.scheduleOnce(() => {this._blood_node_pool.put(this.node);}, 5);
                }
                break;
            case 1:
                this._anim.play("blood2");

                if(this.die)
                {
                    this.scheduleOnce(() => 
                    {
                        this._sprite.spriteFrame = this.blood_pool;
                        this.node.zIndex -= 5;
                        this.node.anchorX = 0.5;
                        this._anim.stop();
                    }, 0.32);

                    this.scheduleOnce(() => {this._blood_node_pool.put(this.node);}, 5);
                }
                else
                {
                    this.node.zIndex -= 5;
                    this.scheduleOnce(() => {this._blood_node_pool.put(this.node);}, 5);
                }
                break;
            default:
                this._anim.play("blood3");

                if(this.die)
                {
                    this.scheduleOnce(() => 
                    {
                        this._sprite.spriteFrame = this.blood_pool;
                        this.node.zIndex -= 5;
                        this.node.anchorX = 0.5;
                        this._anim.stop();
                    }, 0.35);

                    this.scheduleOnce(() => {this._blood_node_pool.put(this.node);}, 5);
                }
                else
                {
                    this.node.zIndex -= 5;
                    this.scheduleOnce(() => {this._blood_node_pool.put(this.node);}, 5);
                }
                break;
        }

        console.log(this._anim.getAnimationState("blood1"));
        console.log(this._anim.getAnimationState("blood2"));
        console.log(this._anim.getAnimationState("blood"));
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        this._sprite = this.node.getComponent(cc.Sprite);
        this._anim = this.node.getComponent(cc.Animation);
    }

    start () 
    {
        // console.log(this.die);
        // console.log("what");
        // blood 1: 0.42s
        // blood 2: 0.32s
        // blood 3: 0.35s

        let token = Math.floor(Math.random() * 3);

        switch(token)
        {
            case 0:
                this._anim.play("blood1");
                this.node.anchorX = 0.5;

                if(this.die)
                {
                    this.scheduleOnce(() => 
                    {
                        this._sprite.spriteFrame = this.blood_pool;
                        this.node.zIndex -= 5;
                        this._anim.stop();
                    }, 0.42);

                    this.scheduleOnce(() => {this._blood_node_pool.put(this.node);}, 5);
                }
                else
                {
                    this.node.zIndex -= 5;
                    this.scheduleOnce(() => {this._blood_node_pool.put(this.node);}, 5);
                }
                break;
            case 1:
                this._anim.play("blood2");

                if(this.die)
                {
                    this.scheduleOnce(() => 
                    {
                        this._sprite.spriteFrame = this.blood_pool;
                        this.node.zIndex -= 5;
                        this.node.anchorX = 0.5;
                        this._anim.stop();
                    }, 0.32);

                    this.scheduleOnce(() => {this._blood_node_pool.put(this.node);}, 5);
                }
                else
                {
                    this.node.zIndex -= 5;
                    this.scheduleOnce(() => {this._blood_node_pool.put(this.node);}, 5);
                }
                break;
            default:
                this._anim.play("blood3");

                if(this.die)
                {
                    this.scheduleOnce(() => 
                    {
                        this._sprite.spriteFrame = this.blood_pool;
                        this.node.zIndex -= 5;
                        this.node.anchorX = 0.5;
                        this._anim.stop();
                    }, 0.35);

                    this.scheduleOnce(() => {this._blood_node_pool.put(this.node);}, 5);
                }
                else
                {
                    this.node.zIndex -= 5;
                    this.scheduleOnce(() => {this._blood_node_pool.put(this.node);}, 5);
                }
                break;
        }

    }

    // update (dt) {}
}
