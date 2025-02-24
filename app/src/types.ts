export interface SerieStats {
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


export interface Series {
    id: string;
    date: Date; // Converted from Firestore Timestamp
    games: number[]; // Stores pinfall scores for each frame
    notes: string; // Extra user notes
    title: string; // Title of the session
    userID: string; // User who played the session
    stats: any[]; // Holds frame-by-frame breakdown of strikes, spares, etc.
  }


export interface GameState {
    frames: Array<Frames>
}

export interface Frames {
    roll1: string;
    roll2: string;
    roll3: string;
    score: number;
    firstBallPins: Array<boolean>,
    secondBallPins:Array<boolean>, 
    isSpare: boolean, 
    isStrike: boolean, 
    visible: boolean
}