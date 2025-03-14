import { addDoc, collection, doc, getDoc, getDocs, increment, onSnapshot, orderBy, query, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";
import { Series, SeriesStats, tGame, UserData } from "../src/values/types";
import { db, FIREBASE_AUTH, storage } from "@/firebase.config";
import { format } from "date-fns";
import { CURRENTUSER, SESSIONS } from "../src/config/constants";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import * as FileSystem from 'expo-file-system';
import AsyncStorage from "@react-native-async-storage/async-storage";

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
        weeks: weekCount,
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
 * Retreive and save the current users data from firebase
 * @returns 
 */
const fetchUserData = async () => {
  let currentUser = FIREBASE_AUTH.currentUser;
  if (currentUser == null) return;
  else{
    try {
      const userRef = doc(db, `users/${currentUser.uid}`);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const data = userDoc.data();
        let user:UserData = {
          username: data.username || "N/A",
          email: data.email || "N/A",
          age: data.age ? data.age.toString() : "",
          bowlingHand: data.bowlingHand || "",
          favoriteBall: data.favoriteBall || "",
          yearsBowling: data.yearsBowling ? data.yearsBowling.toString() : "",
          highGame: data.highGame ? data.highGame.toString() : "",
          highSeries: data.highSeries ? data.highSeries.toString() : "",
          profilepic: `${data.username}.png` || "",
        }
        AsyncStorage.setItem(CURRENTUSER, JSON.stringify(user));
      }
      else{
        let user:UserData = {
          username: "N/A",
          email: "N/A",
          age: "N/A",
          bowlingHand: "N/A",
          favoriteBall: "N/A",
          yearsBowling: "N/A",
          highGame: "N/A",
          highSeries: "N/A",
          profilepic: "N/A",
        }
        AsyncStorage.setItem(CURRENTUSER, JSON.stringify(user));
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    } 
  }
};

/**
 * Retreive and save the current users data from firebase
 * @returns 
 */
const fetchUserDataByID = async (id:string) => {
    try {
      const userRef = doc(db, `users/${id}`);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const data = userDoc.data();
        let user:UserData = {
          username: data.username || "N/A",
          email: data.email || "N/A",
          age: data.age ? data.age.toString() : "",
          bowlingHand: data.bowlingHand || "",
          favoriteBall: data.favoriteBall || "",
          yearsBowling: data.yearsBowling ? data.yearsBowling.toString() : "",
          highGame: data.highGame ? data.highGame.toString() : "",
          highSeries: data.highSeries ? data.highSeries.toString() : "",
          profilepic: `${data.username}.png` || "",
        }
        return user;
      }
      else{
        let user:UserData = {
          username: "N/A",
          email: "N/A",
          age: "N/A",
          bowlingHand: "N/A",
          favoriteBall: "N/A",
          yearsBowling: "N/A",
          highGame: "N/A",
          highSeries: "N/A",
          profilepic: "N/A",
        }
        return user
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
};

/**
 * Upload image to firebase
 * @param localUri 
 * @param storagePath 
 * @returns 
 */
const uploadImageToFirebase = async (localUri: string, storagePath: string): Promise<string | null> => {
  try {
    const fileName = localUri.split('/').pop(); // Extract filename
    if (!fileName) throw new Error('Invalid file path');

    const storageRef = ref(storage, `${storagePath}/${fileName}`);

    // Fetch the local file and convert it to a Blob
    const response = await fetch(localUri);
    const fileBlob = await response.blob();

    // Upload the Blob to Firebase
    await uploadBytes(storageRef, fileBlob);

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('📛Error uploading image:', error);
    return null;
  }
};

/**
 * Download and save an image from fireabse 
 * @param imagePath 
 * @returns 
 */
const downloadImageFromFirebase = async (imagePath: string): Promise<string | null> => {
  try {
    // Get Firebase download URL
    const storageRef = ref(storage, imagePath);
    const url = await getDownloadURL(storageRef);

    // Define local file path
    const fileName = imagePath.split('/').pop();
    if (!fileName) return null;

    const localFilePath = `${FileSystem.documentDirectory}${fileName}`;

    // Check if file already exists to prevent redundant downloads
    const fileExists = await FileSystem.getInfoAsync(localFilePath);
    if (fileExists.exists) {
      return localFilePath;
    }

    // Download the file
    const downloadResult = await FileSystem.downloadAsync(url, localFilePath);

    return downloadResult.uri;
  } catch (error) {
    return null;
  }
};


/**
 * Save the complete game in firebase
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


/**
   * 
   */
const setFirebaseActive = async () =>{
  try{
    if (FIREBASE_AUTH.currentUser != null){
      let result = FIREBASE_AUTH.currentUser.uid
      await setDoc(doc(db,"activeUsers", result),{
        active: true,
        id: result,
        watching: 0,
      })
    }
  }catch(e){
    console.error(e)
  }
};


/**
 * 
 */
const setFirebaseInActive = async () =>{
  try{
    if (FIREBASE_AUTH.currentUser != null){
      let result = FIREBASE_AUTH.currentUser.uid
      await updateDoc(doc(db,"activeUsers", result),{
        active: false,
        id: result
      })
    }
  }catch(e){
    console.error(e)
  }
};

/**
 * 
 */
const setFirebaseWatching = async (id:string) =>{
  try{
    await updateDoc(doc(db,"activeUsers", id),{
      watching: increment(1)
    })
    
  }catch(e){
    console.error(e)
  }
};

/**
 * 
 */
const removeFirebaseWatching = async (id:string) =>{
  try{     
    await updateDoc(doc(db,"activeUsers", id),{
      watching: increment(-1)
    })
    
  }catch(e){
    console.error(e)
  }
};

const getFirebaseWatching = (id:string)=>{
  let viewerCount = 0;
  const docRef = doc(db, "activeUsers", id);

    console.log("📡 Subscribing to viewer count updates...");

    // Listen for real-time changes
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        viewerCount = data.watching || 0; // Update state with viewer count
        console.log(`👀 Updated Viewer Count: ${data.watching}`);
      } else {
        viewerCount = 0; // Default to 0 if the document does not exist
      }
      return viewerCount
    });

    unsubscribe();

  return viewerCount
}


/**
 * Save the current game in firebase.
 */
const updateFirebaseActiveGames = async (game: tGame[]) =>{
  try{
    if (FIREBASE_AUTH.currentUser != null){
      let result = FIREBASE_AUTH.currentUser.uid
      await updateDoc(doc(db,"activeUsers", result),{
        games: game,
      })
    }
  }catch(e){
    console.error(e)
  }
};

export {getSessions, startFirebaseSession, 
  updateFirebaseLeagueWeekCount, createNewLeauge,
  updateFirebaseGameComplete, getLeagueSessions, uploadImageToFirebase, downloadImageFromFirebase,
  fetchUserData, updateFirebaseActiveGames, setFirebaseActive, setFirebaseInActive, setFirebaseWatching, 
  getFirebaseWatching, removeFirebaseWatching, fetchUserDataByID};


  const defaultValue = {

  }
  export default defaultValue;
