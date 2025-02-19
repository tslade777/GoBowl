import React, { useEffect, useState } from "react";
import { View, TextInput, FlatList, Text, TouchableOpacity, Pressable } from "react-native";
import "react-native-gesture-handler";

interface SearchBarProps {
  data: string[];
  onSelect: (item: string) => void;
}

  
const SearchBar: React.FC<SearchBarProps> = ({ data, onSelect }) => {
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.length > 0) {
      const filtered = data.filter((item) =>
        item.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setFilteredData([]);
      setShowDropdown(false);
    }
  };

  const handleSelect = (item: string) => {
    console.log("Selected Item:", item); // ✅ Debugging log
    setQuery(item); // ✅ Update the input field with the selected item
    setShowDropdown(false); // ✅ Hide the dropdown
    onSelect(item); // ✅ Pass the selected item to parent component
  };

  return (
    <View className="relative w-full">
      <TextInput
        className="h-12 border border-gray-300 rounded-2xl px-3 bg-white"
        placeholder="Search new friends by username..."
        value={query}
        onChangeText={handleSearch}
      />
      {/* Dropdown List with zIndex Fix */}
      {showDropdown && (
        <View className="absolute top-12 left-0 right-0 bg-white border border-gray-300 rounded-lg max-h-40 z-50">
          <FlatList
            data={filteredData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="px-3 py-2 border-b border-gray-200 bg-white"
                onPress={() => {
                  handleSelect(item);
                }}
              >
                <Text className="text-black">{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default SearchBar;
