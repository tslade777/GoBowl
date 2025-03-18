import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserData } from "../src/values/types";
import { CURRENTUSER } from "../src/config/constants";

// Get data
export const getFromStorage = async (): Promise<UserData | null> => {
    try {
        const jsonVal = await AsyncStorage.getItem(CURRENTUSER);

        if (!jsonVal)return null;

        const data  = JSON.parse(jsonVal);

        const user: UserData = {
          username: data.username,
          email: data.email,
          age: data.age,
          bowlingHand: data.bowlingHand,
          favoriteBall: data.favoriteBall,
          yearsBowling: data.yearsBowling,
          highGame: data.highGame,
          highSeries: data.highSeries,
          profilepic: data.profilepic
        }
        
      return user
    } catch (error) {
      console.error("Error getting data", error);
      return null;
    }
  };

  const defaultValue = {

  }
  export default defaultValue;