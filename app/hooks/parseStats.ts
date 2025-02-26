import { Series,SeriesStats } from '@/app/src/constants/types';
import { defaultSeriesStats } from '../src/constants/defaults';

  const parseTotalSessionStats = (sessionData: Series[]): SeriesStats => {
    const initialStats: SeriesStats = {
          ...defaultSeriesStats
        };

  sessionData.forEach((session)=>{
    Object.entries(session.stats).forEach(([key, value]) => {
      switch (key){
        case "singlePinSpares":
          initialStats.singlePinSpares += value;
          initialStats.singlePinSparePercentage = (initialStats.singlePinSpares / initialStats.singlePinAttempts)*100;
          break;
        case "totalSpares":
          initialStats.totalSpares += value;
          initialStats.sparePercentage = (initialStats.totalSpares / initialStats.spareOpportunities)*100;
          break;
        case "spareOpportunities":
          initialStats.spareOpportunities +=value;
          initialStats.sparePercentage = (initialStats.totalSpares / initialStats.spareOpportunities)*100;
          initialStats.openFramePercentage = (initialStats.openFrames / initialStats.spareOpportunities)*100;
          break;
        case "numberOfGames":
          initialStats.numberOfGames +=value;
          initialStats.average = (initialStats.seriesScore/initialStats.numberOfGames);
          break;
        case "totalShots":
          initialStats.totalShots +=value;
          initialStats.strikePercentage = (initialStats.totalStrikes / initialStats.totalShots)*100;
          break;
        case "openFrames":
          initialStats.openFrames +=value;
          initialStats.openFramePercentage = (initialStats.openFrames / initialStats.spareOpportunities)*100;
          break;
        case "seriesScore":
          initialStats.seriesScore +=value;
          break;
        case "singlePinAttempts":
          initialStats.singlePinAttempts += value;
          initialStats.singlePinSparePercentage = (initialStats.singlePinSpares / initialStats.singlePinAttempts)*100;
          break;
        case "totalStrikes":
          initialStats.totalStrikes += value;
          initialStats.strikePercentage = (initialStats.totalStrikes / initialStats.totalShots)*100;
          break;
        case "highGame":
          initialStats.highGame = Math.max(initialStats.highGame, value);
          break;
        case "lowGame":
          initialStats.lowGame = Math.min(initialStats.lowGame, value);
          break;
        case "tenPins":
          initialStats.tenPins +=value;
          break;
        case "sevenPins":
          initialStats.sevenPins +=value;
          break;
        default:
          break;
      }
    });
      
  })
    return initialStats;
  };

  export default parseTotalSessionStats;