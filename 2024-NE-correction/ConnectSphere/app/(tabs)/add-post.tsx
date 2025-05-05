import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import usePosts from "@/hooks/usePosts";
import { usernameState } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, View } from "react-native";
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
    const maxLength = 280;
    if (formData.title.length > maxLength) {
      toast.show(`Title cannot be longer than ${maxLength} characters`, {
        type: "danger",
      });
      return;
    }
    if (formData.body.length > maxLength + 200) {
      toast.show(`Body cannot be longer than ${maxLength + 200} characters`, {
        type: "danger",
      });
      return;
    }

    addPost(formData);
  };
  return (
    <SafeAreaView className="h-full">
      <View className="px-4 pt-3 pb-2 border-gray-100 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Ionicons name="newspaper" size={24} color="#3B82F6" />
          <Text className="text-xl font-bold ml-2 text-gray-800">Feed</Text>
        </View>
        {username && (
          <View className="flex-row items-center bg-blue-50 px-3 py-1 rounded-full">
            <Ionicons name="person-circle-outline" size={16} color="#3B82F6" />
            <Text className="text-sm font-medium text-blue-600 ml-1">
              {username}
            </Text>
          </View>
        )}
      </View>
      <View className="p-3 px-5 h-full justify-center">
        <View>
          <Text className="text-xl font-rubiksemibold text-gray-800">
            Create Post
          </Text>
          <Text className="text-gray-600 text-base">
            Fill in the form below to create a post
          </Text>
        </View>
        <View className="mb-5 mt-8">
          <CustomInput
            value={formData.title}
            label="Post Title"
            placeholder="Enter post title"
            onChangeText={(val) => setFormData({ ...formData, title: val })}
          />
          <CustomInput
            value={formData.body}
            label="Body"
            placeholder="Enter post body"
            onChangeText={(val) => setFormData({ ...formData, body: val })}
            multiline
            numberOfLines={4}
            containerStyles="mt-3"
          />
        </View>
        <CustomButton
          title="Submit Post"
          handlePress={handleAddPost}
          isLoading={addingPost}
          containerStyles="mt-8"
        />
      </View>
    </SafeAreaView>
  );
};

export default AddPost;
