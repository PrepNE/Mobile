import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Swiper from "react-native-swiper";
import { onboarding } from "@/constants";
import CustomButton from "@/components/CustomButton";

const Onbooarding = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastSlide = activeIndex === onboarding.length - 1;

  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-white">
      <TouchableOpacity
        className="w-full flex justify-end items-end p-5"
        onPress={() => router.replace("/(auth)/sign-up")}
      >
        <Text className="text-black text-md font-JakartaExtraBold">Skip</Text>
      </TouchableOpacity>

      <Swiper
        ref={swiperRef}
        showsPagination={false}
        loop={false}
        dot={<View className="w-[32px] h-[4px] mx-1 mb-10 bg-[#E2E8F0]" />}
        activeDot={
          <View className="w-[32px] h-[4px] mx-1 mb-10 bg-[#0286FF]" />
        }
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {onboarding.map((item, index) => (
          <React.Fragment key={item.id}>
            <View className="flex items-center justify-center p-5">
              <Image source={item.image} className="w-full h-[300px]" />
              <View className="flex flex-row items-center justify-center w-full ">
                <Text className="text-black text-lg font-bold mx-10 text-center">
                  {item.title}
                </Text>
              </View>

              <Text className="text-sm font-JakartaSemiBold text-center text-[#858585] mx-10 mt-3 mb-10 ">
                {item.description}
              </Text>
            </View>

            <View
              className={`w-[32px] h-[4px] mx-1  rounded-full ${
                index === activeIndex ? "bg-[#0286FF]" : "bg-[#E2E8F0]"
              }`}
            />
          </React.Fragment>
        ))}
      </Swiper>

      <View className="flex-row justify-center items-center mb-4">
        {onboarding.map((_, index) => (
          <View
            key={index}
            className={`w-[32px] h-[4px] mx-1 rounded-full ${
              index === activeIndex ? "bg-[#0286FF]" : "bg-[#E2E8F0]"
            }`}
          />
        ))}
      </View>

      <CustomButton
        title={isLastSlide ? "Get Started" : "Next"}
        onPress={() =>
          isLastSlide
            ? router.replace("/(auth)/sign-up")
            : swiperRef.current?.scrollBy(1)
        }
        className="w-[80%] mt-10"
      />
    </SafeAreaView>
  );
};

export default Onbooarding;
