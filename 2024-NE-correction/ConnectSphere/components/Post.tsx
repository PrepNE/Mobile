import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import usePosts from '@/hooks/usePosts'
import { Post } from '@/types';
import { useRecoilValue } from 'recoil';
import { usernameState } from '@/store';
import { useRouter } from 'expo-router';
import CustomButton from './CustomButton';
import { Ionicons } from '@expo/vector-icons';


interface PostComponentProps extends Post {
  isBookmarked: boolean;
  onBookmark: () => void;
}

const PostComponent =  ({ isBookmarked , onBookmark, ...item}: PostComponentProps) => {
  const router = useRouter();
  return (
    <View className='p-4 rounded-lg mb-4 border border-gray-200 shadow-sm bg-white'>
      <Text className='text-lg font-bold text-gray-800 mb-2'>{item.title}</Text>
      <Text className='text-base text-gray-600 leading-relaxed mb-4'>{item.body}</Text>

      {!item.isCustom && <View className='flex flex-row items-center justify-between mt-2'> 
         <CustomButton 
           handlePress={() => router.push(`/posts/${item.id}`)}
           title='Open Post'
           containerStyles='w-[80%] rounded-lg bg-blue-500'
           variant='primary'
           titleStyles='text-base font-medium text-white'
         />
        <TouchableOpacity 
          onPress={onBookmark}
          className='h-10 w-10 items-center justify-center rounded-full bg-gray-100'
        >
          <Ionicons
           name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
           size={22}
           color={isBookmarked ? 'violet' : 'gray'}
          />
        </TouchableOpacity>
        </View>
        }

        {item.isCustom && 
          <View className='mt-2 py-2 px-3 bg-violet-50 rounded-lg self-start'>
            <Text className='font-semibold text-violet-700'>Added By You</Text>
          </View>
        }
    </View>
  )
}

export default PostComponent