import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

function MapPreview({ latitude, longitude }) {
  const imageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=600x300&markers=color:red%7C${latitude},${longitude}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`;

  return <Image source={{ uri: imageUrl }} style={styles.image} />;
}

export default MapPreview;

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 200,
  },
});
