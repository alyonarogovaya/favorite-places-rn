import { Alert, AppState, StyleSheet, Text, View, Linking } from 'react-native';
import { useEffect } from 'react';
import OutlinedButton from '../UI/OutlinedButton';
import { Colors } from '../../constants/colors';
import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
} from 'expo-location';
import MapPreview from './MapPreview';
import { useNavigation } from '@react-navigation/native';
import { getAddress } from '../../utils/location';

function LocationPicker({ onPickLocation, location }) {
  const [locationPermissionInfo, requestPermission] =
    useForegroundPermissions();

  const navigation = useNavigation();

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (state) => {
      if (state === 'active') {
        await requestPermission();
      }
    });
    return () => subscription.remove();
  }, []);

  const handlePickedLocation = async (coords) => {
    const address = await getAddress(coords.latitude, coords.longitude);
    onPickLocation({ ...coords, address });
  };

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
    if (!hasPermission) return;

    const location = await getCurrentPositionAsync();
    handlePickedLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  const pickOnMap = () => {
    navigation.navigate('Map', {
      // Pass a callback — MapScreen calls this and goes back
      onLocationPicked: (pickedLocation) => {
        handlePickedLocation({
          latitude: pickedLocation.lat,
          longitude: pickedLocation.lng,
        });
      },
    });
  };

  return (
    <View>
      <View style={styles.mapPreview}>
        {location ? (
          <MapPreview
            latitude={location.latitude}
            longitude={location.longitude}
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
