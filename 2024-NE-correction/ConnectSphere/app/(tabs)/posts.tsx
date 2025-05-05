import { View, Text, ActivityIndicator, Image, RefreshControl } from "react-native";
import React, { useState } from "react";
import usePosts from "@/hooks/usePosts";
import { useRecoilValue } from "recoil";
import useBookmarks from "@/hooks/useBookmarks";
import { usernameState } from "@/store";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList } from "react-native-gesture-handler";
import PostComponent from "@/components/Post";
import { Ionicons } from "@expo/vector-icons";

const Posts = () => {
  const { posts, fetchingPosts } = usePosts();
  const username = useRecoilValue(usernameState);
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();
  const [refreshing, setRefreshing] = useState(false);

  // const onRefresh = async () => {
  //     setRefreshing(true);
  //     // await fetchPosts?.();
  //     setRefreshing(false);
  // }

  return (
    <SafeAreaView className="flex-1 bg-white">
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
      {fetchingPosts ? (
        <View className="h-full justify-center items-center">
          <ActivityIndicator size={"large"} color="blue" />
        </View>
      ) : (
        <FlatList
          data={posts}
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
                <Text className="text-gray-700 pt-4 text-lg font-medium">No posts available</Text>
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
              onBookmark={() => {
                if (bookmarks.find((bookmark) => bookmark.id === item.id)) {
                  removeBookmark(item.id);
                } else {
                  addBookmark(item);
                }
              }}
              {...item}
            />
            </View>
          )}

          ListFooterComponent={() => (posts && posts.length > 0) ? (
            <View className="py-4 items-center">
              <Text className="text-gray-400 text-sm">You've reached the end</Text>
            </View>
          ) : null}
          
        />
      )}
    </SafeAreaView>
  );
};

export default Posts;
