
const x: i32[] = [0, -1, 0, 1];
const y: i32[] = [1, 0, -1, 0];

let a: i32[][] = new Array<i32[]>(11);
let visit: bool[][] = new Array<bool[]>(11);
let mode: i32 = 0; //1表示要输出console
let train_heart_time1 :i32 = 3;
let train_heart_time2 : i32 = 10;
let train_time3 : f64 = 10;
let train_dis :i32= 3;
let train_dis2 : i32 = 10;
// 初始化数组
for (let i: i32 = 0; i < 11; i++) {
    a[i] = new Array<i32>(11).fill(0);
    //test_a[i] = new Array<i32>(11).fill(0);
    visit[i] = new Array<bool>(11).fill(false);
    //food_map[i] = new Array<i32>(11).fill(0);
}
function cal_heart(n: i32, x: i32, y: i32): f64 {
    let size: f64 = (n == 5) ? 3.0 : 4.5;
    let x_length: f64 = Math.abs(<f64>x - size);
    let y_length: f64 = Math.abs(<f64>y - size);
    let resultx: f64 = Math.pow(Math.abs(x_length) / size, train_heart_time1) * train_heart_time2;
    let resulty: f64 = Math.pow(Math.abs(y_length) / size, train_heart_time1) * train_heart_time2;
    return (resultx + resulty);
}

function cal_dis(n:i32, snake_num : i32,other_snake:i32[],x:i32,y:i32) :f64 {
    let l: f64 = 0;
    let size: f64 = (n == 5) ? 10 : 16;
    for (let i: i32 = 0; i < snake_num; i++) {
        let ll:f64 = Math.abs(other_snake[i * 8] - x) + Math.abs(other_snake[i * 8 + 1] - y);
        l += Math.pow((size - ll) / size, train_dis) * train_dis2;
    }
    return l;
}


class Move {
    x: i32;
    y: i32;
    first: i32;
    F: f64;
    G: i32;
    H: i32;
    dis: f64;
    heart: f64;
    snake: i32[];

    constructor(x: i32, y: i32) {
        this.x = x;
        this.y = y;
        this.first = 0; // 默认值
        this.F = 0; // 默认值
        this.G = 0; // 默认值
        this.H = 0; // 默认值
        this.heart = 0;
        this.dis = 0;
        this.snake = new Array<i32>(8).fill(0);
    }

    // 比较两个Move对象的F值
    isLessThan(other: Move): bool {
        return this.F > other.F;
    }
}


export function greedy_snake_step(n: i32, snake: i32[], snake_num: i32, other_snake: i32[], food_num: i32, food: i32[]): i32 {
    // 初始化二维数组a和visit
    // 初始化数组
    for (let i: i32 = 0; i < 11; i++) {
        a[i] = new Array<i32>(11).fill(0);
        //test_a[i] = new Array<i32>(11).fill(0);
        visit[i] = new Array<bool>(11).fill(false);
        //food_map[i] = new Array<i32>(11).fill(0);
    }

    // 标记其他蛇的位置和周围位置
    for (let i = 0; i < snake_num; i++) {
        a[other_snake[2*i]][other_snake[2*i+1]] = 2;
        a[other_snake[2*i+2]][other_snake[2*i+3]] = 2;
        a[other_snake[2*i+4]][other_snake[2*i+5]] = 2;
        if (other_snake[2*i] + 1 < n && a[other_snake[2*i] + 1][other_snake[2*i+1]] != 2) a[other_snake[2*i] + 1][other_snake[2*i+1]] = 3;
        if (other_snake[2*i] - 1 >= 0 && a[other_snake[2*i] - 1][other_snake[2*i+1]] != 2) a[other_snake[2*i] - 1][other_snake[2*i+1]] = 3;
        if (other_snake[2*i+1] + 1 < n && a[other_snake[2*i]][other_snake[2*i+1] + 1] != 2) a[other_snake[2*i]][other_snake[2*i+1] + 1] = 3;
        if (other_snake[2*i+1] - 1 >= 0 && a[other_snake[2*i]][other_snake[2*i+1] - 1] != 2) a[other_snake[2*i]][other_snake[2*i+1] - 1] = 3;
    }

    // 标记当前蛇的位置
    a[snake[0]][snake[1]] = 1;
    a[snake[2]][snake[3]] = 1;
    a[snake[4]][snake[5]] = 1;

    // 初始化方向和最小值
    let dir: i32 = 0; //modify
    let minn: f64 = 9999;

    // 遍历食物，找到最近的食物方向
    for (let i = 0; i < food_num; i++) {
        let aX: i32 = food[i * 2];
        let aY: i32 = food[i * 2 + 1];
        let m: Move = A_star(n, snake,snake_num,other_snake, aX, aY); // 假设a_star函数已定义
        if (minn > m.F && m.F > 0) {
            minn = m.F;
            dir = m.first;
        }
    }
    if (mode == 1) {
        console.log("return dir: " + dir.toString());
    }
    return dir;
}

