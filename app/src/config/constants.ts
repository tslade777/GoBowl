export const SESSIONS = {
  league: "leagueSessions",
  open: "openSessions",
  practice: "practiceSessions",
  tournament: "tournamentSessions",
};

export const BOWLINGSTATE = 'bowlingGameState';
export const INPROGRESS = 'gameInProgress'
export const CURRENTUSER = 'currentUser'
export const ACTIVESESSION = 'currentSession'
export const SESSIONSTARTED = 'sessionStarted'

export const SPLITS = new Set([
  "89", // 9-10 Split
  "79", // 8-10 Split
  "789", // 8-9-10 Split
  "6789", // 7-8-9-10 Split
  "689", // 7-9-10 Split
  "679", // 7-8-10 Split
  "69", // 7-10 Split
  "68", // 7-9 Split
  "67", // 7-8 Split
  "3679", // 4-7-8-10 Split
  "39", // 4-10 Split
  "16", // 2-7 Split
  "29", // 3-10 Split
  "46", // 5-7 Split
  "49", // 5-10 Split
  "369", // 4-7-10 Split
  "57", // 6-8 Split
  "3679", // 4-7-8-10 Split
  "19", // 2-10
  "26", // 3-7
  "139", // 2-4-10
  "169", // 2-7-10
  "1369", // 2-4-7-10
  "2569", // 3-6-7-10
  "23569", // 3-4-6-7-10
  "13569", // 2-4-6-7-10
  "179", // 2-8-10
  "1679", // 2-7-8-10
  "5689", // 6-7-9-10
  "1259", // 2-3-6-10
  "12569", // 2-3-6-7-10
  "124569", // 2-3-5-6-7-10
  "235689", // 3-4-6-7-9-10
  "3568", // 4-6-7-9
  "13679", // 2-4-7-8-10
  "35", // 4-6
  "34", // 4-5
  "45", // 5-6
  "3569", // 4-6-7-10
  "359", // 4-6-10
  "569", // 6-7-10
  "356", // 4-6-7
  "35679", // 4-6-7-8-10
  "35689", // 4-6-7-9-10
  "38", // 4-9
  "389", // 4-9-10
  "567", // 6-7-8
  "3567", // 4-6-7-8
]);

const defaultValue = {

}
export default defaultValue;
