import { useLocalSearchParams } from 'expo-router'
import React, { useEffect } from 'react'
import { FlatList, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Empty from '../../components/Empty'
import SearchInput from '../../components/Search'
import VideoCard from '../../components/VideoCard'
import { searchPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'

const Profile = () => {
    const { query } = useLocalSearchParams()
    const { data: posts, reFetch } = useAppwrite(() => searchPosts(query));

    useEffect(() => {
        reFetch()
    }, [query])

    return (
        <SafeAreaView className="bg-primary h-full">
            <FlatList
                data={posts}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => (
                    <VideoCard video={item} />
                )}
                ListHeaderComponent={() => (
                    <View className="my-6 px-4 ">
                        <View className="items-start flex-col mb-6">
                            <Text className="font-pmedium text-sm text-gray-100"> Search Results</Text>
                            <Text className="text-2xl text-white font-psemibold">{query}</Text>
                        </View>
                        <View className="mt-6 mb-8">
                            <SearchInput initialQuery={query} />
                        </View>
                        <View className="w-full flex-1 pt-5 pb-8">
                            <Text className="text-gray-100 ">Latest Videos</Text>
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