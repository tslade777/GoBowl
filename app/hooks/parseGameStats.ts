import { Game, GameStats, Series,SeriesStats } from '@/app/src/constants/types';
import { defaultSeriesStats, gamestats } from '../src/constants/defaults';

  const parseGameStats = (gameData: Game[]): GameStats => {
    const initialStats: GameStats = {
          ...gamestats
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
          initialStats.finalScore =value;
          break;
        case "singlePinAttempts":
          initialStats.singlePinAttempts = value;
          initialStats.singlePinSparePercentage = (initialStats.singlePinSpares / initialStats.singlePinAttempts)*100;
          break;
        case "totalStrikes":
          initialStats.totalStrikes + value;
          initialStats.strikePercentage = (initialStats.totalStrikes / initialStats.totalShots)*100;
          break;
      }
    });
      
  })
    return initialStats;
  };

  export default parseGameStats;