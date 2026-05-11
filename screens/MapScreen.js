import { useCallback, useLayoutEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import IconButton from '../components/UI/IconButton';

function MapScreen({ navigation, route }) {
  const [selectedLocation, setSelectedLocation] = useState();

  const region = {
    latitude: 37.78,
    longitude: -122.34,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const selectLocation = (e) => {
    const lat = e.nativeEvent.coordinate.latitude;
    const lng = e.nativeEvent.coordinate.longitude;

    setSelectedLocation({ lat, lng });
  };

  const savePickedLocation = useCallback(() => {
    if (!selectedLocation) {
      Alert.alert(
        'No location picked',
        'You have to pick a location by tapping on the map first',
      );
      return;
    }

    if (route.params?.onLocationPicked) {
      route.params.onLocationPicked(selectedLocation);
    }
    navigation.goBack();
  }, [navigation, selectedLocation, route.params]);

  useLayoutEffect(() => {
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
  }, [navigation, savePickedLocation]);

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
