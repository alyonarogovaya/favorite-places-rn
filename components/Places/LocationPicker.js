import { Alert, AppState, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import OutlinedButton from '../UI/OutlinedButton';
import { Colors } from '../../constants/colors';
import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
} from 'expo-location';
import { LatLng, LeafletView } from 'react-native-leaflet-view';
import MapPreview from './MapPreview';
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from '@react-navigation/native';

function LocationPicker() {
  const [locationPermissionInfo, requestPermission] =
    useForegroundPermissions();
  const [pickedLocation, setPickedLocation] = useState();

  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (state) => {
      if (state === 'active') {
        await requestPermission();
      }
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (isFocused && route.params) {
      const mapPickedLocation = {
        latitude: route.params.pickedLocation.lat,
        longitude: route.params.pickedLocation.lng,
      };

      setPickedLocation(mapPickedLocation);
    }
  }, [route, isFocused]);

  const verifyPermission = async () => {
    if (!locationPermissionInfo) return false;

    if (locationPermissionInfo.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    if (locationPermissionInfo.status === PermissionStatus.DENIED) {
      Alert.alert(
        'Insufficient Permissions!',
        'You need to grant location permissions to use this app.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ],
      );
      return false;
    }

    return true;
  };

  const getLocation = async () => {
    const hasPermission = await verifyPermission();

    if (!hasPermission) {
      return;
    }

    const location = await getCurrentPositionAsync();
    setPickedLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  const pickOnMap = () => {
    navigation.navigate('Map');
  };

  return (
    <View>
      <View style={styles.mapPreview}>
        {pickedLocation ? (
          <MapPreview
            latitude={pickedLocation.latitude}
            longitude={pickedLocation.longitude}
          />
        ) : (
          <Text>No location taken yet.</Text>
        )}
      </View>
      <View style={styles.actions}>
        <OutlinedButton icon="location" onPress={getLocation}>
          Locate user
        </OutlinedButton>
        <OutlinedButton icon="map" onPress={pickOnMap}>
          Pick on Map
        </OutlinedButton>
      </View>
    </View>
  );
}

export default LocationPicker;

const styles = StyleSheet.create({
  mapPreview: {
    width: '100%',
    height: 200,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    overflow: 'hidden',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
