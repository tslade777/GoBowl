import { View, Text, FlatList, Pressable } from 'react-native';
import React from 'react';
import parseSessionStats from '@/src/hooks/parseSessionStats';
import { Series } from '@/src/values/types';



// Single Item Component
const BowlingSeriesItem = ({ series, onPress, onHold }: { series: Series; onPress: () => void; onHold: ()=>void }) => {
    const stats = parseSessionStats(series);
    
    return (
        <Pressable
  onPress={onPress}
  onLongPress={onHold}
>
  {({ pressed }) => (
    <View
      className="bg-gray-300 shadow-md rounded-2xl p-4 my-2 mt-3 mx-4"
      style={{
        transform: [{ scale: pressed ? 0.97 : 1 }],
        opacity: pressed ? 0.85 : 1,
      }}
    >
      <View className="flex-row justify-between">
        <Text className="text-2xl font-pbold text-blue-600">{series.title}</Text>
        <Text className="text-gray-900 text-lg font-pbold">{series.date.toLocaleDateString()}</Text>
      </View>
      <View className="flex-row justify-evenly mt-1">
        <Text className="text-lg text-gray-500">
          Avg: <Text className="font-pbold">{isNaN(stats.average) ? '--' : stats.average.toFixed(2)}</Text>
        </Text>
        <Text className="text-lg text-gray-500">
          High: <Text className="font-pbold">{isNaN(stats.highGame) ? '--' : stats.highGame}</Text>
        </Text>
        <Text className="text-lg text-gray-500">
          Games: <Text className="font-pbold">{isNaN(stats.totalStrikes) ? '--' : stats.numberOfGames}</Text>
        </Text>
      </View>
    </View>
  )}
</Pressable>
    );
};

const SeriesList = ({ data, onItemPress, onHold }: { data: Series[]; onItemPress: (item: any) => void; onHold: (item: Series, index: number)=>void; }) => {
    return (
        <View className="flex-1 w-full h-50">
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({ item,index}) => <BowlingSeriesItem series={item} onPress={() => onItemPress(item)} onHold={()=>onHold(item,index)} />}
            />
        </View>
    );
};

export default SeriesList;
