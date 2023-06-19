export class A_Star {
    private Canvas_offset = new cc.Vec3(480, 480, 0); // 用來讓左下角變成中心，不然原本中心在正中間
    private map;
    private node; // 2-d node array
    private width: number
    private height: number;

    // heap
    private heap: BinaryHeap;

    private start;
    private end;

    constructor(map) {
        this.map = map;
        this.width = map[0].length;
        this.height = map.length;
    }

    init() {
        this.node = [];
        for (let i = 0; i < this.height; i++) {
            let tmp_node_list = [];
            for (let j = 0; j < this.width; j++) {
                let new_node = {
                    x: i,
                    y: j,
                    visited: false,
                    prev_x: 0,
                    prev_y: 0,
                    g: 9487487,
                    h: 0,
                    f: 9487487
                };
                tmp_node_list.push(new_node);
            }
            this.node.push(tmp_node_list);
        }
        this.heap = new BinaryHeap();
    }

    can_walk(x: number, y: number): boolean {
        if (x + 1 >= this.width || y + 1 >= this.height || x < 0 || y - 1 < 0)
            return false;
        if (this.map[x][y] == 1 || this.map[x][y - 1] == 1 || this.map[x][y + 1] == 1 || this.map[x + 1][y] == 1)
            return false;
        return true;
    }

    walk_neighbors(cur: Node) {
        // 上下左右距離是 10 斜走是 14(目前還沒有)
        let x = cur.x, y = cur.y;
        let r = this.can_walk(x + 1, y), l = this.can_walk(x - 1, y);
        let u = this.can_walk(x, y + 1), d = this.can_walk(x, y - 1);
        if (r) {
            this.insert_node(this.node[x + 1][y], cur.g + 10, 1, 0);
        }
        if (l) {
            this.insert_node(this.node[x - 1][y], cur.g + 10, -1, 0);
        }
        if (u) {
            this.insert_node(this.node[x][y + 1], cur.g + 10, 0, 1);
        }
        if (d) {
            this.insert_node(this.node[x][y - 1], cur.g + 10, 0, -1);
        }

        if (r && u && this.can_walk(x + 1, y + 1)) {
            this.insert_node(this.node[x + 1][y + 1], cur.g + 14, 1, 1);
        }
        if (r && d && this.can_walk(x + 1, y - 1)) {
            this.insert_node(this.node[x + 1][y - 1], cur.g + 14, 1, -1);
        }
        if (l && u && this.can_walk(x - 1, y + 1)) {
            this.insert_node(this.node[x - 1][y + 1], cur.g + 14, -1, 1);
        }
        if (l && d && this.can_walk(x - 1, y - 1)) {
            this.insert_node(this.node[x - 1][y - 1], cur.g + 14, -1, -1);
        }
    }

    insert_node(cur: Node, d: number, x_diff: number, y_diff: number) {
        if (!cur.visited && d < cur.g) {
            cur.g = d;
            if (cur.h == 0) {
                // 評估函式: 1倍的目標距離
                cur.h = Math.floor(10 * Math.sqrt(Math.pow(cur.x - this.end.x, 2) + Math.pow(cur.y - this.end.y, 2)));
            }
            cur.f = cur.g + cur.h;
            cur.prev_x = x_diff;
            cur.prev_y = y_diff;
            this.heap.push(cur);
        }
    }

    search(s: cc.Vec3, e: cc.Vec3): cc.Vec2 | null {
        // time complexity: O(h*w*log(h*w))
        try {
            this.start = cc.v2(Math.floor((s.x + this.Canvas_offset.x) / 32), Math.floor((s.y + this.Canvas_offset.y) / 32));
            this.end = cc.v2(Math.floor((e.x + this.Canvas_offset.x) / 32), Math.floor((e.y + this.Canvas_offset.y) / 32));

            if (this.map[this.end.x][this.end.y] == 1)
                return null;

            this.init();

            this.insert_node(this.node[this.start.x][this.start.y], 0, 0, 0);
            let search_cnt = 0;
            let cur: Node;

            while (this.heap.size() > 0 && search_cnt < 1000) {
                cur = this.heap.pop();
                if (Math.abs(cur.x - this.end.x) + Math.abs(cur.y - this.end.y) <= 2) {
                    while (cur.x - cur.prev_x != this.start.x || cur.y - cur.prev_y != this.start.y) {
                        cur = this.node[cur.x - cur.prev_x][cur.y - cur.prev_y];
                    }
                    if (search_cnt == 0)
                        return null;
                    return new cc.Vec2(cur.prev_x, cur.prev_y);
                }
                if (cur.visited)
                    continue;

                this.node[cur.x][cur.y].visited = true;
                search_cnt++;

                this.walk_neighbors(cur);
            }

            return null;
        }
        catch {
            return null;
        }
    }
}

interface Node {
    x: number;
    y: number;
    visited: boolean;
    prev_x: number;
    prev_y: number;
    g: number; // 距離初始點距離
    h: number; // 評估距離
    f: number; // 前兩項的和
}

// 以下是heap模板
class BinaryHeap {
    private heap: Node[];
    private compare: (a: Node, b: Node) => number;

    constructor() {
        this.heap = [];
        this.compare = (a: Node, b: Node) => {
            return a.f - b.f;
        };
    }

    private getParentIndex(index: number): number {
        return Math.floor((index - 1) / 2);
    }

    private getLeftChildIndex(index: number): number {
        return 2 * index + 1;
    }

    private getRightChildIndex(index: number): number {
        return 2 * index + 2;
    }

    private swap(index1: number, index2: number): void {
        [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
    }

    private heapifyUp(index: number): void {
        if (index === 0) {
            return;
        }

        const parentIndex = this.getParentIndex(index);
        if (this.compare(this.heap[index], this.heap[parentIndex]) < 0) {
            this.swap(index, parentIndex);
            this.heapifyUp(parentIndex);
        }
    }

    private heapifyDown(index: number): void {
        const leftChildIndex = this.getLeftChildIndex(index);
        const rightChildIndex = this.getRightChildIndex(index);
        let smallestIndex = index;

        if (leftChildIndex < this.heap.length && this.compare(this.heap[leftChildIndex], this.heap[smallestIndex]) < 0) {
            smallestIndex = leftChildIndex;
        }

        if (rightChildIndex < this.heap.length && this.compare(this.heap[rightChildIndex], this.heap[smallestIndex]) < 0) {
            smallestIndex = rightChildIndex;
        }

        if (smallestIndex !== index) {
            this.swap(index, smallestIndex);
            this.heapifyDown(smallestIndex);
        }
    }

    public size(): number {
        return this.heap.length;
    }

    public isEmpty(): boolean {
        return this.heap.length === 0;
    }

    public peek(): Node | null {
        if (this.isEmpty()) {
            return null;
        }

        return this.heap[0];
    }

    public push(value: Node): void {
        this.heap.push(value);
        this.heapifyUp(this.heap.length - 1);
    }

    public pop(): Node | null {
        if (this.isEmpty()) {
            return null;
        }

        if (this.heap.length === 1) {
            return this.heap.pop()!;
        }

        const root = this.heap[0];
        this.heap[0] = this.heap.pop()!;
        this.heapifyDown(0);

        return root;
    }
}