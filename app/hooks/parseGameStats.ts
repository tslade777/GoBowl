import { Game, BowlingStats, Series,SeriesStats } from '@/app/src/values/types';
import { bowlingStats } from '../src/values/defaults';

  const parseGameStats = (gameData: Game[]): BowlingStats => {
    const initialStats: BowlingStats = {
          ...bowlingStats
        };
    
    gameData.forEach((game)=>{
    Object.entries(game.stats).forEach(([key, value]) => {
      switch (key){
        case "singlePinSpares":
          initialStats.singlePinSpares = value;
          initialStats.singlePinSparePercentage = (initialStats.singlePinSpares / initialStats.singlePinAttempts)*100;
          break;
        case "totalSpares":
          initialStats.totalSpares = value;
          initialStats.sparePercentage = (initialStats.totalSpares / initialStats.spareOpportunities)*100;
          break;
        case "spareOpportunities":
          initialStats.spareOpportunities =value;
          initialStats.sparePercentage = (initialStats.totalSpares / initialStats.spareOpportunities)*100;
          initialStats.openFramePercentage = (initialStats.openFrames / initialStats.spareOpportunities)*100;
          break;
        case "totalShots":
          initialStats.totalShots = value;
          break;
        case "openFrames":
          initialStats.openFrames = value;
          initialStats.openFramePercentage = (initialStats.openFrames / initialStats.spareOpportunities)*100;
          break;
        case "totalScore":
          initialStats.finalScore = value;
          break;
        case "singlePinAttempts":
          initialStats.singlePinAttempts = value;
          initialStats.singlePinSparePercentage = (initialStats.singlePinSpares / initialStats.singlePinAttempts)*100;
          break;
        case "totalStrikes":
          initialStats.totalStrikes = value;
          initialStats.strikePercentage = (initialStats.totalStrikes / initialStats.strikeOpportunities)*100;
          break;
        case "strikeOpportunities":
          initialStats.strikeOpportunities = value;
          initialStats.strikePercentage = (initialStats.totalStrikes / initialStats.strikeOpportunities)*100;
          break;
        case "tenPins":
          initialStats.tenPins = value;
          break;
        case "tenPinsConverted":
          initialStats.tenPinsConverted = value;
          break;
        case "sevenPins":
          initialStats.sevenPins = value;
          break;
        case "sevenPinsConverted":
          initialStats.sevenPinsConverted = value;
          break;
        case "splits":
          initialStats.splits = value;
          break;
        case "splitsConverted":
          initialStats.splitsConverted = value;
          break;
        case "washouts":
          initialStats.washouts = value;
          break;
        case "washoutsConverted":
          initialStats.washoutsConverted = value;
          break;
        case "pinCombinations":
          initialStats.pinCombinations = value;
          break;
      }
    });
      
  })
    return initialStats;
  };

  export default parseGameStats;