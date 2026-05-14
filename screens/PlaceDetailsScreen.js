import { Image, ScrollView, StyleSheet, View, Text } from 'react-native';
import OutlinedButton from '../components/UI/OutlinedButton';
import { Colors } from '../constants/colors';
import { useEffect, useState } from 'react';
import { fetchPlaceDetails } from '../utils/database';
import { useNavigation } from '@react-navigation/native';

function PlaceDetailsScreen({ route }) {
  const [selectedPlace, setSelectedPlace] = useState();
  const navigation = useNavigation();

  const placeId = route.params.placeId;
  const showOnMap = () => {
    navigation.navigate('Map', {
      initialLat: selectedPlace.lat,
      initialLng: selectedPlace.lng,
    });
  };

  useEffect(() => {
    async function loadPlace() {
      try {
        const place = await fetchPlaceDetails(placeId);
        setSelectedPlace(place);
        navigation.setOptions({
          title: place.title,
        });
      } catch (err) {
        console.error(err);
      }
    }
    loadPlace();
  }, [placeId]);

  if (!selectedPlace) {
    return (
      <View style={styles.fallback}>
        <Text>Loading place data...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <Image source={{ uri: selectedPlace.imageUri }} style={styles.image} />
      <View style={styles.locationContainer}>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>{selectedPlace.address}</Text>
        </View>
        <OutlinedButton icon="map" onPress={showOnMap}>
          View on map
        </OutlinedButton>
      </View>
    </ScrollView>
  );
}

export default PlaceDetailsScreen;

const styles = StyleSheet.create({
  image: {
    height: '35%',
    minHeight: 300,
    width: '100%',
  },
  locationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressContainer: {
    padding: 20,
  },
  address: {
    color: Colors.primary500,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
