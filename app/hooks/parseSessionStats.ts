import { defaultSeriesStats } from "../src/values/defaults";
import { Series, SeriesStats } from "../src/values/types";

  const parseSessionStats = (sessionData: Series): SeriesStats => {
    const initialStats: SeriesStats = {
      ...defaultSeriesStats
    };

    Object.entries(sessionData.stats).forEach(([key, value]) => {
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
          initialStats.totalStrikes +=value;
          initialStats.strikePercentage = (initialStats.totalStrikes / initialStats.strikeOpportunities)*100;
          break;
        case "highGame":
          initialStats.highGame = Math.max(initialStats.highGame, value);
          break;
        case "lowGame":
          initialStats.lowGame = Math.min(initialStats.lowGame, value);
          break;
        case "tenPins":
          initialStats.tenPins +=value;
          initialStats.tenPinPercentage = (initialStats.tenPinsConverted/initialStats.tenPins)*100;
          break;
        case "sevenPins":
          initialStats.sevenPins +=value;
          initialStats.sevenPins = (initialStats.sevenPinsConverted/initialStats.sevenPins)*100;
          break;
        case "tenPinsConverted":
          initialStats.tenPinsConverted +=value;
          initialStats.tenPinPercentage = (initialStats.tenPinsConverted/initialStats.tenPins)*100;
          break;
        case "sevenPinsConverted":
          initialStats.sevenPinsConverted +=value;
          initialStats.sevenPins = (initialStats.sevenPinsConverted/initialStats.sevenPins)*100;
          break;
        case "strikeOpportunities":
          initialStats.strikeOpportunities +=value;
          initialStats.strikePercentage = (initialStats.totalStrikes / initialStats.strikeOpportunities)*100;
          break;
        case "splitsTotal":
          initialStats.splitsTotal +=value;
          initialStats.splitsPercentage = (initialStats.splitsConverted/initialStats.splitsTotal)*100;
          break;
        case "splitsConverted":
          initialStats.splitsConverted +=value;
          initialStats.splitsPercentage = (initialStats.splitsConverted/initialStats.splitsTotal)*100;
          break;
        case "washoutsTotal":
          initialStats.washoutsTotal += value;
          initialStats.washoutsPrecentage = (initialStats.washoutsConverted/initialStats.washoutsTotal)*100;
          break;
        case "washoutsConverted":
          initialStats.washoutsConverted += value;
          initialStats.washoutsPrecentage = (initialStats.washoutsConverted/initialStats.washoutsTotal)*100;
          break;
          case "pinCombinations":
            initialStats.pinCombinations = value;
            break;
        default:
          break;
      }
  });
      
    return initialStats;
  };

  export default parseSessionStats;