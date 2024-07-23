import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { createUser } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'

const SignUp = () => {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: ''
    })
    const { setUser, setIsLoggedIn } = useGlobalContext();
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async () => {
        if (!form.email || !form.password || !form.username) {
            Alert.alert('Error', 'Please fill all the fields')
            return
        }
        setIsLoading(true)

        try {
            const response = await createUser(form.email, form.password, form.username)

            setUser(response)
            setIsLoggedIn(true)
            router.push('/home')

        } catch (error) {
            Alert.alert('Error', error.message)
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <SafeAreaView className="bg-primary h-full" >
            <ScrollView>
                <View className="w-full justify-center h-[85vh] px-4 my-6" >
                    <Image source={images.logo} resizeMode='contain' className="w-[113px] h-[35px]" />
                    <Text className="text-3xl text-white text-semibold font-psemibold mt-10" >Register to My-Vid</Text>

                    <FormField
                        title="Username"
                        value={form.username}
                        handleChangeText={(value) => setForm({ ...form, username: value })}
                        otherStyles="mt-7"
                        keyBoardType="userName"
                    />
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
                        title={"Sign Up"}
                        containerStyles={"mt-7"}
                        handlePress={handleSubmit}
                        isLoading={isLoading}
                    />

                    <View className="justify-center pt-5 flex-row gap-2">
                        <Text className="text-lg text-gray-100">Already have Account</Text>
                        <Link className='text-lg font-psemibold text-secondary' href={"/sign-in"}>Sign In</Link>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default SignUp