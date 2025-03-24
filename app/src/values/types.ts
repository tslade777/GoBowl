export interface SeriesStats {
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
    highGame: number,
    lowGame: number,
    tenPins: number,
    tenPinsConverted: number,
    sevenPins: number,
    sevenPinsConverted: number,
    tenPinPercentage: number,
    sevenPinPercentage: number,
    strikeOpportunities: number,
    splitsTotal: number,
    splitsConverted: number,
    washoutsTotal:number,
    washoutsConverted:number,
    splitsPercentage: number,
    washoutsPrecentage: number,
    pinCombinations:  PinCombinations,
    highSeries: number,
    threeGameSeries: number,
  }

export interface League {
  title: string;
  stats: SeriesStats[];
  weeks: number;
  leagueID: string;
  dateModified: Date;
}
export interface Series {
    id: string;
    date: Date; // Converted from Firestore Timestamp
    games: number[]; // Stores pinfall scores for each frame
    notes: string; // Extra user notes
    title: string; // Title of the session
    userID: string; // User who played the session
    stats: any[]; // Holds frame-by-frame breakdown of strikes, spares, etc.
  }

export interface Game {
    game: any[];
    stats: any[];
}

export interface UserData {
  username: string,
  email: string,
  age: string,
  bowlingHand: string,
  favoriteBall: string,
  yearsBowling: string,
  highGame: string,
  highSeries: string,
  profilepic: string,
}

export interface tGame {
  frames: tFrame[];
  pins: boolean[];
  selectedShot: number;
  currentFrame: number;
  farthestFrame: number;
  isFirstRoll: Boolean;
  isFinalRoll: Boolean;
  striking: Boolean;
  gameComplete: Boolean;
  edited: Boolean;
  gameNum: number;
  finalScore: number,
}

export interface tFrame {
    roll1: number;
    roll2: number;
    roll3: number;
    score: number;
    firstBallPins: boolean[];
    secondBallPins: boolean[];
    thirdBallPins: boolean[];
    isSpare: boolean;
    isStrike: boolean;
    visible: boolean;
    isSplit: boolean;
  }

 export interface BowlingStats {
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
    openFrames: number;
    strikeOpportunities: number;
    tenPins: number;
    tenPinsConverted: number;
    sevenPins:number;
    sevenPinsConverted: number;
    splits: number;
    splitsConverted: number;
    washouts: number;
    washoutsConverted: number;
    pinCombinations:  PinCombinations;
  }

  export interface PinCombinationStats {
    count: number;
    converted: number;
  }
  
  export interface PinCombinations {
    [combination: string]: PinCombinationStats;
  }

  export interface Friend {
    id: string;
    username: string;
    profilePic: string;
    active: boolean;
  }

  export interface Session {
    sessionID: string,
    leagueID: string,
    name: string,
    type: string,
    numGames: number,
    gamesData: any,
    games: tGame[]
    activeGame: boolean, 
    seriesStats: SeriesStats,
    localHighGame: number,
    localLowGame: number,
  }

  const defaultValue = {

  }
  export default defaultValue;
  
