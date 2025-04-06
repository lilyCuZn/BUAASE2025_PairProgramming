// 定义方向数组
const x: i32[] = [0, -1, 0, 1];
const y: i32[] = [1, 0, -1, 0];
const MAX_SIZE: i32 = 101;
const mode: i32 = 0; //表示是否输出console，1表示输出

// 定义数组:边界应能取到a[9], 因为还考虑了蛇头在右边界时，右边的格子也不能visit（其实可以特判掉，但是算了）
// 为了能取到a[9]，至少定义要到a[10]。
let a: i32[][] = new Array<i32[]>(11);
let test_a: i32[][] = new Array<i32[]>(11);
let visit: bool[][] = new Array<bool[]>(11);
let food_map: i32[][] = new Array<i32[]>(11);

// 初始化数组
for (let i: i32 = 0; i < 11; i++) {
    a[i] = new Array<i32>(11).fill(0);
    test_a[i] = new Array<i32>(11).fill(0);
    visit[i] = new Array<bool>(11).fill(false);
    food_map[i] = new Array<i32>(11).fill(0);
}

class Move {
    x: i32;
    y: i32;
    first: i32;
    snake: i32[];

    constructor(x: i32, y: i32, first: i32, snake: i32[]) {
        this.x = x;
        this.y = y;
        this.first = first;
        this.snake = snake;
    }
}

