import { View, Text, ScrollView } from 'react-native';
import StatTile from './StatTile';

const BallStatsList = () => {
    return (
        <ScrollView>
            <StatTile title="Number of games played" value={20}/>
            <StatTile title="Average score per frame with Equinox ball" value={7.3}/>
            <StatTile title="Average score per frame with Ion Pro ball" value={8.2}/>
            <StatTile title="Average score per frame with Ion Max ball" value={6.4}/>
            <StatTile title="Average score per frame with house balls" value={5.7}/>
        </ScrollView>
    )
}
export default BallStatsList;
