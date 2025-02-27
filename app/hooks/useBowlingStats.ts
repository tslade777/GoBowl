import { BowlingStats, Frame, PinCombinations } from "../src/constants/types";
import { bowlingStats } from "../src/constants/defaults";
import { useState } from "react";


  /**
   * Calculate the game stats for the entire game.
   * 
   * @param frames The completed bowling game frames.
   * @returns A BowlingStats object that contains various stats.
   */
  const calculateBowlingStats = (frames: Frame[]): BowlingStats => {
    
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
    const pinCombinations: PinCombinations = {};
    
    for (let index = 0; index < 10; index++) {
      const { roll1, roll2, roll3, isStrike, isSpare, firstBallPins, 
        secondBallPins, thirdBallPins, score, visible, isSplit } = frames[index];
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

      splits += isSplit? 1 : 0;
      splitsConverted += (isSpare && isSplit) ? 1:0;
      
      // Open frames
      if (!isStrike && !isSpare) openFrames++;
      
      if (roll1 !== "") totalShots++;
      if (roll2 !== "") totalShots++;
      if (index === 9 && roll3 !== "") totalShots++;
  
      if (!isStrike) spareOpportunities++;

      // Track Pin Combonations
      
      const standingPins = firstBallPins.map((pin, index) => (!pin ? index + 1 : null)).filter(Boolean) as number[];
      
      // Exclude strikes (all pins down) and gutter balls (no pins down)
      if (standingPins.length > 0 && standingPins.length < 10) {
        const key = standingPins.join(",");

        if (!pinCombinations[key]) {
          pinCombinations[key] = { count: 0, converted: 0 };
        }

        pinCombinations[key].count++;

        // Check if all pins were knocked down in the second roll (converted)
        if (standingPins.every(pin => secondBallPins[pin - 1])) {
          pinCombinations[key].converted++;
        }
      }

    }
    return {
      finalScore,
      totalStrikes,
      totalShots,
      spareOpportunities,
      singlePinAttempts,
      singlePinSpares,
      totalSpares,
      strikePercentage: totalShots > 0 ? (totalStrikes / strikeOpportunities) * 100 : 0,
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
      pinCombinations,
    };
  };
  
  export default calculateBowlingStats;
  