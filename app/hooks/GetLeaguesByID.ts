import { db, FIREBASE_AUTH } from "@/firebase.config";
import { collection, getDocs, orderBy, query, Timestamp, where } from "firebase/firestore";
import { League, Series } from "../src/constants/types";

async function getLeagues(): Promise<League[]>{
    const currentUser = FIREBASE_AUTH.currentUser;
    if (!currentUser) {
        console.warn("No user logged in.");
        return [];
    }

    try {
        // Firestore query to filter by user ID and order by date
        const nestedCollectionRef = collection(db, 'leagueSessions', currentUser.uid, 'Leagues');
        const querySnapshot = await getDocs(nestedCollectionRef);
        const docs: League[] = querySnapshot.docs.map((doc)=>{
        const data = doc.data();
            return{
                title: data.title || "No Title",
                stats: data.stats,
                weeks: data.weeks,
            }
        })

    return docs
    } catch (error) {
        console.error("Error fetching sessions:", error);
        return [];
    }
};

export default getLeagues;