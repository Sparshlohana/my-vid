import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';
import CustomButton from '../components/CustomButton';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

export default function TabLayout() {

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full items-center justify-center min-h-[85vh] px-4">
          <Image source={images.logo} className="w-[130px] h-[84px]" resizeMode='contain' />
          <Image source={images.cards} className="max-w-[380px] w-full h-[300px]" resizeMode='contain' />
          <View className="relative mt-5" >
            <Text className="text-3xl text-white font-bold text-center" >Discover Endless Possibilities with {" "}
              <Text className="text-secondary-200 " >My Vid</Text>
            </Text>
            <Image source={images.path} className="w-[180px] h-[17px] absolute -right-10 -bottom-3" resizeMode='contain' />
          </View>
          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center" >Where creativity meets innovation: embark on the journey of limitless exploration with My Vid</Text>
          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push('/sign-in')}
            containerStyles={"mt-7 w-full"}
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor='#161622' style="light" />
    </SafeAreaView>
  );
}
