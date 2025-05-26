import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const Profile = () => {
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+250 788 123 456',
    avatar: 'https://i.pravatar.cc/150?img=3',
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'You tapped edit profile.');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'You tapped logout.');
    // Add your logout logic here
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      {/* Header */}
      <View className="items-center mt-6">
        <Image
          source={{ uri: user.avatar }}
          className="w-28 h-28 rounded-full border-4 border-blue-500"
        />
        <Text className="mt-4 text-xl font-bold text-gray-800">{user.name}</Text>
        <Text className="text-gray-500">{user.email}</Text>
      </View>

      {/* User Info */}
      <View className="mt-8 space-y-4">
        <View className="flex-row items-center">
          <Ionicons name="mail-outline" size={22} color="#4B5563" />
          <Text className="ml-3 text-base text-gray-700">{user.email}</Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="call-outline" size={22} color="#4B5563" />
          <Text className="ml-3 text-base text-gray-700">{user.phone}</Text>
        </View>
      </View>

      {/* Buttons */}
      <View className="mt-10 space-y-4">
        <TouchableOpacity
          onPress={handleEditProfile}
          className="bg-blue-600 py-3 rounded-lg items-center"
        >
          <Text className="text-white font-semibold text-base">Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-500 py-3 rounded-lg items-center"
        >
          <Text className="text-white font-semibold text-base">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
