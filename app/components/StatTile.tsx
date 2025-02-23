import { View, Text } from 'react-native';

const StatTile = ({title, value}:
  {title:any, value:any}) => {

  return (
    <View>
      <Text className="text-xl font-pregular text-white mt-5 text-start">{title}: 
        <Text className="text-xl font-pregular text-orange mt-5 text-start">  {value}</Text>
        </Text>
    </View>
  )
}
export default StatTile;
