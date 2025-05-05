import CustomButton from '@/components/CustomButton';
import usePosts from '@/hooks/usePosts';
import axios from '@/lib/axios.config';
import { Post } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, usePathname, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View, Image } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToast } from 'react-native-toast-notifications';

const PostView = () => {
    const router = useRouter();
    const { deletePost, deletingPost } = usePosts();
    const pathname = usePathname();
    const toast = useToast();
    const navigation = useNavigation();

    const [post, setPost] = useState<Post | null>(null);
    const [fetchingPost, setFetchingPost] = useState<boolean>(true);
    const postId = useMemo(() => {
        return pathname.split('/')[2];
    }, [pathname]);

    async function getPostData() {
        if(!postId) return;
        setFetchingPost(true);

        try {
            const postsRes = await axios.get(`/posts/${postId}`);
            const commentsRes = await axios.get(`/posts/${postId}/comments`);

            setPost({
                ...postsRes.data,
                comments: commentsRes.data
            });

        } catch (error) {
            console.log(error);
            toast.show("An error occurred while fetching post data", {
                type: 'danger'
            });
        } finally {
            setFetchingPost(false);
        }
    }

    useEffect(() => {
        getPostData();
    }, [postId]);


    const getInitials = (email: string) => {
        if (!email) return '??';
        const name = email.split('@')[0];
        return name.substring(0, 2).toUpperCase();
    };


    const getAvatarColor = (email: string) => {
        if (!email) return '#e0e0e0';
        const colors = [
            '#FFD6A5', '#CAFFBF', '#9BF6FF', '#BDB2FF', '#FFC6FF',
            '#FDFFB6', '#A0C4FF', '#FFADAD', '#E7C6FF', '#C1FFD7'
        ];
        const hash = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {fetchingPost ? (
                <View className="flex-1 justify-center items-center h-screen py-12">
                    <ActivityIndicator size="large" color="#3B82F6" />
                    <Text className="mt-4 text-gray-600 font-medium">Loading post...</Text>
                </View>
            ) : post && (
                <>
                    <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100">
                        <TouchableOpacity
                            onPress={() => router.push('/posts')}
                            className="flex-row items-center space-x-1"
                        >
                            <Ionicons name="arrow-back" size={22} color="#3B82F6" />
                            <Text className="text-base font-medium text-blue-500">Back</Text>
                        </TouchableOpacity>
                        
                        <CustomButton
                            isLoading={deletingPost}
                            handlePress={() => deletePost(post?.id!)}
                            title="Delete Post"
                            variant="outline"
                            titleStyles="text-red-600 font-medium"
                            containerStyles="border-red-500 px-4 py-2 w-32 rounded-lg"
                        />
                    </View>

                    <FlatList
                        className="flex-1"
                        data={post?.comments}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={{ padding: 16 }}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={() => (
                            <View className="mb-6">
                                <View className="bg-blue-50 p-5 rounded-xl mb-6 shadow-sm">
                                    <Text className="text-2xl font-bold text-gray-800 mb-3">{post?.title}</Text>
                                    <Text className="text-base text-gray-700 leading-relaxed">{post?.body}</Text>
                                    <View className="flex-row mt-4 items-center">
                                        <View className="h-6 w-6 rounded-full bg-blue-100 items-center justify-center">
                                            <Ionicons name="person" size={14} color="#3B82F6" />
                                        </View>
                                        <Text className="ml-2 text-xs text-gray-500">User #{post?.userId}</Text>
                                        <View className="h-1 w-1 bg-gray-300 rounded-full mx-2" />
                                        <Ionicons name="time-outline" size={12} color="#6B7280" />
                                        <Text className="ml-1 text-xs text-gray-500">Just now</Text>
                                    </View>
                                </View>
                                
                                <Text className="text-xl font-bold text-gray-800 mb-4 flex-row items-center">
                                    Comments <Text className="text-blue-500">({post?.comments?.length})</Text>
                                </Text>
                            </View>
                        )}
                        renderItem={({ item }) => (
                            <View className="mb-4 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                                <View className="flex-row items-center mb-2">
                                    <View 
                                        style={{ backgroundColor: getAvatarColor(item.email) }}
                                        className="w-8 h-8 rounded-full items-center justify-center mr-3"
                                    >
                                        <Text className="font-bold text-xs">{getInitials(item.email)}</Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-sm font-bold text-gray-800">{item.name}</Text>
                                        <Text className="text-xs text-gray-500">{item.email}</Text>
                                    </View>
                                </View>
                                <Text className="text-base text-gray-700">{item.body}</Text>
                            </View>
                        )}
                        ListEmptyComponent={() => (
                            <View className="items-center py-8">
                                <Ionicons name="chatbubble-ellipses-outline" size={48} color="#D1D5DB" />
                                <Text className="text-gray-400 mt-2">No comments yet</Text>
                            </View>
                        )}
                    />
                </>
            )}
        </SafeAreaView>
    );
};

export default PostView;