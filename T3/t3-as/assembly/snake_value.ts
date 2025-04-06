const x: i32[] = [0, -1, 0, 1];
const y: i32[] = [1, 0, -1, 0];
let a: i32[][] = new Array<i32>(11).fill(0).map(() => new Array<i32>(11).fill(0));
let visit: bool[][] = new Array<bool>(11).fill(false).map(() => new Array<bool>(11).fill(false));
let mode:i32 = 0;
let roundPublic:i32 = 33;
//------------------------------------------//
let snake_target_k:f64 = 1;
let snake_target_exp:f64 = 1;
let snake_body_k: f64 = 1;
let snake_body_exp: f64 = 1;
let food_other_k:f64 = 1;
let food_other_exp:f64 = 1;
let food_center_k: f64 = 1;
let food_center_exp:f64 = 1;
let food_my_k:f64 = 30;
let food_my_exp:f64 = 4;
let snake_center_k:f64 = 1;
let snake_center_exp:f64 = 1;
let center_matrix_5:f64[] = [1, 1, 0.9, 0.7, 0.5];
let center_matrix_8:f64[] = [1, 1, 1, 1, 1, 1, 1, 0.5];
//------------------------------------------//


let snake_life_train: f64[] = [1.0, 2.0, 3.0, 4.0,0.0];
let snake_value_train: f64[] = [3.0, 2.0, 1.0, 0.0];
let cal_other_train:f64 = 1;
let center_matrix :f64 [][] = [[0.0001,2,5,2,0.0001],
                    [2,6,7,6,2],
                    [5,7,8,7,5],
                    [2,6,7,6,2],
                    [0.0001,2,5,2,0.0001]];
let weight1:f64 = 2;
let weight2:f64 = 2;
let weight3:f64 = 0.5;
let weight4:f64 = 1;

// 计算函数
function cal(x: i32, y: i32, obstacleX: i32, obstacleY: i32, train_num: f64): f64 {
    let distance: f64 = (f64)(Math.abs(x - obstacleX) + Math.abs(y - obstacleY));
    //let distance: f64 = Math.sqrt((x - obstacleX) ** 2 + (y - obstacleY) ** 2);
    if (distance == 0) {
        return 999999.0;
    }
    return Math.pow(train_num, 1.0 / distance);
}

