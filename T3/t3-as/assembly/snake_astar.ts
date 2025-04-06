
const x: i32[] = [0, -1, 0, 1];
const y: i32[] = [1, 0, -1, 0];

let a: i32[][] = new Array<i32[]>(11);
let visit: bool[][] = new Array<bool[]>(11);
let mode: i32 = 0; //1表示要输出console
let train_time1 = 3;
let dfs_pos: i32[][] = [];
let train_time2 = 0;
let shadow_map: i32[][] = new Array<i32[]>(11);
let path: i32[] = new Array<i32>(11);
let train_step:i32 = 2;
let train_heart_time1 :i32 = 3;
let train_heart_time2 : i32 = 0;
class Pair {
    first: i32;
    second: i32;

    constructor(first: i32, second: i32) {
        this.first = first;
        this.second = second;
    }
}
// 初始化数组
for (let i: i32 = 0; i < 11; i++) {
    a[i] = new Array<i32>(11).fill(0);
    //test_a[i] = new Array<i32>(11).fill(0);
    visit[i] = new Array<bool>(11).fill(false);
    shadow_map[i] = new Array<i32>(11).fill(0);
    path[i] = 0;
    //food_map[i] = new Array<i32>(11).fill(0);
}
function cal_heart(n: i32, x: i32, y: i32): f64 {
    let size: f64 = (n == 5) ? 3.0 : 4.5;
    let x_length: f64 = Math.abs(<f64>x - size);
    let y_length: f64 = Math.abs(<f64>y - size);
    let train_heart_time1: i32 = 3;
    let train_heart_time2: i32 = 20;
    let result: f64 = Math.pow(Math.abs(x_length - size) / size, train_heart_time1) * train_heart_time2;
    return result;
}

function cal(a: Pair): f64 {
    // 将整数转换为浮点数
    let numerator: f64 = <f64>a.second;
    let denominator: f64 = <f64>a.first;

    // 检查分母是否为零
    if (denominator == 0.0) {
        throw new Error("Division by zero");
    }

    // 计算分数并取幂
    let fraction: f64 = numerator / denominator;
    let powerResult: f64 = Math.pow(fraction, train_time1);

    // 返回最终结果
    return powerResult * train_time2;
}
function dfs(deep: i32, n: i32): void {
    if (deep == n) {
        let path1: i32[] = path.slice();
        dfs_pos.push(path1);
        return;
    }
    for (let i: i32 = 0; i < 4; i++) {
        path[deep] = i;
        dfs(deep + 1, n);
    }
}

class Move {
    x: i32;
    y: i32;
    first: i32;
    F: f64;
    S: Pair;
    G: i32;
    H: i32;
    heart: f64;
    snake: i32[];

    constructor(x: i32, y: i32) {
        this.x = x;
        this.y = y;
        this.first = 0; // 默认值
        this.F = 0; // 默认值
        this.G = 0; // 默认值
        this.H = 0; // 默认值
        this.S = new Pair(0, 0);
        this.heart = 0;
        this.snake = new Array<i32>(8).fill(0);
    }

    // 比较两个Move对象的F值
    isLessThan(other: Move): bool {
        return this.F > other.F;
    }
}


