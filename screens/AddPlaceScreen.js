import PlaceForm from '../components/Places/PlaceForm';
import { insertPlace } from '../utils/database';

function AddPlaceScreen({ navigation }) {
  const createPlace = async (place) => {
    try {
      await insertPlace(place);
    } catch (err) {
      console.error(err);
    }
    navigation.navigate('All places');
  };

  return <PlaceForm onCreatePlace={createPlace} />;
}

export default AddPlaceScreen;
