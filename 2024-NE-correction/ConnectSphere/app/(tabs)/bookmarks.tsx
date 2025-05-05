import { View, Text, SafeAreaView, Image, ActivityIndicator, FlatList } from 'react-native'
import React from 'react'
import useBookmarks from '@/hooks/useBookmarks';
import { useRecoilValue } from 'recoil';
import { usernameState } from '@/store';
import { Ionicons } from '@expo/vector-icons';
import PostComponent from '@/components/Post';

const Bookmarks = () => {
  const { bookmarks, removeBookmark, fetchingBookmarks } = useBookmarks();
  const username = useRecoilValue(usernameState)
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className="px-4 pt-3 pb-2 border-gray-100 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Ionicons name="newspaper" size={24} color="#3B82F6" />
          <Text className="text-xl font-bold ml-2 text-gray-800">Feed</Text>
        </View>
        {username && (
          <View className="flex-row items-center bg-blue-50 px-3 py-1 rounded-full">
            <Ionicons name="person-circle-outline" size={16} color="#3B82F6"  />
            <Text className="text-sm font-medium text-blue-600 ml-1">{username}</Text>
          </View>
        )}
      </View>

      {fetchingBookmarks ? (
        <View className="h-full justify-center items-center">
          <ActivityIndicator size={"large"} color="blue" />
        </View>
      ) : (
        <FlatList
          data={bookmarks}
        //   refreshControl={
        //     <RefreshControl
        //         refreshing={refreshing}
        //         onRefresh={onRefresh}
        //         colors={["#3B82F6"]}
        //         tintColor="#3B82F6"
        //     />
        // }
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center py-16 bg-gray-50 rounded-xl">
                <Image
                    source={require("../../assets/images/no-data.png")}
                    style={{ width: 180, height: 180 }}
                    className="rounded-lg"
                />
                <Text className="text-gray-700 pt-4 text-lg font-medium">No Bookmarks available</Text>
                <Text className="text-gray-500 pt-1 text-sm">Pull down to refresh</Text>
            </View>
        )}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <PostComponent
              isBookmarked={
                bookmarks.find((bookmark) => bookmark.id === item.id)
                  ? true
                  : false
              }
              onBookmark={() => removeBookmark(item.id)}
              {...item}
            />
            </View>
          )}

          ListFooterComponent={() => (bookmarks && bookmarks.length > 0) ? (
            <View className="py-4 items-center">
              <Text className="text-gray-400 text-sm">You've reached the end</Text>
            </View>
          ) : null}
          
        />
      )}
    </SafeAreaView>
  )
}

export default Bookmarks