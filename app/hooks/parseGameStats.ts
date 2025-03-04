import { Game, BowlingStats, Series,SeriesStats } from '@/app/src/values/types';
import { defaultSeriesStats, bowlingStats } from '../src/values/defaults';

  const parseGameStats = (gameData: Game[]): BowlingStats => {
    const initialStats: BowlingStats = {
          ...bowlingStats
        };
    
    console.log("Game Data: ", gameData)
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
          //initialStats.tenPinsConverted = (initialStats.tenPins / initialStats.tenPinsConverted)*100;
          break;
        case "tenPinsConverted":
          initialStats.tenPinsConverted = value;
          //initialStats.tenPinsConverted = (initialStats.tenPins / initialStats.tenPinsConverted)*100;
          break;
        case "sevenPins":
          initialStats.sevenPins = value;
          //initialStats.singlePinSparePercentage = (initialStats.sevenPins / initialStats.sevenPinsConverted)*100;
          break;
        case "sevenPinsConverted":
          initialStats.sevenPinsConverted = value;
          //initialStats.strikePercentage = (initialStats.totalStrikes / initialStats.totalShots)*100;
          break;
        case "splits":
          initialStats.splits = value;
          //initialStats.singlePinSparePercentage = (initialStats.singlePinSpares / initialStats.singlePinAttempts)*100;
          break;
        case "splitsConverted":
          initialStats.splitsConverted = value;
          //initialStats.strikePercentage = (initialStats.totalStrikes / initialStats.strikeOpportunities)*100;
          break;
        case "washouts":
          initialStats.washouts = value;
          //initialStats.strikePercentage = (initialStats.totalStrikes / initialStats.strikeOpportunities)*100;
          break;
        case "washoutsConverted":
          initialStats.washoutsConverted = value;
          //initialStats.singlePinSparePercentage = (initialStats.singlePinSpares / initialStats.singlePinAttempts)*100;
          break;
        case "pinCombinations":
          initialStats.pinCombinations = value;
          //initialStats.strikePercentage = (initialStats.totalStrikes / initialStats.strikeOpportunities)*100;
          break;
      }
    });
      
  })
    return initialStats;
  };

  export default parseGameStats;