import React from 'react'
import { FlatList, Image, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Empty from '../../components/Empty'
import InfoBox from '../../components/InfoBox'
import VideoCard from '../../components/VideoCard'
import { icons } from '../../constants'
import { useGlobalContext } from '../../context/GlobalProvider'
import { getUserPost, signOut } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import { router } from 'expo-router'

const Profile = () => {
    const { user, setUser, setIsLoggedIn } = useGlobalContext();
    const { data: posts, } = useAppwrite(() => getUserPost(user?.$id));

    const logout = async () => {
        await signOut();
        setUser(null);
        setIsLoggedIn(false);
        router.replace('/sign-in')
    }

    return (
        <SafeAreaView className="bg-primary h-full">
            <FlatList
                data={posts}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => (
                    <VideoCard video={item} />
                )}
                ListHeaderComponent={() => (
                    <View className="w-full justify-center items-center mt-6 mb-12 px-4">
                        <TouchableOpacity className="w-full items-end mb-10" onPress={() => logout()}>
                            <Image source={icons.logout} resizeMethod='contain' className="w-6 h-6" />
                        </TouchableOpacity>
                        <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
                            <Image source={{ uri: user?.avatar }} className="w-[90%] h-[90%] rounded-lg" resizeMode='cover' />
                        </View>
                        <InfoBox title={user?.username} containerStyles="mt-5" titleStyle="text-lg" />

                        <View className="mt-3 flex-row">
                            <InfoBox title={posts?.length || 0} subtitle="Posts" containerStyles="mr-10" titleStyle="text-xl" />
                            <InfoBox title="1.2k" subtitle="Followers" titleStyle="text-lg" />
                        </View>

                    </View>

                )}
                ListEmptyComponent={() => (
                    <Empty
                        title="No Videos Found"
                        subtitle="No Videos found for the search query"
                    />
                )}
            />
        </SafeAreaView>
    )
}

export default Profile