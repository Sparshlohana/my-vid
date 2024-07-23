import { View, Text, FlatList, Image, RefreshControl, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import Search from '../../components/Search'
import Trending from '../../components/Trending'
import Empty from '../../components/Empty'
import { getAllPosts, getLatestPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/GlobalProvider'

const Home = () => {
    const { data: posts, reFetch } = useAppwrite(getAllPosts)
    const { data: latestPosts } = useAppwrite(getLatestPosts)
    const [refresh, setRefresh] = useState(false)
    const { user, setUser, setIsLoggedIn } = useGlobalContext();

    const onRefresh = async () => {
        setRefresh(true);
        await reFetch();
        setRefresh(false);
    }


    return (
        <SafeAreaView className="bg-primary h-full">
            <FlatList
                data={posts}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => (
                    console.log(item),
                    <VideoCard video={item} />
                )}
                ListHeaderComponent={() => (
                    <View className="my-6 px-4 space-y-6">
                        <View className="my-6 px-4 space-y-6">
                            <View className="justify-between items-start flex-row mb-6">
                                <View>
                                    <Text className="font-pmedium text-sm text-gray-100">Welcome Back</Text>
                                    <Text className="text-2xl text-white font-psemibold">{user?.username}</Text>
                                </View>
                                <View>
                                    <Image source={images.logoSmall} className="w-9 h-10" resizeMode='contain' />
                                </View>
                            </View>
                        </View>
                        <Search />
                        <View className="w-full flex-1 pt-5 pb-8">
                            <Text className="text-gray-100 ">Latest Videos</Text>
                            <Trending posts={latestPosts} />
                        </View>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <Empty
                        title="No Videos Found"
                        subtitle="Be the first to upload a video!"
                    />
                )}
                refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
            />
        </SafeAreaView>
    )
}

export default Home