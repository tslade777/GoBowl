import React, { useEffect, useState } from "react";
import { View, TextInput, FlatList,Image, Text, TouchableOpacity, Keyboard } from "react-native";
import { Friend } from "@/src/values/types";
import icons from "@/src/constants/icons";


interface SearchBarProps {
  data: Friend[];
  onSelect: (item: Friend) => void;
  onFocus: () => void; // Fix: onFocus should be a function (no parameters)
}

const SearchBar: React.FC<SearchBarProps> = ({ data, onFocus, onSelect }) => {
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState<Friend[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const keyboardHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setShowDropdown(false);
      setQuery("");
    });

    return () => {
      keyboardHideListener.remove(); // Cleanup event listener on unmount
    };
  }, []);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.length > 0) {
      const filtered = data.filter((item) =>
        item.username.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setFilteredData([]);
      setShowDropdown(false);
    }
  };

  const handleSelect = (item: Friend) => {
    setQuery(""); // Clear the input
    setShowDropdown(false); // Hide dropdown
    onSelect(item);
  };

  return (
    <View className="relative w-full">
      <TextInput
        className="h-12 border border-gray-300 rounded-2xl px-3 bg-white"
        placeholder="Search new friends by username..."
        value={query}
        onChangeText={handleSearch}
        onFocus={() => {
          onFocus(); // Call the onFocus function correctly
          setShowDropdown(true); // Show dropdown when clicked
        }}
      />
      {/* Ensure Dropdown Appears Correctly */}
      {showDropdown && (
        <View className="absolute top-14 left-0 right-0 bg-white border border-gray-300 rounded-lg max-h-80 z-50 shadow-lg">
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={filteredData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              
                <TouchableOpacity
                className="px-3 py-2 border-b border-gray-200 bg-white"
                onPress={() => handleSelect(item)}
                >
                  <View className="flex-row ">
                  <Image 
                    className="w-10 h-10 rounded-full"
                    source={item.profilePic && item.profilePic != "" ? { uri: item.profilePic } : icons.profile}/>
                  <Text className="text-black ml-5 mt-2">{item.username}</Text>
                  </View>
                  
                </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default SearchBar;
