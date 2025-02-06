import { View, Text, ScrollView } from 'react-native';
import StatTile from './StatTile';

const SpareStatsList = () => {
    return (
        <ScrollView>
            <StatTile title="Number of games played" value={20}/>
            <StatTile title="Average score per frame" value={7.8}/>
            <StatTile title="Average score per game" value={78}/>
            <StatTile title="Highest game score in a game" value={213}/>
            <StatTile title="Average number of strikes per game" value={1}/>
            <StatTile title="Average number of spares per game" value={3}/>
            <StatTile title="Highest number of strikes in a game" value={5}/>
            <StatTile title="Longest strike streak" value={4}/>
        </ScrollView>
    )
}
export default SpareStatsList;
