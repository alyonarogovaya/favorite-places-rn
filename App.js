import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AllPlacesScreen from './screens/AllPlacesScreen';
import AddPlaceScreen from './screens/AddPlaceScreen';
import IconButton from './components/UI/IconButton';
import { Colors } from './constants/colors';
import MapScreen from './screens/MapScreen';
import { useEffect } from 'react';
import { init } from './utils/database';
import * as SplashScreen from 'expo-splash-screen';
import PlaceDetailsScreen from './screens/PlaceDetailsScreen';

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    async function initDatabase() {
      try {
        await init();
      } catch (error) {
        console.log('DB init failed:', error);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    initDatabase();
  }, []);

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: Colors.primary500,
            },
            headerTintColor: Colors.gray700,
            contentStyle: {
              backgroundColor: Colors.gray700,
            },
          }}
        >
          <Stack.Screen
            name="All places"
            component={AllPlacesScreen}
            options={({ navigation }) => ({
              title: 'All places',
              headerRight: ({ tintColor }) => (
                <IconButton
                  icon="add"
                  size={24}
                  color={tintColor}
                  onPress={() => {
                    navigation.navigate('Add place');
                  }}
                />
              ),
            })}
          />
          <Stack.Screen
            name="Add place"
            component={AddPlaceScreen}
            options={{
              title: 'Add a new place',
            }}
          />
          <Stack.Screen name="Map" component={MapScreen} />
          <Stack.Screen
            name="Place details"
            component={PlaceDetailsScreen}
            options={{
              title: 'Loading place...',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="dark" />
    </>
  );
}
