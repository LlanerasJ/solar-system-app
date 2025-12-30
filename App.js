import React from 'react';
import { StatusBar, View } from 'react-native';
import SolarSystemCanvas from './src/components/SolarSystemCanvas';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <StatusBar barStyle="light-content" />
      <View style={{ flex: 1 }}>
        <SolarSystemCanvas />
      </View>
    </SafeAreaView>
  );
}
