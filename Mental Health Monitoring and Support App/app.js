// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import MoodTrackerScreen from './screens/MoodTrackerScreen';
import JournalScreen from './screens/JournalScreen';
import ExercisesScreen from './screens/ExercisesScreen';
import ResourcesScreen from './screens/ResourcesScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Mood Tracker" component={MoodTrackerScreen} />
        <Stack.Screen name="Journal" component={JournalScreen} />
        <Stack.Screen name="Exercises" component={ExercisesScreen} />
        <Stack.Screen name="Resources" component={ResourcesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
