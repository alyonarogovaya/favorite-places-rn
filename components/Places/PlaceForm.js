import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from 'react-native';

import ImagePicker from './ImagePicker';
import LocationPicker from './LocationPicker';
import Button from '../UI/Button';
import { Colors } from '../../constants/colors';
import { Place } from '../../models/place';

function PlaceForm({ onCreatePlace, initialData, initialLocation }) {
  const [enteredTitle, setEnteredTitle] = useState(
    initialData?.enteredTitle ?? '',
  );
  const [pickedLocation, setPickedLocation] = useState(initialLocation);
  const [selectedImage, setSelectedImage] = useState(
    initialData?.selectedImage,
  );

  const changeTitle = (enteredText) => {
    setEnteredTitle(enteredText);
  };

  const takeImage = (image) => {
    setSelectedImage(image);
  };

  useEffect(() => {
    if (initialData?.enteredTitle) {
      setEnteredTitle(initialData.enteredTitle);
    }
    if (initialData?.selectedImage) {
      setSelectedImage(initialData.selectedImage);
    }
  }, [initialData?.enteredTitle, initialData?.selectedImage]);

  useEffect(() => {
    setPickedLocation(initialLocation);
  }, [initialLocation]);

  const pickLocation = (location) => {
    setPickedLocation(location);
  };

  const savePlace = () => {
    if (!pickedLocation) {
      Alert.alert('Missing Location', 'Please pick a location before saving.');
      return;
    }
    if (!selectedImage) {
      Alert.alert('Missing Image', 'Please take an image before saving.');
      return;
    }
    if (!enteredTitle.trim()) {
      Alert.alert('Missing Title', 'Please enter a title before saving.');
      return;
    }
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

      <LocationPicker
        onPickLocation={pickLocation}
        location={pickedLocation}
        enteredData={{ selectedImage, enteredTitle }}
      />

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
