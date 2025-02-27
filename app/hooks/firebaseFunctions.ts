import { collection, getDocs, orderBy, query, Timestamp, where } from "firebase/firestore";
import { Series } from "../src/constants/types";
import { db, FIREBASE_AUTH } from "@/firebase.config";

export const getAllSessions = async (): Promise<Series[]> => {
    const sessionTypes = ["open", "practice", "tournament"];

    var practiceSessions = await getAllSessionsBySessionType("practice");
    var openSessions = await getAllSessionsBySessionType("open");
    var tournamentSessions = await getAllSessionsBySessionType("tournament");

    return practiceSessions.concat(openSessions).concat(tournamentSessions);
}

export const getAllSessionsBySessionType = async (sessionType: string): Promise<Series[]> => {
    try {
        // Firestore query to filter by user ID and order by date
        const practiceQ = query(
            collection(db, `${sessionType}Sessions`),
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
}

export const getSessionsByUserID = async (userID: string, sessionType: string): Promise<Series[]> => {
    /**
    
    try {
        // Firestore query to filter by user ID and order by date
        const practiceQ = query(
            collection(db, `${sessionType}Sessions`),
            where("userID", "==", userID),
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

     */

    return (await getAllSessionsBySessionType(sessionType)).filter((session) => (session.userID == userID));
};


const getSessions = async (sessionType: string): Promise<Series[]> => {
    const currentUser = FIREBASE_AUTH.currentUser;
    if (!currentUser) {
        console.warn("No user logged in.");
        return [];
    }

    return getSessionsByUserID(currentUser.uid, sessionType)    
};

export default getSessions;
