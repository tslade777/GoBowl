import { SeriesStats, BowlingStats, PinCombinations, Friend } from "./types";
// defaults.ts or constants.ts
export const defaultSeriesStats: SeriesStats = {
    seriesScore: 0,
    totalStrikes: 0,
    strikePercentage: 0,
    totalSpares: 0,
    totalShots: 0,
    sparePercentage: 0,
    singlePinSparePercentage: 0,
    openFramePercentage: 0,
    singlePinSpares: 0,
    singlePinAttempts: 0,
    spareOpportunities: 0,
    numberOfGames: 0,
    openFrames: 0,
    average: 0,
    highGame: 0,
    lowGame: 500,
    tenPins: 0,
    tenPinsConverted: 0,
    tenPinPercentage: 0,
    sevenPins: 0,
    sevenPinsConverted: 0,
    sevenPinPercentage: 0,
    strikeOpportunities: 0,
    splitsTotal: 0,
    splitsConverted: 0,
    washoutsTotal: 0,
    washoutsConverted:0,
    splitsPercentage: 0,
    washoutsPrecentage: 0,
    pinCombinations: {}
  };

export const bowlingStats: BowlingStats = {
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
  strikeOpportunities: 0,
  tenPins: 0,
  sevenPins: 0,
  splits: 0,
  washouts: 0,
  tenPinsConverted: 0,
  sevenPinsConverted: 0,
  splitsConverted: 0,
  washoutsConverted: 0,
  pinCombinations: {}
}

export const defaultFriend: Friend = { id: "", username: "Unknown User", profilePic: "", active: false }; // ✅ Prevents `null` issues
  
const defaultValue = {

}
export default defaultValue;