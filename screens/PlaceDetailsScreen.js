import { Image, ScrollView, StyleSheet, View, Text, Alert } from 'react-native';
import OutlinedButton from '../components/UI/OutlinedButton';
import { Colors } from '../constants/colors';
import { useEffect, useState } from 'react';
import { deletePlace, fetchPlaceDetails } from '../utils/database';
import { useNavigation } from '@react-navigation/native';
import IconButton from '../components/UI/IconButton';

function PlaceDetailsScreen({ route }) {
  const [selectedPlace, setSelectedPlace] = useState();
  const navigation = useNavigation();

  const placeId = route.params.placeId;

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
  }, [placeId, navigation]);

  const showOnMap = () => {
    navigation.navigate('Map', {
      initialLocation: {
        lat: selectedPlace.lat,
        lng: selectedPlace.lng,
      },
      viewOnly: true,
    });
  };

  const deleteSelectedPlace = () => {
    Alert.alert('Delete place', 'Are you sure you want to delete this place?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletePlace(selectedPlace.id);

            navigation.goBack();
          } catch (err) {
            console.error(err);
          }
        },
      },
    ]);
  };

  if (!selectedPlace) {
    return (
      <View style={styles.fallback}>
        <Text>Loading place data...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image source={{ uri: selectedPlace.imageUri }} style={styles.image} />
        <View style={styles.locationContainer}>
          <View style={styles.addressContainer}>
            <Text style={styles.address}>{selectedPlace.address}</Text>
          </View>
          <OutlinedButton icon="map" onPress={showOnMap}>
            View on map
          </OutlinedButton>
        </View>
        <View style={styles.actionsContainer}>
          <IconButton
            icon="trash"
            size={24}
            color={Colors.error800}
            buttonStyles={styles.iconButton}
            onPress={deleteSelectedPlace}
          />
        </View>
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
  container: {
    justifyContent: 'space-between',
    gap: 24,
  },
  actionsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    display: 'flex',
    width: 50,
    padding: 12,
    backgroundColor: Colors.error400,
  },
});
