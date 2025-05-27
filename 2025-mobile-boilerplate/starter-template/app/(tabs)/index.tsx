import { Image } from 'expo-image';
import { Platform,StyleSheet, View, Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className='flex-1 bg-red-200'>
      <View>
        <Text className='pt-10 text-red-500 text-3xl'>Hello</Text>
      </View>
    </SafeAreaView>
  );
}

