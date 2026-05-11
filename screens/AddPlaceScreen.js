import PlaceForm from '../components/Places/PlaceForm';

function AddPlaceScreen({ navigation }) {
  const createPlace = (place) => {
    navigation.navigate('All places', {
      place,
    });
  };

  return <PlaceForm onCreatePlace={createPlace} />;
}

export default AddPlaceScreen;
