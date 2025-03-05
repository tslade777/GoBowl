import { addDoc, collection, doc, getDocs, orderBy, query, Timestamp, updateDoc, where } from "firebase/firestore";
import { Series, SeriesStats } from "../src/values/types";
import { db, FIREBASE_AUTH } from "@/firebase.config";
import { format } from "date-fns";
import { SESSIONS } from "../src/config/constants";

/**
 * Retrieve the session data from a specific session
 * @param sessionType {practiceSessions, openSessions, tournamentSessions}
 * @returns 
 */
async function getSessions(sessionType: string): Promise<Series[]>{
    const currentUser = FIREBASE_AUTH.currentUser;
    if (!currentUser) {
        console.warn("No user logged in.");
        return [];
    }

    try {
        // Firestore query to filter by user ID and order by date
        const practiceQ = query(
            collection(db, sessionType),
            where("userID", "==", currentUser.uid),
            orderBy("date", "desc") // Order newest first
        );

        // Fetch data **once** (no real-time updates)
        const querySnapshot = await getDocs(practiceQ);

        // Process and return data
        const sessions: Series[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                date: data.date ? (data.date as Timestamp).toDate() : new Date(),
                games: Array.isArray(data.games) ? data.games : [],
                notes: data.notes || "",
                title: data.title || "No Title",
                userID: data.userID || "",
                stats: data.stats ? data.stats : [],
            };
        });

        return sessions;
    } catch (error) {
        console.error("Error fetching sessions:", error);
        return [];
    }
};

/**
 * Retrieve the session data from a specific session
 * @param sessionType {practiceSessions, openSessions, tournamentSessions}
 * @returns 
 */
async function getLeagueSessions(leagueID: string): Promise<Series[]>{
  const currentUser = FIREBASE_AUTH.currentUser;
  if (!currentUser) {
      console.warn("No user logged in.");
      return [];
  }

  try {
    // Reference to the Weeks collection inside a specific League
    const weeksRef = collection(db, "leagueSessions", currentUser.uid, "Leagues", leagueID, "Weeks");

    // Query all documents in the Weeks collection
    const querySnapshot = await getDocs(query(weeksRef));

    // Convert Firestore data into an array of Series objects
    const weeks: Series[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        date: data.date.toDate(), // Convert Firestore Timestamp to JavaScript Date
        games: data.games || [],
        notes: data.notes || "",
        title: data.title || "",
        userID: data.userID || "",
        stats: data.stats || [],
      };
    });

    console.log("✅ Fetched Weeks:", weeks);
    return weeks;
  } catch (error) {
      console.error("Error fetching sessions:", error);
      return [];
  }
};

/**
   * Start a firebase session either for practice or for open play.
   * 
   * @returns The document id of the session that was just started
   */
  const startFirebaseSession = async (sessionName: string, sessionType: string, leagueID: string) => {
    try{
      if (FIREBASE_AUTH.currentUser != null){
        let uID = FIREBASE_AUTH.currentUser.uid
        
        console.log(`🔥 starting ${sessionType} with name ${sessionName} ${leagueID == '' ? '' : 'and league id: '+leagueID}`)
        // Add session to league or just create new session
        if (sessionType==SESSIONS.league){
          const leageRef = collection(db, SESSIONS.league, uID, 'Leagues', leagueID, 'Weeks')
          const docRef = await addDoc(leageRef,{
            title: sessionName=='' ? format(new Date(), "EEEE, MMMM do, yyyy") : "Week " + sessionName,
            date: new Date(),
            userID: uID,
            leagueID: leagueID, 
            games: [],
            stats:[],
            notes: "",
            image: "",
          })
          return docRef.id
        }
        else{
          const docRef = await addDoc(collection(db, `${sessionType}`),{
            title: sessionName==''? format(new Date(), "EEEE, MMMM do, yyyy") : sessionName,
            date: new Date(),
            userID: uID, 
            games: [],
            stats:[],
            notes: "",
            image: "",
          })
          return docRef.id
        }
      }
    }catch(e){
      console.log(e)
      return ''
    }
    return ''
}

/**
 * Update the week count for the league after a session is complete.
 * 
 * @param leagueID Firebase document ID
 * @param count week count
 */
const updateFirebaseLeagueWeekCount = async (leagueID: string, count: string) => {
  const weekCount = parseInt(count);
  try{
    if (FIREBASE_AUTH.currentUser != null){
      let uID = FIREBASE_AUTH.currentUser.uid
    
      console.log(`🔥Update firebase leagueID: ${leagueID}`)
  
      await updateDoc(doc(db,SESSIONS.league, uID, 'Leagues', leagueID),{
        weeks: count,
      })      
    }
  }catch(e){
    console.error(`📛 Firebase update count error: ${e}`)
  }     
}

/**
 * Create a new league with the provided title and add the league id to the league doc.
 * @param title the title of the league.
 */
const createNewLeauge = async (title: string) => {
  try{
    if (FIREBASE_AUTH.currentUser != null){
      let uID = FIREBASE_AUTH.currentUser.uid
      const leageRef = collection(db, SESSIONS.league, uID, 'Leagues')
      const docRef = await addDoc(leageRef,{
        title: title==''? format(new Date(), "EEEE, MMMM do, yyyy") : title,
        weeks: 0,
        stats:[],
        notes: "",
        image: "",
        dateModified: new Date()
      })
      const newDocRef = doc(db, SESSIONS.league, uID, 'Leagues', docRef.id);
      await updateDoc(newDocRef,{
        leagueID: docRef.id
      })
      }
  }catch(e){
    console.error(e);
  }
}

/**
 * 
 * @param type types can {practice, open, league, tournament}
 * @param name 
 * @param leagueID 
 * @param sessionID 
 * @param gamesData 
 * @param seriesStats 
 */
const updateFirebaseGameComplete = async (type:string, name:string, leagueID:string, sessionID:string, gamesData: any, seriesStats:SeriesStats) =>{
  // check type 
  try{
    if (FIREBASE_AUTH.currentUser != null){
            let uID = FIREBASE_AUTH.currentUser.uid
    
      if(type == SESSIONS.league){

        // Error is in this document. Couldn't find document. NEED TO CREATE SESSION FIRST.
        await updateDoc(doc(db, SESSIONS.league, uID, 'Leagues', leagueID, 'Weeks', sessionID),{
          games: gamesData,
          stats: seriesStats
        })
      }
      else{
        await updateDoc(doc(db,type, sessionID),{
          games: gamesData,
          stats: seriesStats
        })
      }
    }
  }catch(e){
    console.log("👎 Something happened")
    console.error(e)
  }
}

export {getSessions, startFirebaseSession, 
  updateFirebaseLeagueWeekCount, createNewLeauge,
  updateFirebaseGameComplete, getLeagueSessions };