// BFS 算法
export function greedy_snake_step(n: i32, snake: i32[], snake_num: i32, other_snake: i32[], food_num: i32, food: i32[], round: i32): i32 {
    // a.fill(0);
    // visit.fill(false);
    //已经初始化..
    for (let i: i32 = 0; i < 11; i++) {
      a[i] = new Array<i32>(11).fill(0);
      //test_a[i] = new Array<i32>(11).fill(0);
      visit[i] = new Array<bool>(11).fill(false);
      food_map[i] = new Array<i32>(11).fill(0);
    }

    for (let i: i32 = 0; i < food_num; i++) {
      if (mode == 1) {
        console.log("food:" + food[2*i].toString() + " " + food[2*i+1].toString());
      }
    }

    for (let i: i32 = 0; i < food_num; i++) {
        food_map[food[2*i]][food[2*i+1]] = 1;
    }

    for (let i: i32 = 0; i < snake_num; i++) {
        a[other_snake[2*i]][other_snake[2*i+1]] = 2;
        a[other_snake[2*(i+1)]][other_snake[2*(i+1)+1]] = 2;
        a[other_snake[2*(i+2)]][other_snake[2*(i+2)+1]] = 2;
        a[other_snake[2*i] + 1][other_snake[2*i+1]] = 3;
        a[other_snake[2*i] - 1][other_snake[2*i+1]] = 3;
        a[other_snake[2*i]][other_snake[2*i+1] + 1] = 3;
        a[other_snake[2*i]][other_snake[2*i+1] - 1] = 3;
    }

    a[snake[0]][snake[1]] = 1;
    a[snake[2]][snake[3]] = 1;
    a[snake[4]][snake[5]] = 1;

    if (food_map[snake[0]][snake[1]] == 1) {
        food_map[snake[0]][snake[1]] = 0;
    }

    let queue: Move[] = [];
    let flag1 = 0;
    for (let i: i32 = 0; i < 4; i++) {
        let newX: i32 = snake[0] + x[i];
        let newY: i32 = snake[1] + y[i];
        if (newX > 0 && newX <= n && newY > 0 && newY <= n && a[newX][newY] == 0 && !visit[newX][newY]) {
            visit[newX][newY] = true;
            if (mode == 1) {
              console.log("newX:" + newX.toString() + " " + newY.toString());
            }
            flag1 = 1;
            let snakeCopy: i32[] = [
              newX,
              newY,
              snake[0],
              snake[1],
              snake[2],
              snake[3],
              snake[4],
              snake[5]
          ];
            queue.push(new Move(newX, newY, i, snakeCopy));
        }
    }
    if (flag1 == 0) {
      for (let i: i32 = 0; i < 4; i++) {
        let newX: i32 = snake[0] + x[i];
        let newY: i32 = snake[1] + y[i];
        if (newX > 0 && newX <= n && newY > 0 && newY <= n && a[newX][newY] == 3 && !visit[newX][newY]) {
            visit[newX][newY] = true;
            if (mode == 1) {
              console.log("newX:" + newX.toString() + " " + newY.toString());
            }
            let snakeCopy: i32[] = [
              newX,
              newY,
              snake[0],
              snake[1],
              snake[2],
              snake[3],
              snake[4],
              snake[5]
          ];
            queue.push(new Move(newX, newY, i, snakeCopy));
        }
    }
    }

    a[snake[0]][snake[1]] = 0;
    a[snake[2]][snake[3]] = 0;
    a[snake[4]][snake[5]] = 0;
    while (queue.length > 0) {
        let current: Move = queue.shift()!;
        a[current.snake[0]][current.snake[1]] = 1;
        a[current.snake[2]][current.snake[3]] = 1;
        a[current.snake[4]][current.snake[5]] = 1;
        
        if (food_map[current.snake[0]][current.snake[1]] == 1) {
            if (mode == 1) {
              console.log("goto: " + current.first.toString());
            }
            return current.first;
        }
        let flag2 = 0;
        for (let i: i32 = 0; i < 4; i++) {
            let newX: i32 = current.x + x[i];
            let newY: i32 = current.y + y[i];
            if (newX > 0 && newX <= n && newY > 0 && newY <= n && a[newX][newY] == 0 && !visit[newX][newY]) {
                visit[newX][newY] = true;
                a[newX][newY] = 1;
                flag2 = 1;
                let snakeCopy: i32[] = [
                  newX,
                  newY,
                  current.snake[0],
                  current.snake[1],
                  current.snake[2],
                  current.snake[3],
                  current.snake[4],
                  current.snake[5]
              ];
                queue.push(new Move(newX, newY, current.first, snakeCopy));
                if (mode == 1) {
                  console.log("snakeCopy:" + snakeCopy[0].toString() + " " + snakeCopy[1].toString() + " "+ snakeCopy[2].toString() + " "+ snakeCopy[3].toString() + " "+ snakeCopy[4].toString() + " "+ snakeCopy[5].toString() + " "+ snakeCopy[6].toString() + " "+ snakeCopy[7].toString());
                }
            }
        }
        if (flag2 == 0) {
          for (let i: i32 = 0; i < 4; i++) {
            let newX: i32 = current.x + x[i];
            let newY: i32 = current.y + y[i];
            if (newX > 0 && newX <= n && newY > 0 && newY <= n && a[newX][newY] == 3 && !visit[newX][newY]) {
                visit[newX][newY] = true;
                a[newX][newY] = 1;
                
                let snakeCopy: i32[] = [
                  newX,
                  newY,
                  current.snake[0],
                  current.snake[1],
                  current.snake[2],
                  current.snake[3],
                  current.snake[4],
                  current.snake[5]
              ];
                queue.push(new Move(newX, newY, current.first, snakeCopy));
                if (mode == 1) {
                  console.log("snakeCopy:" + snakeCopy[0].toString() + " " + snakeCopy[1].toString() + " "+ snakeCopy[2].toString() + " "+ snakeCopy[3].toString() + " "+ snakeCopy[4].toString() + " "+ snakeCopy[5].toString() + " "+ snakeCopy[6].toString() + " "+ snakeCopy[7].toString());
                }
            }
        }
        }
        a[current.snake[0]][current.snake[1]] = 0;
        a[current.snake[2]][current.snake[3]] = 0;
        a[current.snake[4]][current.snake[5]] = 0;
    }
    if (mode == 1) {
      console.log("goto: -1");
    }
    
    return 0; //modify
}