function run_shadow(deep: i32, n: i32, snake_for_kelong: i32[], other_snake_num: i32, now_other_num: i32, other_snake_for_kelong: i32[]): Pair {
    // 初始化 shadow_map
    let snake: i32[] = snake_for_kelong.slice();
    let other_snake: i32[] = other_snake_for_kelong.slice();
    if (mode == 1) {
        console.log("run_shadow initial!");
    }
    for (let i: i32 = 0; i < 11; i++) {
        for (let j: i32 = 0; j < 11; j++) {
            shadow_map[i][j] = 0;
        }
    }
    if (mode == 1) {
        console.log("run_shadow initial finish!");
    }

    shadow_map[snake[0]][snake[1]] = 1;
    shadow_map[snake[2]][snake[3]] = 1;
    shadow_map[snake[4]][snake[5]] = 1;
    if (mode == 1) {
        console.log("aaa");
    }

    for (let i: i32 = 0; i < now_other_num; i++) {
        shadow_map[other_snake[i * 8]][other_snake[i * 8 + 1]] = 1;
        shadow_map[other_snake[i * 8 + 2]][other_snake[i * 8 + 3]] = 1;
        shadow_map[other_snake[i * 8 + 4]][other_snake[i * 8 + 5]] = 1;
    }
    if (mode == 1) {
        console.log("bbb");
    }

    if (deep == 0) {
        if (mode == 1) {
            console.log("return Pair(1,1)");
        }
        return new Pair(1, 1);
    }

    let ans1: i32 = 0;
    let ans2: i32 = 0;
    dfs_pos.length = 0;
    // 调用 dfs 函数
    if (mode == 1) {
        console.log("dfs begin!");
    }
    dfs(0, now_other_num + 1);
    if (mode == 1) {
        console.log("dfs finish!");
    }
    let shadow_pos: i32[][] = [];
    for (let i : i32 = 0; i < dfs_pos.length; i++) {
        let path1: i32[] = dfs_pos[i].slice();
        shadow_pos.push(path1);
    }
    for (let j: i32 = 0; j < shadow_pos.length; j++) {
        let snake_sit: i32[] = new Array<i32>(9).fill(0);
         
        for (let k: i32 = 0; k < now_other_num; k++) {
            let other_newX: i32 = other_snake[k * 8] + x[shadow_pos[j][k]];
            let other_newY: i32 = other_snake[k * 8 + 1] + y[shadow_pos[j][k]];

            if (other_newX > 0 && other_newX <= n && other_newY > 0 && other_newY <= n && shadow_map[other_newX][other_newY] != 1) {
                if (shadow_map[other_newX][other_newY] != 0) {
                    snake_sit[shadow_map[other_newX][other_newY] - 100] = 1;
                    snake_sit[k] = 1;
                } else {
                    shadow_map[other_newX][other_newY] = k + 100;
                    other_snake[k*8+7] = other_snake[k*8+5];
					other_snake[k*8+6] = other_snake[k*8+4];
					other_snake[k*8+5] = other_snake[k*8+3];
					other_snake[k*8+4] = other_snake[k*8+2];
					other_snake[k*8+3] = other_snake[k*8+1];
					other_snake[k*8+2] = other_snake[k*8+0];
					other_snake[k*8+1] = other_newY;
					other_snake[k*8+0] = other_newX;

                    // 更新 other_snake 的位置
/*                    for (let l: i32 = 7; l > 0; l--) {
                        other_snake[k * 8 + l] = other_snake[k * 8 + l - 2];
                    }
                    other_snake[k * 8] = other_newX;
                    other_snake[k * 8 + 1] = other_newY;*/
                }
            } else {
                snake_sit[k] = 1;
            }
        }
        if (mode == 1) {
            console.log("ccc");
        }

        let newX: i32 = snake[0] + x[shadow_pos[j][now_other_num]];
        let newY: i32 = snake[1] + y[shadow_pos[j][now_other_num]];

        if (newX > 0 && newX <= n && newY > 0 && newY <= n && shadow_map[newX][newY] == 0) {
            let new_other_num: i32 = 0;
            let new_other_snake: i32[] = [];

            for (let i: i32 = 0; i < now_other_num; i++) {
                if (snake_sit[i] != 1) {
                    new_other_snake = new_other_snake.concat(other_snake.slice(i * 8, i * 8 + 8));
                    new_other_num++;
                }
            }

            snake[0] = newX;
            snake[1] = newY;
            snake[2] = snake[0];
            snake[3] = snake[1];
            snake[4] = snake[2];
            snake[5] = snake[3];
            snake[6] = snake[4];
            snake[7] = snake[5];

            let result: Pair = run_shadow(deep - 1, n, snake, other_snake_num, new_other_num, new_other_snake);
            ans1 += <i32>result.first;
            ans2 += <i32>result.second;
        } else {
            ans1 += <i32>Math.pow(16, deep - 1);
            ans2 += <i32>Math.pow(16, deep - 1);
        }
    }

    return new Pair(ans1, ans2);
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
    if (mode == 1) {
        console.log("1");
    }

    // 标记其他蛇的位置和周围位置
    for (let i = 0; i < snake_num; i++) {
        if (mode == 1) {
            console.log("other_snake");
        }
        a[other_snake[2*i]][other_snake[2*i+1]] = 2;
        a[other_snake[2*i+2]][other_snake[2*i+3]] = 2;
        a[other_snake[2*i+4]][other_snake[2*i+5]] = 2;
    }
    if (mode == 1) {
        console.log("2");
    }

    // 标记当前蛇的位置
    a[snake[0]][snake[1]] = 1;
    a[snake[2]][snake[3]] = 1;
    a[snake[4]][snake[5]] = 1;
    if (mode == 1) {
        console.log("3");
    }

    // 初始化方向和最小值
    let dir: i32 = -1;
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
        if (newX > 0 && newX <= n && newY > 0 && newY <= n && a[newX][newY] == 0 && visit[newX][newY] == false) {
            let length: i32 = Manhattan(newX, newY, aX, aY);
            
            let next: Move = new Move(newX, newY);
            next.heart = cal_heart(n,newX,newY);
//            next.F = length + 1;
//next.F = length + 1 + next.heart;

next.S = run_shadow(train_step, n, snake, snake_num, snake_num, other_snake);
            next.first = i;
            next.F = length + 1 + next.heart + cal(next.S);
            valueF[newX][newY] = next.F;
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
    q.sort((a, b) => (a.F - b.F) ? 1 : -1);

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
            if (next.x > 0 && next.x <= n && next.y > 0 && next.y <= n && a[next.x][next.y] == 0 && visit[next.x][next.y] == false) {
                next.G = current.G + 1;
                next.H = Manhattan(next.x, next.y, aX, aY);
                next.heart = cal_heart(n,next.x,next.y);
                next.S = run_shadow(train_step, n, current.snake, snake_num, snake_num, other_snake);
                //next.F = next.G + next.H;
//                next.F = next.G + next.H + next.heart;
                next.first = current.first;
                next.F = next.G + next.H + next.heart + cal(next.S);
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
        q.sort((a, b) => (a.F - b.F) ? 1 : -1);
    }

    // 如果没有找到路径，返回一个默认的Move对象
    if (mode == 1) {
        console.log("move(0, 0)");
    }
    let nn : Move = new Move(0,0);
    nn.first = -1;   
    return nn;
}