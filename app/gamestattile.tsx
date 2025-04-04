import { View, Text, Image } from 'react-native';
import React from 'react';

interface Game {
  id: string;
  userID: string;
  username: string;
  highestScore: number;
  lastGame: string;
  mode: string;
  profilePic: string;
}

const GameStatTile = ({ game }: { game: Game }) => {
  return (
    <View className="bg-slate-800 p-4 m-2 rounded-lg flex-row items-center">
      <Image
        source={{ uri: game.profilePic }}
        className="w-12 h-12 rounded-full mr-4"
        resizeMode="cover"
      />
      <View>
        <Text className="text-white font-bold text-lg">{game.username}</Text>
        <Text className="text-white">Highest Score: {game.highestScore}</Text>
        <Text className="text-white">Last Game: {game.lastGame}</Text>
        <Text className="text-white">Mode: {game.mode}</Text>
      </View>
    </View>
  );
};

export default GameStatTile;
