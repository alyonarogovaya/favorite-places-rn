import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import ImagePicker from './ImagePicker';
import LocationPicker from './LocationPicker';
import Button from '../UI/Button';
import { Colors } from '../../constants/colors';
import { Place } from '../../models/place';

function PlaceForm({ onCreatePlace }) {
  const [enteredTitle, setEnteredTitle] = useState('');
  const [pickedLocation, setPickedLocation] = useState();
  const [selectedImage, setSelectedImage] = useState();

  const changeTitle = (enteredText) => {
    setEnteredTitle(enteredText);
  };

  const takeImage = (image) => {
    setSelectedImage(image);
  };

  const pickLocation = (location) => {
    setPickedLocation(location);
  };

  const savePlace = () => {
    const placeData = new Place(enteredTitle, selectedImage, pickedLocation);
    onCreatePlace(placeData);
  };

  return (
    <ScrollView style={styles.form}>
      <View>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={enteredTitle}
          onChangeText={changeTitle}
        />
      </View>

      <ImagePicker onTakeImage={takeImage} image={selectedImage} />

      <LocationPicker onPickLocation={pickLocation} location={pickedLocation} />

      <Button onPress={savePlace}>Add Place</Button>
    </ScrollView>
  );
}

export default PlaceForm;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    padding: 24,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.primary500,
  },
  input: {
    marginVertical: 8,
    paddingHorizontal: 4,
    paddingVertical: 8,
    fontSize: 16,
    borderBottomColor: Colors.primary700,
    borderWidth: 2,
    backgroundColor: Colors.primary100,
  },
});
