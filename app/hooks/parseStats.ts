import { Series } from "../src/types";

interface SeriesStats {
    seriesScore: number;
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
    numberOfGames: number;
    openFrames: number;
    average: number;
  }


  const parseTotalSessionStats = (sessionData: Series[]): SeriesStats => {
    let  singlePinSparePercentage = 0
    let  sparePercentage= 0
    let  singlePinSpares= 0
    let  average= 0
    let  totalSpares= 0
    let  spareOpportunities= 0
    let  numberOfGames= 0
    let  totalShots= 0
    let  openFrames= 0
    let  seriesScore= 0
    let  singlePinAttempts= 0
    let  strikePercentage= 0
    let  totalStrikes= 0
    let  openFramePercentage= 0

  sessionData.forEach((session)=>{
    Object.entries(session.stats).forEach(([key, value]) => {
      switch (key){
        case "singlePinSpares":
          singlePinSpares += value;
          singlePinSparePercentage = (singlePinSpares / singlePinAttempts)*100;
          break;
        case "totalSpares":
          totalSpares += value;
          sparePercentage = (totalSpares / spareOpportunities)*100;
          break;
        case "spareOpportunities":
          spareOpportunities +=value;
          sparePercentage = (totalSpares / spareOpportunities)*100;
          openFramePercentage = (openFrames / spareOpportunities)*100;
          break;
        case "numberOfGames":
          numberOfGames +=value;
          average = (seriesScore/numberOfGames);
          break;
        case "totalShots":
          totalShots +=value;
          break;
        case "openFrames":
          openFrames +=value;
          openFramePercentage = (openFrames / spareOpportunities)*100;
          break;
        case "seriesScore":
          seriesScore +=value;
          break;
        case "singlePinAttempts":
          singlePinAttempts += value;
          singlePinSparePercentage = (singlePinSpares / singlePinAttempts)*100;
          break;
        case "totalStrikes":
          totalStrikes +=value;
          strikePercentage = (totalStrikes / totalShots)*100;
          break;
        default:
          break;
      }
    });
      
  })
    return {singlePinSparePercentage,
          sparePercentage,
          singlePinSpares,
          average,
          totalSpares,
          spareOpportunities,
          numberOfGames,
          totalShots,
          openFrames,
          seriesScore,
          singlePinAttempts,
          strikePercentage,
          totalStrikes,
          openFramePercentage,};
  };

  export default parseTotalSessionStats;