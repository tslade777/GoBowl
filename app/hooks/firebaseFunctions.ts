import { collection, getDocs, orderBy, query, Timestamp, where } from "firebase/firestore";
import { Series } from "../src/constants/types";
import { db, FIREBASE_AUTH } from "@/firebase.config";

const getSessions = async (sessionType: string): Promise<Series[]> => {
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

export default getSessions;
