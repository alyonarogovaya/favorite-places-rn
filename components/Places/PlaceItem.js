import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

function PlaceItem({ place, onPress }) {
  const { title, address, imageUri } = place;

  return (
    <Pressable onPress={onPress}>
      <Image source={{ uri: imageUri }} />
      <View>
        <Text>{title}</Text>
        <Text>{address}</Text>
      </View>
    </Pressable>
  );
}

export default PlaceItem;

const styles = StyleSheet.create({});
