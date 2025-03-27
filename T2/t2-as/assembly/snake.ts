
const x: i32[] = [0, -1, 0, 1];
const y: i32[] = [1, 0, -1, 0];

//console.log("snake.ts begin!");
const a: Array<Array<i32>> = new Array<Array<i32>>(9);
const test_a: Array<Array<i32>> = new Array<Array<i32>>(9);
const visit: Array<Array<bool>> = new Array<Array<bool>>(9);
//console.log("snake.ts init!");
for (let i: i32 = 0; i < 9; i++) {
  a[i] = new Array<i32>(9).fill(0);
  test_a[i] = new Array<i32>(9).fill(0);
  visit[i] = new Array<bool>(9).fill(false);

}
//console.log("snake.ts init finish!");

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

export function greedySnakeMoveBarriers(snake: i32[], food: i32[], barriers: i32[]): i32 {
  console.log("greedy begin!");
  console.log("barriers length: " + barriers.length.toString());
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      a[i][j] = 0;
      visit[i][j] = false;
    }
  }
  console.log("2");

  for (let i = 0; i < 12; i++) {
    a[barriers[i * 2]][barriers[i * 2 + 1]] = 1;
  }

  a[snake[0]][snake[1]] = 1;
  a[snake[2]][snake[3]] = 1;
  a[snake[4]][snake[5]] = 1;

  let q: Move[] = [];

  for (let i = 0; i < 4; i++) {
    let newX = snake[0] + x[i];
    let newY = snake[1] + y[i];
    if (newX > 0 && newX <= 8 && newY > 0 && newY <= 8 && a[newX][newY] == 0 && !visit[newX][newY]) {
      visit[newX][newY] = true;
      q.push(new Move(newX, newY, i, [newX, newY, snake[0], snake[1], snake[2], snake[3], snake[4], snake[5]]));
    }
  }

  a[snake[0]][snake[1]] = 0;
  a[snake[2]][snake[3]] = 0;
  a[snake[4]][snake[5]] = 0;

  while (q.length > 0) {
    let current = q.shift()!;
    a[current.snake[0]][current.snake[1]] = 1;
    a[current.snake[2]][current.snake[3]] = 1;
    a[current.snake[4]][current.snake[5]] = 1;

    if (current.x == food[0] && current.y == food[1]) {
      return current.first;
    }

    for (let i = 0; i < 4; i++) {
      let newX = current.x + x[i];
      let newY = current.y + y[i];
      if (newX > 0 && newX <= 8 && newY > 0 && newY <= 8 && a[newX][newY] == 0 && !visit[newX][newY]) {
        visit[newX][newY] = true;
        a[newX][newY] = 1;
        q.push(new Move(newX, newY, current.first, [newX, newY, current.snake[0], current.snake[1], current.snake[2], current.snake[3], current.snake[4], current.snake[5]]));
      }
    }

    a[current.snake[0]][current.snake[1]] = 0;
    a[current.snake[2]][current.snake[3]] = 0;
    a[current.snake[4]][current.snake[5]] = 0;
  }

  return -1;
}

export function snake_checker(snake: i32[], food: i32[], barriers: i32[], access: i32): i32 {
  //barrier:数组长度为24
  console.log("greedy begin!");
  console.log("barriers length: " + barriers.length.toString());
  let turn: i32 = 1;
  console.log("1");
  let now_snake: i32[] = [snake[0], snake[1], snake[2], snake[3], snake[4], snake[5], snake[6], snake[7]];
  console.log("2");

  for (let i = 0; i < 12; i++) {
    console.log("begin: " + i.toString());
    console.log("barriers[i*2]" + barriers[i*2].toString());
    console.log("barriers[i*2+1]" + barriers[i*2+1].toString());
    test_a[barriers[i * 2]][barriers[i * 2 + 1]] = 1;
    console.log("end:" + i.toString());
  }

  while (true) {
    let result = greedySnakeMoveBarriers(now_snake, food, barriers);
    console.log("2:" + result.toString());
    if (access == 0) {
      if (result != -1) {
        return -5;
      } else {
        return 1;
      }
    }

    if (result < 0 || result > 3) {
      return -4;
    }

    let new_snake: i32[] = [now_snake[0] + x[result], now_snake[1] + y[result], now_snake[0], now_snake[1], now_snake[2], now_snake[3], now_snake[4], now_snake[5]];
 

    if (new_snake[0] < 1 || new_snake[0] > 8 || new_snake[1] < 1 || new_snake[1] > 8) {
      return -1;
    }

    if (new_snake[0] == new_snake[4] && new_snake[1] == new_snake[5]) {
      return -2;
    }

    if (test_a[new_snake[0]][new_snake[1]] == 1) {
      return -2;
    }

    if (new_snake[0] == food[0] && new_snake[1] == food[1]) {
  
      return turn;
    }

    for (let j = 0; j < 8; j++) {
      now_snake[j] = new_snake[j];
    }

    if (turn > 30) {
      return -3;
    }

    turn += 1;
  }
}

export function main(): i32 {
  let snake: i32[] = [1, 4, 1, 3, 1, 2, 1, 1];
  let food: i32[] = [1, 7];
  let barriers: i32[] = [2, 7, 2, 6, 3, 7, 3, 6, 4, 7, 4, 6, 5, 7, 5, 6, 1, 6, 6, 6, 7, 6, 8, 6];
  return greedySnakeMoveBarriers(snake, food, barriers);
}