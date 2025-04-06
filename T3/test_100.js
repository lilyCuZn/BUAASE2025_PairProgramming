// Import game engine
import { 
    initializeGameState, 
    processGameTurn, 
    isGameOver, 
    getFinalResults 
  } from './snake-engine.js';
  
  // Import configuration
  import {
    GAME_MODE,
    snakeModules,
    CUSTOM_SEED
  } from './game-config.js';
  
  // Test parameters
  const TEST_MODE = GAME_MODE;
  const TOTAL_BATTLES = 100;
  
  // Initialize cumulative results
  let cumulativeScores = [];
  let cumulativeTime = [];
  let wins = [];
  let survivalRounds = [];
  
  // Main simulation loop for 100 battles
  for (let battle = 0; battle < TOTAL_BATTLES; battle++) {
    // Initialize game state with different seeds for each battle
    let gameState = initializeGameState(TEST_MODE, snakeModules, CUSTOM_SEED + battle);
    
    if (battle === 0) {
      console.log(`Starting ${TEST_MODE} mode with ${gameState.snake_num} snakes, board size ${gameState.n}x${gameState.n}, ${gameState.food_num} foods, ${gameState.max_rounds} rounds`);
      console.log(`Base seed: 0x${gameState.seed.toString(16).padStart(16, '0')}`);
    }
  
    while (!isGameOver(gameState)) {
      try {
        const { gameState: newGameState, messages } = processGameTurn(gameState);
        gameState = newGameState;
        
        // Suppress individual turn messages during batch runs
      } catch (error) {
        console.error(`Battle ${battle + 1} error:`, error);
        process.exit(1);
      }
    }
  
    // Get the final result for this battle
    const finalResults = getFinalResults(gameState);
    
    // Initialize cumulative arrays if first battle
    if (battle === 0) {
      cumulativeScores = new Array(gameState.snake_num).fill(0);
      cumulativeTime = new Array(gameState.snake_num).fill(0);
      wins = new Array(gameState.snake_num).fill(0);
      survivalRounds = new Array(gameState.snake_num).fill(0);
    }
    
    // Accumulate results
    for (let i = 0; i < gameState.snake_num; i++) {
      cumulativeScores[i] += finalResults.scores[i];
      cumulativeTime[i] += finalResults.time[i];
      survivalRounds[i] += finalResults.dead_round[i] || gameState.max_rounds;
      
      // Check if this snake had the highest score this battle
      if (finalResults.scores[i] === Math.max(...finalResults.scores)) {
        wins[i]++;
      }
    }
    
    // Progress indicator
    if ((battle + 1) % 10 === 0) {
      console.log(`Completed ${battle + 1}/${TOTAL_BATTLES} battles...`);
    }
  }
  
  // Final aggregated results
  console.log("\n=== AGGREGATED RESULTS (100 BATTLES) ===");
  console.log("Total scores:");
  for (let i = 0; i < cumulativeScores.length; i++) {
    console.log(`Snake ${i + 1}: ${cumulativeScores[i]} total points (avg ${(cumulativeScores[i]/TOTAL_BATTLES).toFixed(1)})`);
  }
  
  console.log("\nWin counts:");
  for (let i = 0; i < wins.length; i++) {
    console.log(`Snake ${i + 1}: ${wins[i]} wins (${((wins[i]/TOTAL_BATTLES)*100).toFixed(1)}% win rate)`);
  }
  
  console.log("\nAverage survival rounds:");
  for (let i = 0; i < survivalRounds.length; i++) {
    console.log(`Snake ${i + 1}: ${(survivalRounds[i]/TOTAL_BATTLES).toFixed(1)} rounds`);
  }
  
  console.log("\nTotal computation time per snake:");
  for (let i = 0; i < cumulativeTime.length; i++) {
    console.log(`Snake ${i + 1}: ${cumulativeTime[i].toFixed(1)}ms total (avg ${(cumulativeTime[i]/TOTAL_BATTLES).toFixed(3)}ms per battle)`);
  }