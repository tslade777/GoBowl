import { db, FIREBASE_AUTH } from "@/firebase.config";
import { collection, onSnapshot, Timestamp } from "firebase/firestore";
import { League } from "../src/constants/types";

type Callback = (leagues: League[]) => void;

function subscribeToLeagues(callback: Callback) {
  const currentUser = FIREBASE_AUTH.currentUser;
  if (!currentUser) {
    console.warn("No user logged in.");
    return () => {};
  }

  try {
    // Reference to the user's "Leagues" collection inside "leagueSessions"
    const nestedCollectionRef = collection(db, "leagueSessions", currentUser.uid, "Leagues");

    // Set up real-time listener
    const unsubscribe = onSnapshot(nestedCollectionRef, (querySnapshot) => {
      const leagues: League[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          title: data.title || "No Title",
          stats: data.stats || [],
          weeks: data.weeks || [],
          leagueID: data.leagueID || "no id",
          dateModified: data.date ? (data.date as Timestamp).toDate() : new Date()
        };
      });

      // Pass updated leagues list to the callback function
      callback(leagues);
    });

    return unsubscribe; // Return the function to stop listening when needed
  } catch (error) {
    console.error("Error subscribing to leagues:", error);
    return () => {};
  }
}

export default subscribeToLeagues;
