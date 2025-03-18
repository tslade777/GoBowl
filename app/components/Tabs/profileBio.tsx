import { View } from 'react-native';
import React from 'react';
import { UserData } from '@/app/src/values/types';
import BioItem from './BioItem';

const ProfileBio = ({ data, editing, onUpdate }: { 
  data: UserData; 
  editing: boolean;
  onUpdate: (field: keyof UserData, value: string) => void;
}) => {
  return (
    <View className="bg-primary h-full">
      <BioItem label="Email:" item={data.email} editing={false} onChange={() => {}} />
      <BioItem label="Age:" item={data.age} editing={editing} onChange={(value) => onUpdate("age", value)} />
      <BioItem label="Favorite Ball:" item={data.favoriteBall} editing={editing} onChange={(value) => onUpdate("favoriteBall", value)} />
      <BioItem label="Years Bowling:" item={data.yearsBowling} editing={editing} onChange={(value) => onUpdate("yearsBowling", value)} />
      <BioItem label="Hand:" item={data.bowlingHand} editing={editing} onChange={(value) => onUpdate("bowlingHand", value)} />
    </View>
  );
};

export default ProfileBio;
