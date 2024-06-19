import { View, Text, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link } from 'expo-router'

const SignIn = () => {
    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = () => {

    };

    return (
        <SafeAreaView className="bg-primary h-full" >
            <ScrollView>
                <View className="w-full justify-center h-[85vh] px-4 my-6" >
                    <Image source={images.logo} resizeMode='contain' className="w-[113px] h-[35px]" />
                    <Text className="text-3xl text-white text-semibold font-psemibold mt-10" >Log in to My-Vid</Text>

                    <FormField
                        title="Email"
                        value={form.email}
                        handleChangeText={(value) => setForm({ ...form, email: value })}
                        otherStyles="mt-7"
                        keyBoardType="email-address"
                    />
                    <FormField
                        title="Password"
                        value={form.password}
                        handleChangeText={(value) => setForm({ ...form, password: value })}
                        otherStyles="mt-7"
                    />

                    <CustomButton
                        title={"Sign In"}
                        containerStyles={"mt-7"}
                        handlePress={handleSubmit}
                        isLoading={isLoading}
                    />

                    <View className="justify-center pt-5 flex-row gap-2">
                        <Text className="text-lg text-gray-100">Don't have Account</Text>
                        <Link className='text-lg font-psemibold text-secondary' href={"/sign-up"}>Sign Up</Link>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default SignIn