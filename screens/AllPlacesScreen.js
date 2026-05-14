import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import PlacesList from '../components/Places/PlacesList';
import { fetchPlaces } from '../utils/database';

function AllPlacesScreen({ route }) {
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    async function loadPlaces() {
      try {
        const places = await fetchPlaces();
        setLoadedPlaces(places);
      } catch (err) {
        console.error(err);
      }
    }

    if (isFocused) {
      loadPlaces();
    }
  }, [isFocused]);

  return <PlacesList places={loadedPlaces} />;
}

export default AllPlacesScreen;
