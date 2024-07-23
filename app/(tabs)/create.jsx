import { ResizeMode, Video } from 'expo-av'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Image, ScrollView, Text, TouchableOpacity, View, } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import FormField from '../../components/FormField'
import { icons } from '../../constants'
import { useGlobalContext } from '../../context/GlobalProvider'
import { createVideo } from '../../lib/appwrite'
import * as ImagePicker from 'expo-image-picker'

const Create = () => {
    const [formData, setFormData] = useState({
        title: '',
        video: null,
        thumbnail: null,
        prompt: '',
    })
    const [uploading, setUploading] = useState(false)
    const { user } = useGlobalContext();

    const openPicker = async (type) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: type === 'image' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result?.canceled) {
            if (type === "image") {
                setFormData({ ...formData, thumbnail: result.assets[0] })
            } else {
                setFormData({ ...formData, video: result.assets[0] })
            }
        }
    };

    const uploadVideo = async () => {
        if (!formData?.title || !formData?.video || !formData?.thumbnail || !formData?.prompt) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        } else {
            setUploading(true);
            try {
                await createVideo({
                    ...formData, userId: user.$id
                });

                Alert.alert('Success', "Post uploaded successfully")
                router.push('/home');
            } catch (error) {
                Alert.alert('Error', error.message);
            } finally {
                setFormData({
                    title: '',
                    video: null,
                    thumbnail: null,
                    prompt: '',
                })
                setUploading(false);
            }
        }
    };

    return (
        <SafeAreaView className="h-full bg-primary">
            <ScrollView className="px-4 my-6">
                <Text className="text-white text-2xl font-psemibold">
                    Upload Video
                </Text>

                <FormField title={"Video Title"} value={formData?.title} placeholder={"Give your Video a Catchy Title"} handleChangeText={(e) => {
                    setFormData({ ...formData, title: e })
                }} otherStyles={"mt-10"} />

                <View className="mt-7 space-y-7">
                    <Text className="text-base text-gray-100 font-pmedium">
                        Upload Video
                    </Text>
                    <TouchableOpacity onPress={() => {
                        openPicker('video');
                    }}>
                        {formData?.video ? (
                            <Video source={{ uri: formData?.video?.uri }} className="w-full h-64 rounded-2xl" resizeMode={ResizeMode.COVER} isLooping shouldPlay />
                        ) : (
                            <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                                    <Image source={icons.upload} resizeMode='contain' className="w-1/2 h-1/2" />
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>

                    <View className="mt-7 space-y-2">
                        <Text className="text-base text-gray-100 font-pmedium">
                            Upload Thumbnail
                        </Text>
                        <TouchableOpacity onPress={() => {
                            openPicker('image');
                        }}>
                            {formData?.thumbnail ? (
                                <Image source={{ uri: formData?.thumbnail?.uri }} resizeMode='cover' className="w-full h-64 rounded-2xl" />
                            ) : (
                                <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                                    <Image source={icons.upload} resizeMode='contain' className="w-5 h-5" />
                                    <Text className="text-sm text-gray-100 font-pmedium">Choose a file</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    <FormField title={"AI Prompt"} value={formData?.prompt} placeholder={"The Prompt you used to create this Video"} handleChangeText={(e) => {
                        setFormData({ ...formData, prompt: e })
                    }} otherStyles={"mt-7"} />

                    <CustomButton title={"Submit & Publish"} containerStyles={"mt-7"} isLoading={uploading} handlePress={uploadVideo} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Create;