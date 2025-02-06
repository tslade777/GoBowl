import { View, Text } from 'react-native';

const StatTile = ({title, value}:
  {title:any, value:any}) => {

  return (
    <View>
      <Text>{title}: {value}</Text>
    </View>
  )
}
export default StatTile;
