// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {

    @property
    size_of_map_block: number = 960;

    @property
    max_map_row_or_column: number = 9;

    _camera: cc.Node = null;

    // camera follow object
    @property(cc.Node)
    follow: cc.Node = null;

    // map prefabs
    @property(cc.Prefab)
    map1: cc.Prefab = null;
    
    @property(cc.Prefab)
    air_wall: cc.Prefab = null;

    // map size
    _map_row: number = 1;
    _map_column: number = 1;


    camera_follow()
    {
        let player_pos = this.follow.getPosition();
        let camera_pos = this._camera.getPosition();
    
        camera_pos.lerp(player_pos, 0.1, camera_pos);

        this._camera.setPosition(camera_pos);
    }

    generate_map()
    {
        let random = Math.floor(Math.random() * this.max_map_row_or_column);

        while(random < 4)
        {
            random = Math.floor(Math.random() * this.max_map_row_or_column);
        }

        this._map_row = random;

        // random again for column
        random = Math.floor(Math.random() * this.max_map_row_or_column);

        while(random < 4)
        {
            random = Math.floor(Math.random() * this.max_map_row_or_column);
        }

        this._map_column = random;

        // generate outside air wall
        for(let i = -1;i <= this._map_row + 1;i++)
        {
            for(let j = -1;j <= this._map_column;j++)
            {
                if(i < 0 || j < 0 || i == this._map_row || j == this._map_column)
                {
                    let wall = cc.instantiate(this.air_wall);

                    wall.setPosition(j * this.size_of_map_block, i * this.size_of_map_block);

                    cc.find("Canvas").addChild(wall);
                }
            }
        }

        // instinate map with some kind of random BFS
        let queue = [{x: 0, y: 0}];
        let visited = Array(this._map_row).fill(Array(this._map_column).fill(false));   // init 2D array
        let visited_count = 0;

        while(queue.length)
        {
            let current = queue.shift();

            visited[current.x][current.y] = true;
            visited_count++;
            
            // top
            if(current.y + 1 < this._map_row)
            {
                if(!visited[current.x][current.y + 1])
                {
                    queue.push({x: current.x, y: current.y + 1});
                }
            }

            // bottom
            if(current.y - 1 >= 0)
            {

            }

            // left
            if(current.x - 1 >= 0)
            {

            }

            // right
            if(current.x + 1 < this._map_column)
            {

            }

        }


        // for(let i = 0;i < this._map_row;i++)
        // {
        //     for(let j = 0;j < this._map_column;j++)
        //     {

        //     }
        // }
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        let physics_manager = cc.director.getPhysicsManager();

        // enable physics function
        physics_manager.enabled = true;
        physics_manager.debugDrawFlags = 1;

        // get main camera
        this._camera = cc.find("Canvas/Main Camera");
    }

    start () 
    {
        this.generate_map();
    }

    update (dt) 
    {
        this.camera_follow();
    }
}
