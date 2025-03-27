import assert from "assert";

// Choose proper "import" depending on your PL.
import { greedy_snake_move } from "./t1-as/build/release.js";
// import { greedy_snake_move } from "./t1_rust/pkg/t1_rust.js";
// [Write your own "import" for other PLs.]
// 假设 Move 是一个构造函数，用于创建移动对象
// 定义方向数组：上，左，下，右
const x = [0, -1, 0, 1]; // 对应方向的 x 偏移量
const y = [1, 0, -1, 0]; // 对应方向的 y 偏移量

// 初始化棋盘和访问标记数组
const a = Array.from({ length: 9 }, () => Array(8).fill(0));
const visit = Array.from({ length: 9 }, () => Array(8).fill(0));

class Move {
    constructor(x, y, first) {
        this.x = x;
        this.y = y;
        this.first = first;
    }
}

function check(turn, snake) {
    if (turn === 1) {
        a[snake[4]][snake[5]] = 0;
    } else if (turn === 2) {
        a[snake[2]][snake[3]] = 0;
    } else if (turn === 3) {
        a[snake[0]][snake[1]] = 0;
    }
}

function greedy_snake_move1(snake, food) {
    // 初始化棋盘和访问标记
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            a[i][j] = 0;
            visit[i][j] = 0;
        }
    }

    let turn = 1;
    a[snake[0]][snake[1]] = 1;
    a[snake[2]][snake[3]] = 1;
    a[snake[4]][snake[5]] = 1;

    let queue = [];

    // 初始方向探索
    for (let i = 0; i < 4; i++) {
        let newX = snake[0] + x[i];
        let newY = snake[1] + y[i];
        if (newX > 0 && newX <= 8 && newY > 0 && newY <= 8 && a[newX][newY] === 0 && visit[newX][newY] === 0) {
            visit[newX][newY] = 1;
            console.log("!!",newX," ",newY);
            queue.push(new Move(newX, newY, i));
        }
    }

    while (queue.length > 0) {
        check(turn, snake);
        let current = queue.shift();
        if (current.x === food[0] && current.y === food[1]) {
            console.log("current.first: " + current.first);
            return current.first;
        }

        for (let i = 0; i < 4; i++) {
            let newX = current.x + x[i];
            let newY = current.y + y[i];
            if (newX > 0 && newX <= 8 && newY > 0 && newY <= 8 && a[newX][newY] === 0 && visit[newX][newY] === 0) {
                visit[newX][newY] = 1;
                queue.push(new Move(newX, newY, current.first));
            }
        }
    }

    return -1;
}


function greedy_snake_fn_checker (snake, food) {
    let now_snake = [
        snake[0], snake[1], snake[2], snake[3], snake[4], snake[5], snake[6], snake[7]
    ];
    let turn = 1;
    while (true) {
        let result = greedy_snake_move(now_snake, food);
        console.log(result);
        let new_snake = [
            now_snake[0] + (result == 3) - (result == 1),
            now_snake[1] + (result == 0) - (result == 2),
            now_snake[0],
            now_snake[1],
            now_snake[2],
            now_snake[3],
            now_snake[4],
            now_snake[5],
        ];

        console.log("new snake: " + new_snake);
        if (new_snake[0] < 1 || new_snake[0] > 8 || new_snake[1] < 1 || new_snake[1] > 8) {
            return -1;
        }
        if (new_snake[0] == new_snake[4] && new_snake[1] == new_snake[5]) {
            return -2;
        }
        if (new_snake[0] == food[0] && new_snake[1] == food[1]) {
            console.log("Total turn: " + turn);
            return turn;
        }
        now_snake = [
            new_snake[0], new_snake[1], new_snake[2], new_snake[3], new_snake[4], new_snake[5], new_snake[6], new_snake[7]
        ];
        if (turn > 200) {
            return -3;
        }
        turn += 1;
    }
}

// Test cases
assert.strictEqual(greedy_snake_fn_checker([4,4,4,5,4,6,4,7], [1,1], greedy_snake_move) >= 0, true);
assert.strictEqual(greedy_snake_fn_checker([1,1,1,2,1,3,1,4], [1,5], greedy_snake_move) >= 0, true);
assert.strictEqual(greedy_snake_fn_checker([1,1,1,2,2,2,2,1], [1,5], greedy_snake_move) >= 0, true);
assert.strictEqual(greedy_snake_fn_checker([1,1,2,1,2,2,1,2], [1,5], greedy_snake_move) >= 0, true);

console.log("🎉 You have passed all the tests provided.");