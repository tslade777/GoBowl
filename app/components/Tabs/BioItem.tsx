import { View, Text, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';

const BioItem = ({ label, item, editing, onChange }: { 
  label: string; 
  item: string; 
  editing: boolean;
  onChange: (value: string) => void; // Function to update final state
}) => {
  const [localValue, setLocalValue] = useState(item); // Local state for input

  // Sync the input field when editing starts or userData changes
  useEffect(() => {
    setLocalValue(item);
  }, [item, editing]);
  

  return (
    <View className='flex-row border-b-2 mt-5 justify-between border-gray-400 mx-3 mb-1'>
      <Text className='text-white text-3xl font-pbold'>{label}</Text>
      
      {editing ? (
        <TextInput
          className="w-45 border border-gray-400 rounded-lg p-3 text-white text-xl bg-gray-800"
          placeholder={item === "" ? `Enter ${label}` : item}
          placeholderTextColor="#bbb"
          value={localValue}
          onChangeText={setLocalValue} // Only update local state
          onBlur={() => onChange(localValue)}
        />
      ) : (
        <Text className='text-white text-2xl mr-5 font-pbold'>{item}</Text>
      )}
    </View>
  );
};

export default BioItem;
