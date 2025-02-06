import { View, Text } from 'react-native';

const StatTile = ({title, value}:
  {title:any, value:any}) => {

  return (
    <View>
      <Text className="text-xl font-plight text-black-100 mt-5 text-start">{title}: <Text style={{fontWeight: "bold"}}>{value}</Text></Text>
    </View>
  )
}
export default StatTile;
