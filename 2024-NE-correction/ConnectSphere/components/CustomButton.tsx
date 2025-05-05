import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

interface CustomButtonProps {
    title: string;
    handlePress: () => void;
    variant?: "primary" | "outline";
    containerStyles?: string;
    titleStyles?: string;
    isLoading?: boolean
}
const CustomButton = ({ title, handlePress, variant = "primary", containerStyles, titleStyles, isLoading }: CustomButtonProps) => {
    return (
        <TouchableOpacity
            disabled={isLoading}
            onPress={handlePress}
            className={`${variant === 'primary' ? "bg-violet-600" : "bg-white border border-violet-300"} w-full px-2 rounded-md flex flex-row justify-center items-center py-2 ${containerStyles}`}
        >
            <Text
                className={`${variant === "primary" ? "text-white" : "text-violet-500"} text-lg font-semibold ${titleStyles}`}
            >{title}</Text>
            {
                isLoading &&
                <ActivityIndicator
                    size={"small"}
                    animating={isLoading}
                    color={variant === "primary" ? "white" : "violet"}

                />
            }
        </TouchableOpacity>
    )
}

export default CustomButton