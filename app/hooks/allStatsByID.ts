import { FIREBASE_AUTH } from "@/firebase.config";
import { Series, SeriesStats } from "../src/values/types";
import { getLeagues, getLeaguesByID, getLeagueSessions, getLeagueSessionsByID, getSessions, getSessionsByID } from "./firebaseFunctions";
import { defaultSeriesStats } from "../src/values/defaults";
import { SESSIONS } from "../src/config/constants";
import parseTotalSessionStats from "./parseTotalSessionStats";


/**
 * Retrieve the session data from a specific session
 * @param sessionType {practiceSessions, openSessions, tournamentSessions}
 * @returns 
 */
const getAllStatsByID = async (id:string): Promise<SeriesStats> => {
    let totalSessions: Series[] = []
    
   
    const leagues = await getLeaguesByID(id);
    // Get all sessions from all leagues. 
    if (leagues){
        leagues.forEach(async element => {
            let leagueSessions = await getLeagueSessionsByID(id, element.leagueID)
            totalSessions = [...totalSessions, ...leagueSessions]
        });
    }
    // Get all sessions from Tournaments
    let tournamentSessions = await getSessionsByID(id,SESSIONS.tournament)
     
    totalSessions = [...totalSessions, ...tournamentSessions]
    let openSessions = await getSessionsByID(id,SESSIONS.open)
    
    totalSessions = [...totalSessions, ...openSessions]
    let practiceSessions = await getSessionsByID(id,SESSIONS.practice)
    totalSessions = [...totalSessions, ...practiceSessions]
    
    return parseTotalSessionStats(totalSessions)
}

export default getAllStatsByID