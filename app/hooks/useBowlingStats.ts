import { BowlingStats, Frame } from "../src/constants/types";
import { bowlingStats } from "../src/constants/defaults";
import { useState } from "react";


  /**
   * Calculate the game stats for the entire game.
   * 
   * @param frames The completed bowling game frames.
   * @returns A BowlingStats object that contains various stats.
   */
  const calculateBowlingStats = (frames: Frame[]): BowlingStats => {
    const [stats, setStats] = useState(bowlingStats);
    if (!frames || frames.length === 0) {
      return bowlingStats;
    }
    
  
    let finalScore = 0;
    let totalStrikes = 0;
    let totalSpares = 0;
    let singlePinSpares = 0;
    let singlePinAttempts = 0;
    let openFrames = 0;
    let totalShots = 0;
    let spareOpportunities = 0;
    let strikeOpportunities = 10;
    let tenPins = 0;
    let tenPinsConverted = 0;
    let sevenPins = 0;
    let sevenPinsConverted = 0;
    let splits = 0;
    let splitsConverted = 0;
    let washouts = 0;
    let washoutsConverted = 0;
  
    
    for (let index = 0; index < 10; index++) {
      const { roll1, roll2, roll3, isStrike, isSpare, firstBallPins, secondBallPins, thirdBallPins, score, visible } = frames[index];
      finalScore = score; // Last frame will have the final score
      
      // Tenth frame special stats
      if(index===9){
        totalStrikes += roll1=='10'? 1:0
        totalStrikes += roll2=='10'? 1:0
        totalStrikes += roll3=='10'? 1:0
        if(isSpare)strikeOpportunities+=2;
        else if(isStrike) strikeOpportunities+=2
        else if(isStrike && roll2 == '10')strikeOpportunities+=1
      }
      // Frame strike or spare stats
      else if (isStrike) totalStrikes++;
      if (isSpare) totalSpares++;
  
      // Identify single-pin spare opportunities
      if (!isStrike && roll2 !== "" && firstBallPins.filter(Boolean).length === 9) {
        singlePinAttempts++;
        if (isSpare) singlePinSpares++;

        // Check if it was a ten pin or 7 pin
        tenPins += firstBallPins[9] ? 0 : 1;
        tenPinsConverted += isSpare ? 1 : 0;
        sevenPins += firstBallPins[6] ? 0 : 1;
        sevenPinsConverted += isSpare ? 1 : 0;
      }
      
      // Open frames
      if (!isStrike && !isSpare) openFrames++;
      
      if (roll1 !== "") totalShots++;
      if (roll2 !== "") totalShots++;
      if (index === 9 && roll3 !== "") totalShots++;
  
      if (!isStrike) spareOpportunities++;

    }
    return {
      finalScore,
      totalStrikes,
      totalShots,
      spareOpportunities,
      singlePinAttempts,
      singlePinSpares,
      totalSpares,
      strikePercentage: totalShots > 0 ? (totalStrikes / totalShots) * 100 : 0,
      sparePercentage: spareOpportunities > 0 ? (totalSpares / spareOpportunities) * 100 : 0,
      singlePinSparePercentage: singlePinAttempts > 0 ? (singlePinSpares / singlePinAttempts) * 100 : 0,
      openFramePercentage: frames.length > 0 ? (openFrames / frames.length) * 100 : 0,
      openFrames, 
      strikeOpportunities,
      tenPins,
      tenPinsConverted,
      sevenPins,
      sevenPinsConverted,
      splits,
      splitsConverted,
      washouts,
      washoutsConverted,
    };
  };
  
  export default calculateBowlingStats;
  