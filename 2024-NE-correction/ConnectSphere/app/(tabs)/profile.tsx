import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import CustomButton from '@/components/CustomButton'
import { useRecoilState, useRecoilValue } from 'recoil'
import { bookmarksState, usernameState } from '@/store'
import useBookmarks from '@/hooks/useBookmarks'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Profile = () => {
  const [username, setUsername] = useRecoilState(usernameState);
  const [bookmarks, setBookmarks] = useRecoilState(bookmarksState)
  const router = useRouter();
  
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='px-6 py-8'>
        <Text className='text-2xl font-bold text-gray-800'>Profile</Text>
      </View>
      
      <View className='flex-1 px-6 items-center justify-center'>
        <View className='w-28 h-28 rounded-full bg-violet-100 items-center justify-center mb-4'>
          <Ionicons 
            name='person-circle-outline'
            size={70}
            color='#8A2BE2'
          />
        </View>
        
        <Text className='text-center text-2xl font-bold text-gray-800 mt-2'>{username}</Text>
        
        <View className='flex-row items-center mt-3 bg-violet-50 px-4 py-2 rounded-full'>
          <Ionicons name="bookmark" size={18} color="#8A2BE2" />
          <Text className='text-center text-violet-800 font-medium ml-2'>{bookmarks.length} bookmarks</Text>
        </View>
        
        <View className='w-full mt-12 border-t border-gray-100 pt-8'>
          <CustomButton
            handlePress={async () => {
              await AsyncStorage.removeItem('bookmarks');
              setBookmarks([]);
              setUsername('');
              router.push("/");
            }}
            title='Logout'
            containerStyles='border-red-500 rounded-lg'
            variant='outline'
            titleStyles='text-red-500 font-medium'
          />
        </View>
      </View>
      
      <View className='px-6 py-4 items-center'>
        <Text className='text-xs text-gray-400'>App Version 1.0.0</Text>
      </View>
    </SafeAreaView>
  )
}

export default Profile