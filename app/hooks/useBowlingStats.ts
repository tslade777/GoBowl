import { useEffect, useMemo, useState } from "react";

interface Frame {
  roll1: string;
  roll2: string;
  roll3: string;
  score: number;
  firstBallPins: boolean[];
  secondBallPins: boolean[];
  isSpare: boolean;
  isStrike: boolean;
  visible: boolean;
}

interface BowlingStats {
  finalScore: number;
  totalStrikes: number;
  strikePercentage: number;
  totalSpares: number;
  sparePercentage: number;
  singlePinSparePercentage: number;
  openFramePercentage: number;
}

const useBowlingStats = (frames: Frame[]) => {
    const [stats, setStats] = useState<BowlingStats>({
      finalScore: 0,
      totalStrikes: 0,
      strikePercentage: 0,
      totalSpares: 0,
      sparePercentage: 0,
      singlePinSparePercentage: 0,
      openFramePercentage: 0,
    });
  
    useEffect(() => {
      if (!frames || frames.length === 0) return;
  
      let finalScore = 0;
      let totalStrikes = 0;
      let totalSpares = 0;
      let singlePinSpares = 0;
      let singlePinAttempts = 0;
      let openFrames = 0;
      let totalShots = 0;
      let spareOpportunities = 0;
  
      for (let index = 0; index < frames.length; index++) {
        const { roll1, roll2, roll3, isStrike, isSpare, firstBallPins, score } = frames[index];
  
        finalScore = score; // Last frame will have the final score
  
        if (isStrike) totalStrikes++;
        if (isSpare) totalSpares++;
  
        // Identify single-pin spare opportunities
        if (!isStrike && roll2 !== "" && firstBallPins.filter(Boolean).length === 9) {
          singlePinAttempts++;
          if (isSpare) {
            singlePinSpares++;
          }
        }
  
        // Count open frames (frames without a strike or spare)
        if (!isStrike && !isSpare) {
          openFrames++;
        }
  
        // Count total shots thrown
        if (roll1 !== "") totalShots++;
        if (roll2 !== "") totalShots++;
        if (index === 9 && roll3 !== "") totalShots++; // Only for 10th frame
  
        // Count spare opportunities (frames where a spare was possible)
        if (!isStrike) {
          spareOpportunities++;
        }
      }
  
      // Calculate percentages (avoid division by zero)
      const strikePercentage = totalShots > 0 ? (totalStrikes / totalShots) * 100 : 0;
      const sparePercentage = spareOpportunities > 0 ? (totalSpares / spareOpportunities) * 100 : 0;
      const singlePinSparePercentage = singlePinAttempts > 0 ? (singlePinSpares / singlePinAttempts) * 100 : 0;
      const openFramePercentage = frames.length > 0 ? (openFrames / frames.length) * 100 : 0;
  
      // Update state
      setStats({
        finalScore,
        totalStrikes,
        strikePercentage: parseFloat(strikePercentage.toFixed(2)),
        totalSpares,
        sparePercentage: parseFloat(sparePercentage.toFixed(2)),
        singlePinSparePercentage: parseFloat(singlePinSparePercentage.toFixed(2)),
        openFramePercentage: parseFloat(openFramePercentage.toFixed(2)),
      });
    }, [frames]);
  
    return stats;
  };
  
  export default useBowlingStats;