function cal_distance(x1: f64, y1: f64, x2:f64, y2:f64):f64 {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function snake_target_penalty(x1:f64,y1:f64,x2:f64,y2:f64) : f64 {
    return snake_target_k / (Math.pow(cal_distance(x1,y1,x2,y2),snake_target_exp) + 1);
}

function snake_body_penalty(x1:f64,y1:f64,x2:f64,y2:f64) : f64 {
    return snake_body_k / (Math.pow(cal_distance(x1,y1,x2,y2),snake_body_exp) + 1);
}

function food_other(x1:f64,y1:f64,x2:f64,y2:f64) : f64 {
    return food_other_k / (Math.pow(cal_distance(x1,y1,x2,y2),food_other_exp) + 1);
}

function food_center(x1:f64,y1:f64,x2:f64,y2:f64, n:i32) : f64 {
    let distance:i32 = (i32)(cal_distance(x1,y1,x2,y2));
    if (n==5) {
        return food_center_k * center_matrix_5[distance];
    } else if (n==8) {
        return food_center_k * center_matrix_8[distance];
    }
    return food_center_k * center_matrix_8[distance]; //不会到这里
    //return food_center_k / (Math.pow(cal_distance(x1,y1,x2,y2),food_center_exp) + 1);
}

function food_my(x1:f64,y1:f64,x2:f64,y2:f64) : f64 {
    return food_my_k / (Math.pow(cal_distance(x1,y1,x2,y2),food_my_exp) + 1);
}

function snake_center(x1:f64,y1:f64,x2:f64,y2:f64,n:i32) : f64 {
    let distance:i32 = (i32)(cal_distance(x1,y1,x2,y2));
    if (n==5) {
        return snake_center_k * center_matrix_5[distance];
    } else if (n==8) {
        return snake_center_k * center_matrix_8[distance];
    }
    return snake_center_k * center_matrix_8[distance];//不会到这里

    //return snake_center_k / (Math.pow(cal_distance(x1,y1,x2,y2),snake_center_exp) + 1);
}

function cal_false_center(x: i32,y:i32, snake_num:i32, other_snake:i32[],n:i32) : f64 {
    let center: f64 = 0;
    if (n==5) {
        center = 3;
    } else {
        center = 4.5;
    }
    let sum:f64 = 0;
    for (let i =0; i < snake_num; i++) {
        sum += ((f64)(Math.abs(x - center) + Math.abs(y - center)) + weight1) 
        / ((f64)(Math.abs(x - other_snake[i * 8]) + Math.abs(y - other_snake[i * 8 + 1])) + weight2);
    }
    return sum * weight3 + weight4;
}

// 计算中心函数

function is_corner(x1:i32, y1:i32, x2:i32, y2:i32, ox1:i32, oy1:i32, ox2:i32, oy2:i32, n:i32):i32 {
    //o开头的是另一条蛇
    let corner:i32[] = [1,1, 1,n, n,n, n,1];
    for (let i=0; i<4; i++) {
        let corner_x:i32=corner[i*2];
        let corner_y:i32=corner[i*2+1];
        if (cal_distance(corner_x,corner_y,x1,y1)==1 
        && cal_distance(corner_x,corner_y,ox1,oy1)==1 ) {
            //说明蛇头在两个角上
            if (x2==x1&&x1==corner_x && oy2==oy1&&oy1==corner_y) {
                if (x1==1) {
                    return 3;//向右走
                } else if (x1==n) {
                    return 1; //向左走
                }
            } else if (y1==y2&&y1==corner_y && ox2==ox1&&ox1==corner_x) {
                if (y1==n) {
                    return 2; //向下走
                } else if (y1==1) {
                    return 0; //向上走
                }
            }
        }
    }
    return -1;
}

function corner(snake: i32[], snake_num: i32, other_snake: i32[], n:i32):i32 {
    if (snake_num != 0) {
        for (let i=0; i<snake_num; i++) {
            let other_snake_x:i32 = other_snake[i*8];
            let other_snake_y:i32 = other_snake[i*8+1];
            let other_snake_x2:i32 = other_snake[i*8+2];
            let other_snake_y2:i32 = other_snake[i*8+3];
            let dir:i32 = is_corner(snake[0], snake[1], snake[2],snake[3], 
                other_snake_x, other_snake_y,other_snake_x2,other_snake_y2,n);
            if (dir!=-1) {
                return dir;
            }
        }
    }
    return -1;
}

// Define direction constants
const UP: i32 = 0;
const LEFT: i32 = 1;
const DOWN: i32 = 2;
const RIGHT: i32 = 3;
const NONE: i32 = -1;

function go_biss(snake: i32[], other_snake: i32[]): i32 {
    if (snake[0] == 4 && snake[1] == 2 && snake[2] == 4 && snake[3] == 3) {
        if (other_snake[0] == 5 && other_snake[1] == 1 && other_snake[2] == 5 && other_snake[3] == 2) {
            return LEFT;
        } else if (other_snake[0] == 5 && other_snake[1] == 2 && other_snake[2] == 5 && other_snake[3] == 3) {
            return DOWN;
        }
    } else if (snake[0] == 3 && snake[1] == 2 && snake[2] == 4 && snake[3] == 2) {
        if (other_snake[0] == 5 && other_snake[1] == 1 && other_snake[2] == 5 && other_snake[3] == 2) {
            return DOWN;
        } else if (other_snake[0] == 4 && other_snake[1] == 1 && other_snake[2] == 5 && other_snake[3] == 1) {
            return LEFT;
        } else if (other_snake[0] == 3 && other_snake[1] == 1 && other_snake[2] == 4 && other_snake[3] == 1) {
            return LEFT;
        }
    } else if (snake[0] == 2 && snake[1] == 2 && snake[2] == 3 && snake[3] == 2) {
        if (other_snake[0] == 4 && other_snake[1] == 1 && other_snake[2] == 5 && other_snake[3] == 1) {
            return DOWN;
        } else if (other_snake[0] == 3 && other_snake[1] == 1 && other_snake[2] == 4 && other_snake[3] == 1) {
            return LEFT;
        } else if (other_snake[0] == 2 && other_snake[1] == 1 && other_snake[2] == 3 && other_snake[3] == 1) {
            return LEFT;
        }
    } else if (snake[0] == 1 && snake[1] == 2 && snake[2] == 2 && snake[3] == 2) {
        if (other_snake[0] == 3 && other_snake[1] == 1 && other_snake[2] == 4 && other_snake[3] == 1) {
            return UP;
        } else if (other_snake[0] == 2 && other_snake[1] == 1 && other_snake[2] == 3 && other_snake[3] == 1) {
            return UP;
        } else if (other_snake[0] == 1 && other_snake[1] == 1 && other_snake[2] == 2 && other_snake[3] == 1) {
            return UP;
        }
    }
    return NONE;
}

function reverse(snake: i32[], other_snake: i32[]): i32 {
    let ans: i32 = go_biss(snake, other_snake);
    if (ans != NONE) {
        return ans;
    }

    let snake1: i32[] = new Array<i32>(8);
    let other_snake1: i32[] = new Array<i32>(8);
    
    for (let i: i32 = 0; i < 4; i++) {
        snake1[i * 2] = snake[i * 2];
        other_snake1[i * 2] = other_snake[i * 2];
        snake1[i * 2 + 1] = Math.abs(snake[i * 2 + 1] - 6) as i32;
        other_snake1[i * 2 + 1] = Math.abs(other_snake[i * 2 + 1] - 6) as i32;
    }

    ans = go_biss(snake1, other_snake1);
    if (ans != NONE) {
        if (ans == UP) {
            return DOWN;
        } else if (ans == DOWN) {
            return UP;
        } else {
            return ans;
        }
    }

    for (let i: i32 = 0; i < 4; i++) {
        snake1[i * 2] = Math.abs(snake[i * 2] - 6) as i32;
        other_snake1[i * 2] = Math.abs(other_snake[i * 2] - 6) as i32;
        snake1[i * 2 + 1] = snake[i * 2 + 1];
        other_snake1[i * 2 + 1] = other_snake[i * 2 + 1];
    }

    ans = go_biss(snake1, other_snake1);
    if (ans != NONE) {
        if (ans == LEFT) {
            return RIGHT;
        } else if (ans == RIGHT) {
            return LEFT;
        } else {
            return ans;
        }
    }

    for (let i: i32 = 0; i < 4; i++) {
        snake1[i * 2] = Math.abs(snake[i * 2] - 6) as i32;
        other_snake1[i * 2] = Math.abs(other_snake[i * 2] - 6) as i32;
        snake1[i * 2 + 1] = Math.abs(snake[i * 2 + 1] - 6) as i32;
        other_snake1[i * 2 + 1] = Math.abs(other_snake[i * 2 + 1] - 6) as i32;
    }

    ans = go_biss(snake1, other_snake1);
    if (ans != NONE) {
        if (ans == UP) {
            return DOWN;
        } else if (ans == DOWN) {
            return UP;
        } else if (ans == LEFT) {
            return RIGHT;
        } else if (ans == RIGHT) {
            return LEFT;
        }
    }
    return ans;
}

function can_biss(snake: i32[], other_snake: i32[]): i32 {
    let ans: i32 = reverse(snake, other_snake);
    if (ans != NONE) {
        return ans;
    }

    let snake1: i32[] = new Array<i32>(8);
    let other_snake1: i32[] = new Array<i32>(8);

    for (let i: i32 = 0; i < 4; i++) {
        snake1[i * 2 + 1] = snake[i * 2];
        other_snake1[i * 2 + 1] = other_snake[i * 2];
        snake1[i * 2] = Math.abs(snake[i * 2 + 1] - 6) as i32;
        other_snake1[i * 2] = Math.abs(other_snake[i * 2 + 1] - 6) as i32;
    }

    ans = reverse(snake1, other_snake1);
    if (ans != NONE) {
        if (ans == UP) {
            return RIGHT;
        } else if (ans == LEFT) {
            return UP;
        } else if (ans == DOWN) {
            return LEFT;
        } else if (ans == RIGHT) {
            return DOWN;
        }
    }
    return ans;
}


// 查找方向函数
export function greedy_snake_step(n: i32, snake: i32[], snake_num: i32, other_snake: i32[], food_num: i32, food: i32[], round: i32): i32 {
    if (snake_num > 0) {

    if (corner(snake, snake_num,other_snake, n) != -1) {
        return corner(snake, snake_num,other_snake, n);
    }
    if (can_biss(snake, other_snake) != -1) {
        return can_biss(snake, other_snake);
    }
}
    if (snake_num==0) {
        snake_target_k = 1;
        snake_target_exp = 1;
        snake_body_k = 1;
        snake_body_exp = 1;
        food_other_k = 1;
        food_other_exp = 1;
        food_center_k = 1;
        food_center_exp = 1;
        food_my_k = 30;
        food_my_exp = 1;
        snake_center_k = 1;
        snake_center_exp = 10;
    }
    if (snake_num == 1) {
        snake_target_k = 5;
        snake_target_exp = 1;
        snake_body_k = 5;
        snake_body_exp = 1;
        food_other_k = 10;
        food_other_exp = 1;
        food_center_k = 1;
        food_center_exp = 1;
        food_my_k = 30;
        food_my_exp = 4;
        snake_center_k = 5;
        snake_center_exp = 2;
    } else if (snake_num > 1) {
        snake_target_k = 5;
        snake_target_exp = 1;
        snake_body_k = 5;
        snake_body_exp = 1;
        food_other_k = 5;
        food_other_exp = 1;
        food_center_k = 1;
        //food_center_exp = 1;
        food_my_k = 3;
        food_my_exp = 1.05;
        snake_center_k = 1;
        //snake_center_exp = 1;
    }
    if (mode == 1 && round == roundPublic) {
        console.log("snake_num:" + snake_num.toString() + " snake_center_k:" + snake_center_k.toString());
    }
    for (let i = 0; i < 11; ++i) {
        for (let j = 0; j < 11; ++j) {
            a[i][j] = 0;
            visit[i][j] = false;
        }
    }
    a[snake[0]][snake[1]] = 1;
    a[snake[2]][snake[3]] = 1;
    a[snake[4]][snake[5]] = 1;
    if (round == roundPublic && mode == 1) {
        for (let j = 1; j <=n; ++j) {
            console.log(a[j][0].toString() + " " +a[j][1].toString() + " " +a[j][2].toString() + " " +a[j][3].toString() + " " +a[j][4].toString() + " ")
        }}
    for (let i = 0; i < snake_num; i++) {
        a[other_snake[i * 8]][other_snake[i * 8 + 1]] = 2;
        a[other_snake[i * 8 + 2]][other_snake[i * 8 + 3]] = 2;
        a[other_snake[i * 8 + 4]][other_snake[i * 8 + 5]] = 2;
//        console.log(other_snake[i * 8].toString() + " " + other_snake[i * 8 + 1].toString() + " " + other_snake[i * 8 + 2].toString() + " " + other_snake[i * 8 + 3].toString() + " " + other_snake[i * 8 + 4].toString() + " ")
    }
    if (round == roundPublic && mode == 1) {
        for (let j = 1; j <=n; ++j) {
            console.log(a[j][1].toString() + " " +a[j][2].toString() + " " +a[j][3].toString() + " " +a[j][4].toString() + " " +a[j][5].toString() + " ")
        }}
    let qx:i32[] = new Array<i32>(100);
    let qy:i32[] = new Array<i32>(100);
    let l = 0,r = 0;
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= n; j++) {
            let flag1 :i32 = 0;//she
            let flag2:i32 = 0;//qing
            for (let k = 0; k < 4; k ++) {
                let nx: i32 = i + x[k];
                let ny: i32 = j + y[k]; 
                if (nx > 0 && nx <= n && ny > 0 && ny <= n && a[nx][ny] == 2) {
                    flag1 ++;
                } else {
                    flag2 ++;
                }
            }
            if (flag1 + flag2 >= 3) {
                if (a[i][j] == 0) {
                    if (flag1 == 3) {
                        a[i][j] = 4;
                    } else {
                        a[i][j] = 3;
                    }
                    
                }
                
                for (let k = 0; k < 4; k ++) {
                    let nx: i32 = i + x[k];
                    let ny: i32 = j + y[k]; 
                    if (nx > 0 && nx <= n && ny > 0 && ny <= n && a[nx][ny] == 0) {
                        qx[r] = i;
                        qy[r] = j;
                        r++;
                    }
                }
            }
        }
    }
    while (l < r) {
        let sx = qx[l];
        let sy = qy[l];
        l++;
        let flag1 = 0;
        let flag2 = 0;
        for (let k = 0; k < 4; k ++) {
            let nx: i32 = sx + x[k];
            let ny: i32 = sy + y[k]; 
            if (nx > 0 && nx <= n && ny > 0 && ny <= n && a[nx][ny] == 2) {
                flag1 ++;
            } else {
                flag2 ++;
            }
        }
        if (flag1 + flag2 >=  3) {
            if (a[sx][sy] != 0) {
                continue;
            }
            if (a[sx][sy] == 0) {
                if (flag1 == 3) {
                    a[sx][sy] = 4;
                } else {
                    a[sx][sy] = 3;
                }
                
            }
            for (let k = 0; k < 4; k ++) {
                let nx: i32 = sx + x[k];
                let ny: i32 = sy + y[k]; 
                if (nx > 0 && nx <= n && ny > 0 && ny <= n && a[nx][ny] == 0) {
                    qx[r] = sx;
                    qy[r] = sy;
                    r++;
                }
            }
        }
    }
    let dir: i32 = 0;
    let maxx: f64 = Number.NEGATIVE_INFINITY;
    if (round == roundPublic && mode == 1) {
    for (let j = 1; j <=n; ++j) {
        console.log(a[j][0].toString() + " " +a[j][1].toString() + " " +a[j][2].toString() + " " +a[j][3].toString() + " " +a[j][4].toString() + " ")
    }}
  //  console.log("\n");
    for (let i = 0; i < 4; i++) {
        let nx: i32 = snake[0] + x[i];
        let ny: i32 = snake[1] + y[i];
        // if (mode == 1) {
        //     if (nx == 3 && ny == 5) {
        //         for (let j = 0; j < 5; j++) {
        //             console.log(a[j][0].toString() + " " +a[j][1].toString() + " " +a[j][2].toString() + " " +a[j][3].toString() + " " +a[j][4].toString() + " ");
                
        //         }
        //     }
        // }
         if (nx > 0 && nx <= n && ny > 0 && ny <= n && (a[nx][ny] == 0 || a[nx][ny] == 3 || a[nx][ny] == 4)) {
            let value: f64 = 0.0;
            for (let j = 0; j < snake_num; j++) {
                let snake_value1: f64 = 0.0;
                for (let k = 0; k < 3; k++) {
                    snake_value1 -= snake_body_penalty((f64)(nx),(f64)(ny),(f64)(other_snake[j * 8 + k * 2]),(f64)( other_snake[j * 8 + k *2 + 1])) * snake_value_train[k];
                }
                // for (let k = 0; k < 4; k++) {
                //     snake_value += cal(nx, ny, other_snake[j * 8 + k * 2], other_snake[j * 8 + k * 2 + 1], snake_body_train) * snake_value_train[k] * cal_other_train;
                // }
                 let snake_life: i32 = 0;
                let snake_value2:f64 = 0;
                for (let k = 0; k < 4; k++) {
                    let sx: i32 = other_snake[j * 8] + x[k];
                    //console.log("K1");
                    let sy: i32 = other_snake[j * 8 + 1] + y[k];
                    //console.log("K2");
                    if (sx > 0 && sx <= n && sy > 0 && sy <= n && a[sx][sy] == 0) {
           //             snake_value += cal(nx, ny, sx, sy, snake_head_train) * cal_head_train;
                        snake_value2 -= snake_target_penalty(nx,ny,sx,sy);
                    } else {
                        snake_life++;
                    }
                }
                value += snake_value1 + snake_value2 * snake_life_train[snake_life];
                if (mode == 1 && roundPublic == round) {
                    console.log("value.2:" + value.toString());
                }
            }
            let size: f64 = n == 5 ? 3 : 4.5;
            let temp:f64 = 0;
            for (let j = 0; j < food_num; j++) {
                //表示单纯的食物奖励：由食物与当前坐标、中间坐标的关系决定
//                value += cal(nx, ny, food[j * 2], food[j * 2 + 1], food_train)* center_matrix[food[j * 2]-1][food[j * 2 + 1]-1] * cal_food_train;
                //表示食物的惩罚：越小越好。离center越近值越小，离别的蛇头越远值越小
  //              value -= cal_false_center(food[j * 2],food[j * 2 + 1],snake_num,other_snake,n);

                // value += cal(nx, ny, food[j * 2], food[j * 2 + 1], food_train)* center_matrix[food[j * 2]-1][food[j * 2 + 1]-1] * cal_food_train 
                // / (cal_false_center(food[j * 2],food[j * 2 + 1],snake_num,other_snake,n)) * BIG_NUM ;

                // temp += cal(nx, ny, food[j * 2], food[j * 2 + 1], food_train)* center_matrix[food[j * 2]-1][food[j * 2 + 1]-1] * cal_food_train 
                // / (cal_false_center(food[j * 2],food[j * 2 + 1],snake_num,other_snake,n)) * BIG_NUM;
                let food_other_value: f64 = 0;
                for (let k = 0; k < snake_num; k++) {
                    food_other_value += food_other((f64)(food[j * 2]),(f64)(food[j * 2 + 1]),(f64)(other_snake[k * 8]),(f64)(other_snake[k * 8 + 1]));
                }
                if (snake_num == 0) {
                    food_other_value = 1000;
                }
                temp = food_other_value / ((Math.abs((f64)(food[j * 2]) - size) + Math.abs((f64)(food[j * 2 + 1]) - size)) + 1.0) / (cal_distance((f64)(food[j * 2]),(f64)(food[j * 2 + 1]),(f64)(nx),(f64)(ny)) + 1.0);
          //      value += food_other_value / ((Math.abs((f64)(food[j * 2]) - size) + Math.abs((f64)(food[j * 2 + 1]) - size)) + 1.0) / (cal_distance((f64)(food[j * 2]),(f64)(food[j * 2 + 1]),(f64)(nx),(f64)(ny)) + 1.0);
                value += food_other_value * food_center((f64)(food[j * 2]),(f64)(food[j * 2 + 1]),size,size, n) 
                * food_my((f64)(food[j * 2]),(f64)(food[j * 2 + 1]),(f64)(nx),(f64)(ny));
                if (mode == 1 && round==roundPublic) {
                    console.log("value.3:" + temp.toString());
                }
            }
            if (mode == 1 && round == roundPublic) {
                console.log("dir is: " + i.toString() + ", cal_food:" + temp.toString());
            }
//            value += cal_center(nx, ny, n);
            //对我们蛇的center惩罚。越小越好。离center越近值越小，离别的蛇头越远值越小
//            value += 1/ (cal_distance((f64)(nx),(f64)(ny),size,size) + 1.0);
            value += snake_center((f64)(nx),(f64)(ny),size,size, n);
            if (mode == 1 && round == roundPublic) {
                console.log("dir is: " + i.toString() + ", cal_center:" + (-cal_false_center(nx,ny,snake_num,other_snake,n)).toString());
            }
            if (a[nx][ny] == 3) {
                value -= 9999;
            } else if (a[nx][ny] == 4) {
                value -= 999;
            }
            if (maxx < value) {
                maxx = value;
                dir = i;
            }
            if (mode == 1 && round == roundPublic) {
                console.log("value:" + value.toString() + " " + i.toString() + " " + dir.toString());
            }
        }
    }
    if (mode == 1 && round == roundPublic) {
        console.log(dir.toString());
        console.log("------------------------");
    }
    return dir;
}