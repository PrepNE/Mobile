


import { View, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Image , TextInput} from 'react-native'
import React from 'react'
import { InputFieldProps } from '@/types/types'

const CustomInput = ({
    label,
    icon,
    secureTextEntry = false,
    labelStyle,
    containerStyle,
    inputStyle,
    iconStyle,
    className,
    ...props
}: InputFieldProps) => {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.isVisible}>
            <View className='my-1 w-full'>
                <Text className={`text-lg mb-3 ${labelStyle}`}>{label}</Text>
                <View className={`flex flex-row justify-start items-center bg-neutral-200 rounded-full border border-neutral-100 ${containerStyle}`}>
                   {icon && <View className={`ml-4 ${iconStyle}`}>{icon}</View>}
                    <TextInput className={`rounded-full p-4 text-[15px] flex-1 ${inputStyle}`}  secureTextEntry={secureTextEntry} {...props} />
                </View>
            </View>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default CustomInput