import { useEffect, useState } from 'react';
import {
  Alert,
  AppState,
  Button,
  Image,
  Linking,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
} from 'expo-image-picker';
import { Colors } from '../../constants/colors';

function ImagePicker() {
  const [cameraPermissionsInfo, requestPermission] = useCameraPermissions();
  const [pickedImage, setPickedImage] = useState();

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (state) => {
      if (state === 'active') {
        await requestPermission();
      }
    });

    return () => subscription.remove();
  }, []);

  const verifyPermissions = async () => {
    if (!cameraPermissionsInfo) return false;

    if (cameraPermissionsInfo.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    if (cameraPermissionsInfo.status === PermissionStatus.DENIED) {
      Alert.alert(
        'Insufficient Permissions!',
        'You need to grant camera permissions to use this app.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ],
      );
      return false;
    }

    return true;
  };

  const takeImage = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) return;
    const image = await launchCameraAsync({
      allowsEditing: true,
      quality: 0.5,
    });

    if (image.canceled) return;

    setPickedImage(image.assets[0]);
  };

  return (
    <View>
      <View style={styles.imagePreview}>
        {pickedImage ? (
          <Image style={styles.image} source={{ uri: pickedImage.uri }} />
        ) : (
          <Text>No image taken yet.</Text>
        )}
      </View>
      <Button title="Take image" onPress={takeImage} />
    </View>
  );
}

export default ImagePicker;

const styles = StyleSheet.create({
  imagePreview: {
    width: '100%',
    height: 200,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary100,
    borderRadius: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
