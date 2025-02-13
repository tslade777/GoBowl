import { View, Text, ScrollView } from 'react-native';
import StatTile from './StatTile';

const SpareStatsList = () => {
    return (
        <ScrollView>
            <StatTile title="Games played" value={20}/>
            <StatTile title="Total spares" value={23}/>
            <StatTile title="Average spares per game" value={2.3}/>
            <StatTile title="Single pin spare conversion rate:" value="70%"/>
            <StatTile title="Single pin spare miss rate:" value="30%"/>
            <StatTile title="Corner pin spare conversion rate:" value="10%"/>
            <StatTile title="Corner pin spare miss rate:" value="90%"/>
            <StatTile title="Hard spare conversion rate:" value="16%"/>
            <StatTile title="Hard spare miss rate:" value="84%"/>
            <StatTile title="Split spare conversion rate:" value="1%"/>
            <StatTile title="Split spare miss rate:" value="99%"/>
        </ScrollView>
    )
}
export default SpareStatsList;
