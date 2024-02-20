import * as React from 'react';
import { Provider, DefaultTheme, Appbar } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  StackHeaderProps,
} from '@react-navigation/stack';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import PlaygroundExample from './screens/PlaygroundExample';
import Home from './screens/Home';
import SimpleExample from './screens/SimpleExample';
import AdvancedExample from './screens/AdvancedExample';
import SwipeableExample from './screens/SwipeableExample';
import { TestPlan } from './screens/TestPlan';

export const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',
  },
};

export type RootStackParamList = {
  Home: undefined;
  TestPlan: undefined;
  SimpleExample: undefined;
  AdvancedExample: undefined;
  SwipeableExample: undefined;
  PlaygroundExample: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function Header({ navigation, route }: StackHeaderProps) {
  const canGoBack = navigation.canGoBack();

  return (
    <Appbar.Header>
      {canGoBack ? (
        <Appbar.BackAction testID="goBack" onPress={navigation.goBack} />
      ) : null}
      <Appbar.Content title={route.name} />
    </Appbar.Header>
  );
}

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <Provider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{ header: (props) => <Header {...props} /> }}
          >
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ title: 'Examples' }}
            />
            <Stack.Screen name="TestPlan" component={TestPlan} />
            <Stack.Screen name="SimpleExample" component={SimpleExample} />
            <Stack.Screen name="AdvancedExample" component={AdvancedExample} />
            <Stack.Screen
              name="SwipeableExample"
              component={SwipeableExample}
            />
            <Stack.Screen
              name="PlaygroundExample"
              component={PlaygroundExample}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </SafeAreaProvider>
  );
}
