import { View, Text } from 'react-native';

const GameStatTile = ({ game }: { game: any }) => {
  return (
    <View className="bg-gray-800 p-4 m-2 rounded-lg">
      <Text className="text-white text-lg font-bold">{game.username}</Text>
      <Text className="text-gray-300">Highest Score: {game.highestScore}</Text>
      <Text className="text-gray-300">Last Game: {game.lastGame}</Text>
      <Text className="text-gray-300">Mode: {game.mode}</Text>
    </View>
  );
};

export default GameStatTile;