import PlaceForm from '../components/Places/PlaceForm';
import { insertPlace } from '../utils/database';

function AddPlaceScreen({ navigation }) {
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

  return <PlaceForm onCreatePlace={createPlace} />;
}

export default AddPlaceScreen;
