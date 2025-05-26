import { View, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import CustomInput from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const SignIn = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    console.log('Sign Up with:', { fullName, email, password });
    router.push("/(root)/(tabs)/home")
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, justifyContent: 'center' }}>
          <View className="w-full items-center mb-8">
            <Text className="text-3xl font-bold text-[#0286FF]">Login into your account</Text>
            <Text className="text-neutral-500 mt-2">Easily pay electricity bills anytime</Text>
          </View>

    
          <CustomInput
            label="Email"
            placeholder="e.g. john@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            icon={<Ionicons name="mail-outline" size={22} color="#666" />}
          />

          <CustomInput
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            icon={<Ionicons name="lock-closed-outline" size={22} color="#666" />}
          />

          <CustomButton
            title="Sign In"
            onPress={handleSignIn}
            className="mt-10"
          />

          <TouchableOpacity
          onPress={() => router.push("/(auth)/sign-up")}
          className="mt-4 items-center">
            <Text className="text-neutral-500">
              Don&apos;t have an account? <Text className="text-[#0286FF]">Register</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
