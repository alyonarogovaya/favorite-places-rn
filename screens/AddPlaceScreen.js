import { useState, useEffect } from 'react';
import PlaceForm from '../components/Places/PlaceForm';
import { insertPlace } from '../utils/database';

function AddPlaceScreen({ navigation, route }) {
  const [pickedLocation, setPickedLocation] = useState(
    route.params?.pickedLocation,
  );

  const createPlace = async (place) => {
    try {
      await insertPlace(place);
    } catch (err) {
      console.error(err);
    }
    navigation.reset({
      index: 0,
      routes: [{ name: 'All places' }],
    });
  };

  useEffect(() => {
    if (route.params?.pickedLocation) {
      setPickedLocation(route.params.pickedLocation);
    }
  }, [route.params?.pickedLocation]);

  return (
    <PlaceForm
      onCreatePlace={createPlace}
      initialData={route.params?.enteredData}
      initialLocation={pickedLocation}
    />
  );
}

export default AddPlaceScreen;
