interface Frame {
    roll1: string;
    roll2: string;
    roll3: string;
    score: number;
    firstBallPins: boolean[];
    secondBallPins: boolean[];
    thirdBallPins: boolean[];
    isSpare: boolean;
    isStrike: boolean;
    visible: boolean;
  }
  
  interface BowlingStats {
    finalScore: number;
    totalStrikes: number;
    strikePercentage: number;
    totalSpares: number;
    totalShots: number;
    sparePercentage: number;
    singlePinSparePercentage: number;
    openFramePercentage: number;
    singlePinSpares: number;
    singlePinAttempts: number;
    spareOpportunities: number;
    openFrames: number
  }
  
  const calculateBowlingStats = (frames: Frame[]): BowlingStats => {
    if (!frames || frames.length === 0) {
      return {
        finalScore: 0,
        totalStrikes: 0,
        strikePercentage: 0,
        totalSpares: 0,
        singlePinSpares: 0,
        singlePinAttempts: 0,
        sparePercentage: 0,
        singlePinSparePercentage: 0,
        openFramePercentage: 0,
        totalShots: 0,
        spareOpportunities: 0,
        openFrames: 0,
      };
    }
  
    let finalScore = 0;
    let totalStrikes = 0;
    let totalSpares = 0;
    let singlePinSpares = 0;
    let singlePinAttempts = 0;
    let openFrames = 0;
    let totalShots = 0;
    let spareOpportunities = 0;
  
    
    for (let index = 0; index < 10; index++) {
      const { roll1, roll2, roll3, isStrike, isSpare, firstBallPins, secondBallPins, thirdBallPins, score, visible } = frames[index];
      finalScore = score; // Last frame will have the final score
      
      if(index===9){
        totalStrikes += roll1=='10'? 1:0
        totalStrikes += roll2=='10'? 1:0
        totalStrikes += roll3=='10'? 1:0
      }
      if (isStrike) totalStrikes++;
      if (isSpare) totalSpares++;
  
      // Identify single-pin spare opportunities
      if (!isStrike && roll2 !== "" && firstBallPins.filter(Boolean).length === 9) {
        singlePinAttempts++;
        if (isSpare) singlePinSpares++;
      }
  
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
    };
  };
  
  export default calculateBowlingStats;
  