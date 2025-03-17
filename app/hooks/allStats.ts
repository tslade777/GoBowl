import { FIREBASE_AUTH } from "@/firebase.config";
import { Series, SeriesStats } from "../src/values/types";
import { getLeagues, getLeagueSessions, getSessions } from "./firebaseFunctions";
import { defaultSeriesStats } from "../src/values/defaults";
import { SESSIONS } from "../src/config/constants";
import parseTotalSessionStats from "./parseTotalSessionStats";



/**
 * Retrieve the session data from a specific session
 * @param sessionType {practiceSessions, openSessions, tournamentSessions}
 * @returns 
 */
const getAllStats = async (): Promise<SeriesStats> => {
    let totalSessions: Series[] = []
    const currentUser = FIREBASE_AUTH.currentUser;
    if (currentUser) {
        const leagues = await getLeagues();
        // Get all sessions from all leagues. 
        if (leagues){
            leagues.forEach(async element => {
                let leagueSessions = await getLeagueSessions(element.leagueID)
                totalSessions = [...totalSessions, ...leagueSessions]
            });
        }
        // Get all sessions from Tournaments
        let tournamentSessions = await getSessions(SESSIONS.tournament)
        totalSessions = [...totalSessions, ...tournamentSessions]
        let openSessions = await getSessions(SESSIONS.open)
        totalSessions = [...totalSessions, ...openSessions]
        let practiceSessions = await getSessions(SESSIONS.practice)
        totalSessions = [...totalSessions, ...practiceSessions]
        
        return parseTotalSessionStats(totalSessions)
    }
    else{
        console.warn("No user logged in.");
        return defaultSeriesStats;
    }
}

export default getAllStats