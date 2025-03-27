// 定义方向数组:上，左，下，右
const x: i32[] = [0, -1, 0, 1]; // 对应方向的 x 偏移量
const y: i32[] = [1, 0, -1, 0]; // 对应方向的 y 偏移量

// 初始化棋盘和访问标记数组
const a: Array<Array<i32>> = new Array<Array<i32>>(9);
const visit: Array<Array<i32>> = new Array<Array<i32>>(9);

for (let i: i32 = 0; i < 9; i++) {
    a[i] = new Array<i32>(9).fill(0);
    visit[i] = new Array<i32>(9).fill(0);
}

class Move {
    x: i32;
    y: i32;
    first: i32;

    constructor(x: i32, y: i32, first: i32) {
        this.x = x;
        this.y = y;
        this.first = first;
    }
}

function check(turn: i32, snake: Array<i32>): void {
    if (turn == 1) {
        a[snake[4]][snake[5]] = 0;
    } else if (turn == 2) {
        a[snake[2]][snake[3]] = 0;
    } else if (turn == 3) {
        a[snake[0]][snake[1]] = 0;
    }
}

export function greedy_snake_move(snake: Array<i32>, food: Array<i32>): i32 {
    for (let i:i32 = 0; i < 8; i++) {
        for (let j : i32 = 0; j < 8; j++) {
            a[i][j] = 0;
            visit[i][j] = 0;
        }
    }
    let turn: i32 = 1;
    a[snake[0]][snake[1]] = 1;
    a[snake[2]][snake[3]] = 1;
    a[snake[4]][snake[5]] = 1;

    let queue: Array<Move> = new Array<Move>();
    
    for (let i: i32 = 0; i < 4; i++) {
        let newX: i32 = <i32>(snake[0] + x[i]);
        let newY: i32 = <i32>(snake[1] + y[i]);
        if (newX > 0 && newX <= 8 && newY > 0 && newY <= 8 && a[newX][newY] == 0 && visit[newX][newY] == 0) {
            visit[newX][newY] = 1;
            queue.push(new Move(newX, newY, i));
        }
    }

    while (queue.length > 0) {
        check(turn, snake);
        let current: Move | null = queue.shift();
        if (current === null) break;
        if (current.x == food[0] && current.y == food[1]) {
            return current.first;
        }
        for (let i: i32 = 0; i < 4; i++) {
            let newX: i32 = <i32>(current.x + x[i]);
            let newY: i32 = <i32>(current.y + y[i]);
            if (newX > 0 && newX <= 8 && newY > 0 && newY <= 8 && a[newX][newY] == 0 && visit[newX][newY] == 0) {
                visit[newX][newY] = 1;
                queue.push(new Move(newX, newY, current.first));
            }
        }
    }
    return -1;
}

export function main(): i32 {
    let snake: i32[] = [1, 1, 1, 2, 1, 3, 1, 4];
    let food: i32[] = [7, 7];

    return greedy_snake_move(snake, food);
}