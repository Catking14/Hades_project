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
    _minimap_camera: cc.Node = null;

    // camera follow object
    @property(cc.Node)
    follow: cc.Node = null;

    // camera shake related
    @property
    shake_duration: number = 0.3;

    @property
    shakes: number = 5;

    @property
    shake_scale: number = 20;

    // map prefabs
    @property(cc.Prefab)
    map1: cc.Prefab = null;

    @property(cc.Prefab)
    map2: cc.Prefab = null;

    @property(cc.Prefab)
    map3: cc.Prefab = null;

    @property(cc.Prefab)
    map4: cc.Prefab = null;
    
    @property(cc.Prefab)
    air_wall: cc.Prefab = null;

    // map size
    _map_row: number = 1;
    _map_column: number = 1;
    _obsiticles: boolean[][] = [];

    // Music and audio effects
    @property
    volume: number = 0.1;

    // source: https://www.youtube.com/watch?v=9X7I3bW49S8
    @property(cc.AudioClip)
    Megalovania: cc.AudioClip = null;

    // music ids'
    _BGM: number = 0;

    // monsters parameter
    _monster_pool: cc.NodePool = null;

    @property
    monster_density: number = 30;

    @property(cc.Prefab)
    skeleton: cc.Prefab = null;

    // player characters
    @property(cc.Prefab)
    warrior: cc.Prefab = null;


    camera_follow()
    {
        let player_pos = this.follow.getPosition();
        let camera_pos = this._camera.getPosition();
        let minimap_pos = this._minimap_camera.getPosition();
    
        camera_pos.lerp(player_pos, 0.1, camera_pos);
        minimap_pos.lerp(player_pos, 0.1, minimap_pos);

        this._camera.setPosition(camera_pos);
        this._minimap_camera.setPosition(minimap_pos);
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

    create_obsiticle_array(type: string, i: number, j: number)
    {
        for(let row = 0;row < 30;row++)
        {
            for(let col = 0;col < 30;col++)
            {
                if(type == "airwall")
                {
                    this._obsiticles[i * 30 + row][j * 30 + col] = true;
                }
                else if(type == "test")
                {
                    if(row == 0 || row == 29)
                    {
                        if(col <= 12 || col >= 17)
                        {
                            this._obsiticles[i * 30 + row][j * 30 + col] = true;
                        }
                    }
                    else if(col == 0 || col == 29)
                    {
                        if(row <= 12 || row >= 17)
                        {
                            this._obsiticles[i * 30 + row][j * 30 + col] = true;
                        }
                    }
                }
            }
        }
    }

    generate_map()
    {
        // random for row
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
        for(let i = -1;i <= this._map_row;i++)
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
        let visited = [];
        let visited_count = 0;
        let min_blocks = Math.floor(Math.random() * this._map_row * this._map_column) / 2;

        console.log(this._map_row, this._map_column);
        // console.log(visited);

        for(let k = 0;k < this._map_row * this._map_column;k++)
        {
            visited.push(0);
        }

        while(min_blocks < 8)
        {
            min_blocks = Math.floor(Math.random() * this._map_row * this._map_column) / 2;
        }

        // random select blocks
        while(queue.length > 0)
        {
            let current = queue.shift();
            let temp_seq = Math.floor(Math.random() * 4);

            visited[current.x * this._map_column + current.y] = 1;
            visited_count++;

            switch(temp_seq)
            {
                case 0:
                    if(current.y + 1 < this._map_column && (Math.random() > 0.6 || visited_count < min_blocks) && visited[current.x * this._map_column + current.y + 1] == 0)
                    {
                        queue.push({x: current.x, y: current.y + 1});
                        continue;
                    }

                    if(current.y - 1 >= 0 && (Math.random() > 0.6 || visited_count < min_blocks) && visited[current.x * this._map_column + current.y - 1] == 0)
                    {
                        queue.push({x: current.x, y: current.y - 1});
                        continue;
                    }
                        
                    if(current.x + 1 < this._map_row && (Math.random() > 0.6 || visited_count < min_blocks) && visited[(current.x + 1) * this._map_column + current.y] == 0)
                    {
                        queue.push({x: current.x + 1, y: current.y});
                        continue;
                    }

                    if(current.x - 1 >= 0 && (Math.random() > 0.6 || visited_count < min_blocks) && visited[(current.x - 1) * this._map_column + current.y] == 0)
                    {
                        queue.push({x: current.x - 1, y: current.y});
                        continue;
                    }
                    break;
                case 1:
                    if(current.y - 1 >= 0 && (Math.random() > 0.6 || visited_count < min_blocks) && visited[current.x * this._map_column + current.y - 1] == 0)
                    {
                        queue.push({x: current.x, y: current.y - 1});
                        continue;
                    }
                        
                    if(current.x + 1 < this._map_row && (Math.random() > 0.6 || visited_count < min_blocks) && visited[(current.x + 1) * this._map_column + current.y] == 0)
                    {
                        queue.push({x: current.x + 1, y: current.y});
                        continue;
                    }

                    if(current.x - 1 >= 0 && (Math.random() > 0.6 || visited_count < min_blocks) && visited[(current.x - 1) * this._map_column + current.y] == 0)
                    {
                        queue.push({x: current.x - 1, y: current.y});
                        continue;
                    }

                    if(current.y + 1 < this._map_column && (Math.random() > 0.6 || visited_count < min_blocks) && visited[current.x * this._map_column + current.y + 1] == 0)
                    {
                        queue.push({x: current.x, y: current.y + 1});
                        continue;
                    }
                    break;
                case 2:
                    if(current.x + 1 < this._map_row && (Math.random() > 0.6 || visited_count < min_blocks) && visited[(current.x + 1) * this._map_column + current.y] == 0)
                    {
                        queue.push({x: current.x + 1, y: current.y});
                        continue;
                    }

                    if(current.x - 1 >= 0 && (Math.random() > 0.6 || visited_count < min_blocks) && visited[(current.x - 1) * this._map_column + current.y] == 0)
                    {
                        queue.push({x: current.x - 1, y: current.y});
                        continue;
                    }

                    if(current.y + 1 < this._map_column && (Math.random() > 0.6 || visited_count < min_blocks) && visited[current.x * this._map_column + current.y + 1] == 0)
                    {
                        queue.push({x: current.x, y: current.y + 1});
                        continue;
                    }

                    if(current.y - 1 >= 0 && (Math.random() > 0.6 || visited_count < min_blocks) && visited[current.x * this._map_column + current.y - 1] == 0)
                    {
                        queue.push({x: current.x, y: current.y - 1});
                        continue;
                    }
                    break;
                default:
                    if(current.x - 1 >= 0 && (Math.random() > 0.6 || visited_count < min_blocks) && visited[(current.x - 1) * this._map_column + current.y] == 0)
                    {
                        queue.push({x: current.x - 1, y: current.y});
                        continue;
                    }

                    if(current.y + 1 < this._map_column && (Math.random() > 0.6 || visited_count < min_blocks) && visited[current.x * this._map_column + current.y + 1] == 0)
                    {
                        queue.push({x: current.x, y: current.y + 1});
                        continue;
                    }

                    if(current.y - 1 >= 0 && (Math.random() > 0.6 || visited_count < min_blocks) && visited[current.x * this._map_column + current.y - 1] == 0)
                    {
                        queue.push({x: current.x, y: current.y - 1});
                        continue;
                    }
                        
                    if(current.x + 1 < this._map_row && (Math.random() > 0.6 || visited_count < min_blocks) && visited[(current.x + 1) * this._map_column + current.y] == 0)
                    {
                        queue.push({x: current.x + 1, y: current.y});
                        continue;
                    }
                    break;
            }

            
        }

        // init obsiticle array
        for(let i = 0;i < this._map_row * 30;i++)
        {
            this._obsiticles[i] = [];

            for(let j = 0;j < this._map_column * 30;j++)
            {
                this._obsiticles[i][j] = false;
            }
        }

        // instantiate map by random
        for(let i = 0;i < this._map_row;i++)
        {
            for(let j = 0;j < this._map_column;j++)
            {
                // if(visited[i * this._map_column + j])
                if(visited[i * this._map_column + j] == 1)
                {
                    let tmp = Math.random();
                    let new_block;
                    if(tmp>0.75){
                        new_block = cc.instantiate(this.map1);
                    }else if(tmp>0.5){
                        new_block = cc.instantiate(this.map2);
                    }else if(tmp>0.25){
                        new_block = cc.instantiate(this.map3);
                    }else{
                        new_block = cc.instantiate(this.map4);
                    }
                    
                    
                    new_block.setPosition(j * this.size_of_map_block, i * this.size_of_map_block);
                    this.create_obsiticle_array("test", i, j);

                    cc.find("Canvas/map").addChild(new_block);
                }
                else
                {
                    let wall = cc.instantiate(this.air_wall);

                    wall.setPosition(j * this.size_of_map_block, i * this.size_of_map_block);
                    this.create_obsiticle_array("airwall", i, j);

                    cc.find("Canvas/map").addChild(wall);
                }
            }
        }

        console.log(this._obsiticles);

        this.generate_mobs();
        
    }

    generate_mobs()
    {
        for(let row = 0;row < this._map_row * 30;row++)
        {
            for(let col = 0;col < this._map_column * 30;col++)
            {
                // console.log(this._obsiticles[row][col]);
                if(this._obsiticles[row][col] == false && (row * 30 + col) % 16 == 4 && Math.random() > 0.8)
                {
                    console.log("in");
                    let ske = cc.instantiate(this.skeleton);
                    this._monster_pool.put(ske);

                    ske.setPosition(col * 32 - 480, row * 32 - 480)     // 480 to make (0, 0) to (-480, -480)
                    ske.getComponent(ske.name).target_set = cc.find("Canvas/New Node");

                    cc.find("Canvas/New Node").addChild(ske);
                }
            }
        }
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
        this._minimap_camera = cc.find("Canvas/Minimap");

        // play BGM
        this._BGM = cc.audioEngine.playMusic(this.Megalovania, true);
        cc.audioEngine.setMusicVolume(this.volume);
        cc.audioEngine.setEffectsVolume(this.volume + 0.05);

        // create NodePool
        this._monster_pool = new cc.NodePool();
    }

    start () 
    {
        this.generate_map();

        // generate selected player
        let p1 = cc.instantiate(this.warrior);

        this.follow = p1;
        p1.setPosition(0, 0);

        cc.find("Canvas/New Node").addChild(p1);
    }

    update (dt) 
    {
        this.camera_follow();
    }
}
