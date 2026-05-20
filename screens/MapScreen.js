import { useCallback, useLayoutEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import IconButton from '../components/UI/IconButton';
import { getAddress } from '../utils/location';

function MapScreen({ navigation, route }) {
  const initialLocation = route.params.initialLocation && {
    lat:
      route.params.initialLocation.latitude ?? route.params.initialLocation.lat,
    lng:
      route.params.initialLocation.longitude ??
      route.params.initialLocation.lng,
  };
  const viewOnly = route.params?.viewOnly;
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  const region = {
    latitude: initialLocation?.lat ?? 37.78,
    longitude: initialLocation?.lng ?? -122.34,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const selectLocation = (e) => {
    if (viewOnly) return;

    const lat = e.nativeEvent.coordinate.latitude;
    const lng = e.nativeEvent.coordinate.longitude;

    setSelectedLocation({ lat, lng });
  };

  const savePickedLocation = useCallback(async () => {
    if (!selectedLocation) {
      Alert.alert('No location picked', 'Tap on the map first');
      return;
    }

    let pickedLocation;
    try {
      const address = await getAddress(
        selectedLocation.lat,
        selectedLocation.lng,
      );
      pickedLocation = {
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        address,
      };
    } catch (error) {
      Alert.alert('Could not get address', 'Please try again later.');
      return;
    }

    const enteredData = route.params?.enteredData;
    navigation.navigate({
      name: route.params?.returnScreen ?? 'Add place',
      params: { pickedLocation, enteredData },
      merge: true,
    });
  }, [navigation, selectedLocation, route.params]);

  useLayoutEffect(() => {
    if (viewOnly) return;

    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <IconButton
          color={tintColor}
          icon="save"
          size={24}
          onPress={savePickedLocation}
        />
      ),
    });
  }, [navigation, savePickedLocation, viewOnly]);

  return (
    <MapView style={styles.map} initialRegion={region} onPress={selectLocation}>
      {selectedLocation && (
        <Marker
          title="Picked location"
          coordinate={{
            latitude: selectedLocation.lat,
            longitude: selectedLocation.lng,
          }}
        />
      )}
    </MapView>
  );
}

export default MapScreen;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
