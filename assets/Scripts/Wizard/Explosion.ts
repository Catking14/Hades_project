// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Fireball extends cc.Component {

    @property(cc.AudioClip)
    hit_effect:cc.AudioClip = null;

    @property(cc.AudioClip)
    nothit_effect:cc.AudioClip = null;

    private scale:number = 0;
    private anim = null;
    private animstate = null;
    onLoad(){
        this.anim = this.node.getComponent(cc.Animation);
    }

    start () {
        this.scale = 0;
        this.animstate = this.anim.play("explosion_create");
        // this.scheduleOnce(()=>{
        //     this.node.destroy();
        // }, 1.5)
        // this.scheduleOnce(()=>{
        //     this.node.scale = 2;
        //     this.node.getComponent(cc.Animation).stop();
        //     this.node.getComponent(cc.Animation).play("fireball_exlode");
        //     this.node.getComponent(cc.Animation).on("finished",()=>{
        //         this.node.destroy();
        //     },this);
            
        // }, 5)
    }
    onBeginContact(contact, self, other) {
        if(other.node.group == "enemy"){
            other.node.getComponent(other.node.name).damage(10);
        }else{
            contact.disabled = true;
        }
    }
    anim_control(){
        if(this.animstate.name == "explosion_create" && !this.animstate.isPlaying){
            this.animstate = this.anim.play("explosion_stay");
        }else if(this.scale>=20){
            if(this.animstate.name!="explosion_destroy"||!this.animstate.isPlaying){
                this.animstate = this.anim.play("explosion_destroy");
                this.anim.on("finished",()=>{
                    this.node.destroy();
                },this);
            }
        }
    }
    update (dt) {
        this.anim_control();
        this.schedule(()=>{
            this.scale = this.scale + 0.1;
            console.log(this.scale);
        },1);
        if(this.scale>=5) this.node.scale = 5;
        else this.node.scale = this.scale;
    }
}
