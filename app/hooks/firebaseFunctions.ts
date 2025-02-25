import { collection, onSnapshot, orderBy, query, Timestamp, where } from "firebase/firestore";
import { Series } from "../src/constants/types";
import { db, FIREBASE_AUTH } from "@/firebase.config";
import { useState } from "react";

const getSessions = (sessionType:string): Series[] =>{
    const [sessionData, setSessionData] = useState<Series[]>([]);

    const currentUser = FIREBASE_AUTH.currentUser;
          if (!currentUser) {
              console.warn("No user logged in.");
              return sessionData
          }
        // Firestore query to filter by user ID and order by date
          const practiceQ = query(
              collection(db, `${sessionType}Session`),
              where("userID", "==", currentUser.uid),
              orderBy("date", "desc") // Order newest first
          );
    
          // Subscribe to Firestore updates in real-time
          const unsubscribe = onSnapshot(practiceQ, (querySnapshot) => {
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
              setSessionData(sessions);
          });
    return sessionData;
}

export default getSessions;