import { SeriesStats, BowlingStats, PinCombinations, Friend, tFrame, tGame, Session, SeriesData } from "./types";
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
  washoutsConverted: 0,
  splitsPercentage: 0,
  washoutsPrecentage: 0,
  highSeries: 0,
  pinCombinations: {},
  threeGameSeries: 0,
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

export const defaultFrame: tFrame = {
  roll1: -1, roll2: -1, roll3: -1, score: -1,
  firstBallPins: Array(10).fill(false),
  secondBallPins: Array(10).fill(false),
  thirdBallPins: Array(10).fill(false),
  isSpare: false, isStrike: false, visible: false, isSplit: false,
  complete: false
}

export const defaultGame: tGame = {
  frames: Array.from({ length: 10 }, () => ({ ...defaultFrame })),
  currentFrame: 0,
  farthestFrame: 0,
  isFirstRoll: true,
  isFinalRoll: false,
  striking: false,
  gameComplete: false,
  edited: false,
  gameNum: 0,
  pins: [],
  finalScore: 0,
  selectedShot: 1
}
export const defaultSeriesData: SeriesData ={
  data: [],
  stats: {...defaultSeriesStats},
}
export const defaultSession: Session ={
  sessionID: "",
  leagueID: "",
  name: "",
  type: "",
  numGames: 1,
  seriesData: defaultSeriesData,
  activeGame: false, 
  localHighGame: 0,
  localLowGame: 301,
}



export const defaultFriend: Friend = { id: "", username: "Unknown User", profilePic: "", active: false }; // ✅ Prevents `null` issues
  
const defaultValue = {

}
export default defaultValue;