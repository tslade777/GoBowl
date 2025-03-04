import { addDoc, collection, getDocs, orderBy, query, Timestamp, where } from "firebase/firestore";
import { Series } from "../src/constants/types";
import { db, FIREBASE_AUTH } from "@/firebase.config";
import { format } from "date-fns";

async function getSessions(sessionType: string): Promise<Series[]>{
    const currentUser = FIREBASE_AUTH.currentUser;
    if (!currentUser) {
        console.warn("No user logged in.");
        return [];
    }

    try {
        // Firestore query to filter by user ID and order by date
        const practiceQ = query(
            collection(db, `${sessionType}Sessions`),
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
   * Start a firebase session either for practice or for open play.
   * 
   * @returns The document id of the session that was just started
   */
  const startFirebaseSession = async (sessionName: string, sessionType: string, leagueID: string): Promise<string> =>{
    try{
      if (FIREBASE_AUTH.currentUser != null){
        let uID = FIREBASE_AUTH.currentUser.uid
        
        // Add session to league or just create new session
        if (sessionType=='league'){
          const leageRef = collection(db, `leagueSessions`, uID, 'Leagues', leagueID, 'Weeks')
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
          const docRef = await addDoc(collection(db, `${sessionType}Sessions`),{
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

export {getSessions, startFirebaseSession};
