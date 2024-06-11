import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function TabLayout() {

  return (
    <View className="flex flex-1 justify-center items-center">
      <Text className="text-3xl font-pblack">My Vid!</Text>
      <StatusBar style='auto' />
      <Link href={"/profile"} style={{ color: "blue" }}>Go to Profile</Link>
    </View>
  );
}
