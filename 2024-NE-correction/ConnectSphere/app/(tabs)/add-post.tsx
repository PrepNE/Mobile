import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import usePosts from "@/hooks/usePosts";
import { usernameState } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, View, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useToast } from "react-native-toast-notifications";
import { useRecoilValue } from "recoil";

const AddPost = () => {
  const toast = useToast();
  const { addPost, addingPost } = usePosts();
  const username = useRecoilValue(usernameState);

  const [formData, setFormData] = useState({
    title: "",
    body: "",
  });

  const handleAddPost = async () => {
    const specialCharStartPattern = /^[!@#\$%\^\&*\)\(+=._-]/;

    if (!formData.title.trim() || !formData.body.trim()) {
      toast.show("Please fill in all fields", {
        type: "danger",
      });
      return;
    }

    if (specialCharStartPattern.test(formData.title.charAt(0))) {
      toast.show("Title cannot start with a special character", {
        type: "danger",
      });
      return;
    }

    if (specialCharStartPattern.test(formData.body.charAt(0))) {
      toast.show("Body cannot start with a special character", {
        type: "danger",
      });
      return;
    }

    const maxTitleLength = 280;
    const maxBodyLength = 480;

    if (formData.title.length > maxTitleLength) {
      toast.show(`Title cannot be longer than ${maxTitleLength} characters`, {
        type: "danger",
      });
      return;
    }

    if (formData.body.length > maxBodyLength) {
      toast.show(`Body cannot be longer than ${maxBodyLength} characters`, {
        type: "danger",
      });
      return;
    }

    addPost(formData);
  };

  const titleCharCount = formData.title.length;
  const bodyCharCount = formData.body.length;
  const maxTitleLength = 280;
  const maxBodyLength = 480;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {/* Header */}
          <View className="px-4 pt-4 pb-3 border-b border-gray-200 bg-white shadow-sm flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Ionicons name="create-outline" size={22} color="#3B82F6" />
              <Text className="text-lg font-semibold ml-2 text-gray-800">New Post</Text>
            </View>
            {username && (
              <View className="flex-row items-center bg-blue-100 px-3 py-1 rounded-full">
                <Ionicons name="person-circle-outline" size={16} color="#2563EB" />
                <Text className="text-sm font-medium text-blue-700 ml-1">{username}</Text>
              </View>
            )}
          </View>

          {/* Content */}
          <View className="p-5 flex-1">
            <View className="mb-6">
              <Text className="text-2xl font-bold text-gray-800">
                Create Post
              </Text>
              <Text className="text-gray-600 text-base mt-1">
                Share your thoughts with the community
              </Text>
            </View>

            <View className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
              <View className="mb-6">
                <View className="flex-row justify-between items-center mb-1">
                  <Text
                    className={`text-xs font-medium ${
                      titleCharCount > maxTitleLength
                        ? "text-red-500"
                        : titleCharCount > maxTitleLength - 50
                        ? "text-yellow-500"
                        : "text-gray-400"
                    }`}
                  >
                    {titleCharCount}/{maxTitleLength}
                  </Text>
                </View>
                <CustomInput
                  value={formData.title}
                  label="Title"
                  placeholder="Enter a descriptive title"
                  onChangeText={(val) => setFormData({ ...formData, title: val })}
                />
              </View>
              <View className="mb-2">
                <View className="flex-row justify-between items-center mb-1">

                  <Text
                    className={`text-xs font-medium ${
                      bodyCharCount > maxBodyLength
                        ? "text-red-500"
                        : bodyCharCount > maxBodyLength - 50
                        ? "text-yellow-500"
                        : "text-gray-400"
                    }`}
                  >
                    {bodyCharCount}/{maxBodyLength}
                  </Text>
                </View>
                <CustomInput
                  value={formData.body}
                  label="Body"
                  placeholder="Share your thoughts here..."
                  onChangeText={(val) => setFormData({ ...formData, body: val })}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </View>
            </View>

            <View className="flex-row justify-between items-center mt-10 space-x-4">
              <TouchableOpacity
                onPress={() => setFormData({ title: "", body: "" })}
                className="flex-row items-center px-4 py-2 bg-gray-100 rounded-lg"
              >
                <Ionicons name="refresh-outline" size={16} color="#6B7280" />
                <Text className="text-gray-600 ml-2 font-medium text-sm">Reset</Text>
              </TouchableOpacity>

              <CustomButton
                title="Publish Post"
                handlePress={handleAddPost}
                isLoading={addingPost}  
                containerStyles="bg-blue-500 rounded-lg px-8 w-[60%]"
                titleStyles="text-base font-medium"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddPost;