function Manhattan(x1: i32, y1: i32, x2: i32, y2: i32): i32 {
    // 使用<i32>进行显式类型转换
    return <i32>(Math.abs(<f64>x1 - <f64>x2) + Math.abs(<f64>y1 - <f64>y2));
}

function A_star(n: i32, snake: i32[],snake_num:i32,other_snake:i32[], aX: i32, aY: i32): Move {
    // 初始化valueF矩阵
    let valueF: f64[][] = new Array<f64[]>(n + 1);
    for (let i = 0; i <= n; i++) {
        valueF[i] = new Array<f64>(n + 1).fill(0);
    }

    // 初始化优先队列
    let q: Move[] = [];
    a[snake[0]][snake[1]] = 1;
    a[snake[2]][snake[3]] = 1;
    a[snake[4]][snake[5]] = 1;
    // 初始化起点的F值
    valueF[snake[0]][snake[1]] = Manhattan(snake[0], snake[1], aX, aY);

    // 生成起点的邻居节点
    for (let i = 0; i < 4; i++) {
        let newX: i32 = snake[0] + x[i];
        let newY: i32 = snake[1] + y[i];
        if (newX > 0 && newX <= n && newY > 0 && newY <= n && a[newX][newY] != 2 && a[newX][newY] != 1 && visit[newX][newY] == false) {
            let length: i32 = Manhattan(newX, newY, aX, aY);
            
            let next: Move = new Move(newX, newY);
            next.heart = cal_heart(n,newX,newY);
            next.dis = cal_dis(n,snake_num,other_snake,newX,newY);
            //            next.F = length + 1;
            next.F = length + 1 + next.heart + a[newX][newY] * train_time3 + next.dis;
            valueF[newX][newY] = next.F;
            next.first = i;
            next.G = 1;
            next.H = length;
            next.snake[0] = newX;
            next.snake[1] = newY;
            next.snake[2] = snake[0];
            next.snake[3] = snake[1];
            next.snake[4] = snake[2];
            next.snake[5] = snake[3];
            next.snake[6] = snake[4];
            next.snake[7] = snake[5];
            q.push(next);
        }
    }

    // 清除蛇的当前位置
    a[snake[0]][snake[1]] = 0;
    a[snake[2]][snake[3]] = 0;
    a[snake[4]][snake[5]] = 0;

    // 模拟优先队列的行为
    q.sort((a, b) => ((a.F - b.F) > 0) ? 1 : -1);

    let flag :i32 = 0;
    // A*算法主循环
    while (q.length > 0) {
        let current: Move = q.shift()!;

        a[current.snake[0]][current.snake[1]] = 1;
        a[current.snake[2]][current.snake[3]] = 1;
        a[current.snake[4]][current.snake[5]] = 1;
        if (flag < 50 && mode == 1) {
            for (let i:i32 = 0; i < q.length; i++ ) {
                console.log(q[i].x.toString() + " " + q[i].y.toString());
            }
        }
        flag ++;
        // 检查是否到达目标点
        if (flag < 20 && mode == 1) {
            console.log(current.x.toString() + " " + current.y.toString() + " " + aX.toString() + " " + aY.toString());
            
        }
        // 检查是否到达目标点
        if (current.x == aX && current.y == aY) {
            if (mode == 1) {
                console.log("return current: " + current.first.toString());
            }
            return current;
        }

        // 生成当前节点的邻居节点
        for (let i = 0; i < 4; i++) {
            let next: Move = new Move(current.x + x[i], current.y + y[i]);
            if (next.x > 0 && next.x <= n && next.y > 0 && next.y <= n && a[next.x][next.y] != 2 && a[next.x][next.y] != 1 && visit[next.x][next.y] == false) {
                next.G = current.G + 1;
                next.H = Manhattan(next.x, next.y, aX, aY);
                next.heart = cal_heart(n,next.x,next.y);
                next.dis = cal_dis(n,snake_num,other_snake,next.x,next.y);
                //next.F = next.G + next.H;
                next.F = next.G + next.H + next.heart + a[next.x][next.y] * train_time3;
                next.first = current.first;
                if (next.F < valueF[next.x][next.y] || valueF[next.x][next.y] == 0) {
                    valueF[next.x][next.y] = next.F;
                    next.snake[0] = next.x;
                    next.snake[1] = next.y;
                    next.snake[2] = current.snake[0];
                    next.snake[3] = current.snake[1];
                    next.snake[4] = current.snake[2];
                    next.snake[5] = current.snake[3];
                    next.snake[6] = current.snake[4];
                    next.snake[7] = current.snake[5];
                    q.push(next);
                }
            }
        }

        // 清除蛇的当前位置
        a[current.snake[0]][current.snake[1]] = 0;
        a[current.snake[2]][current.snake[3]] = 0;
        a[current.snake[4]][current.snake[5]] = 0;

        // 模拟优先队列的行为
        q.sort((a, b) => ((a.F - b.F) > 0) ? 1 : -1);
    }

    // 如果没有找到路径，返回一个默认的Move对象
    if (mode == 1) {
        console.log("move(0, 0)");
    }
    let nn : Move = new Move(0,0);
    nn.first = -1;   
    return nn;
}