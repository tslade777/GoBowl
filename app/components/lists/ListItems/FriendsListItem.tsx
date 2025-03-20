import { View, Text, TouchableOpacity, Image } from "react-native";
import icons from '../../../../constants/icons'
import { getLocalImagePath } from "@/app/hooks/ImageFunctions";

export default function LiveListItem({
  username = "Username",
  active = false,
  profilePicture,
  onHold,
  onTouch,
}: {
  username: string;
  profilePicture?: string;
  active: boolean;
  onHold?: () => void;
  onTouch?: () => void;
}) {
  // TODO: if the localPic cannot be found, we need to get it from firebase.
  const localPic = getLocalImagePath(username+".png")
  return (
    <TouchableOpacity
      className="flex-row items-center justify-between p-4 bg-slate-500 rounded-3xl my-3 active:bg-gray-100"
      onLongPress={onHold} // Handle hold event
      onPress={onTouch} // Handle touch event
    >
      <View className="flex-row items-center space-x-3">
        <Image
          source={profilePicture ? { uri: profilePicture } : icons.profile}
          className="w-10 h-10 rounded-full"
        />
        <Text className="text-white ml-3 text-2xl font-psemibold">{username}</Text>
      </View>
      <View className="flex-row items-center space-x-2">
        <Text className={`${active ? "text-red-600" : "text-gray-700"} font-psemibold text-2xl`}>LIVE</Text>
        <View className={`w-3 h-3 ml-2 ${active ? "bg-red-600" : "bg-gray-700"} rounded-full`} />
      </View>
      
    </TouchableOpacity>
  );
}
