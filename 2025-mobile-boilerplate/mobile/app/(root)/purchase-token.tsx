import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

const PurchaseToken = () => {
  return (
   <SafeAreaView className='flex-1 px-5'>
      <ScrollView showsVerticalScrollIndicator={false}>
         <View className="flex flex-row mb-5 items-center justify-start px-5">
            <TouchableOpacity onPress={() => router.back()}>
               <Ionicons name='arrow-back' size={24} />
            </TouchableOpacity>
            <Text className="text-xl font-rubikbold ml-5">
                 Purchase Token
            </Text>
          </View>

          <View>
            <Text>Purchase Your Electricity token here</Text>
          </View>
      </ScrollView>
   </SafeAreaView>
  )
}

export default PurchaseToken