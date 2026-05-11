export const getAddress = async (lat, lng) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch an address');
  }

  const data = await response.json();
  const address = data.results[0].formatted_address;
  return address;
};
