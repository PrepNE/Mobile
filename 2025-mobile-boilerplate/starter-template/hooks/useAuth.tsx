import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { User } from "@/types";
import { axios } from "@/lib/axios.config";
import { router } from "expo-router";
import { Alert } from "react-native";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  loggingIn: boolean;
  register: (
    user: Omit<
      User,
      "id" | "createdDate" | "lastModifiedDate" | "verificationCode"
    > & {
      password?: string;
    }
  ) => void;
  registering: boolean;
  verifyOtp: (email: string, code: string) => void;
  logout: () => void;
  loggingOut: boolean;
  initialLoading: boolean;
  updateProfile: (updatedUser: Partial<User> | FormData) => Promise<void>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loggingIn, setLoggingIn] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // Start as true during loading
  const [user, setUser] = useState<User | null>(null);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const { data } = await axios.get("/users/me");
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        await AsyncStorage.removeItem("token");
        setUser(null);
      } finally {
        setInitialLoading(false); // Set to false after loading completes
      }
    };

    fetchUser();
  }, []);

  const getToken = async () => {
    const token = await AsyncStorage.getItem("token");
    return token;
  };

  const login = async (email: string, password: string) => {
    setLoggingIn(true);
    try {
      const { data } = await axios.post("/users/login", { email, password });
      setUser(data.user);
      await AsyncStorage.setItem("token", data.access_token);

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Logged in successfully",
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Invalid email or password",
      });

      Alert.alert("Error: ", "Invalid email or password");
    } finally {
      setLoggingIn(false);
    }
  };

  const register = async (
    user: Omit<
      User,
      "id" | "createdDate" | "lastModifiedDate" | "verificationCode"
    > & {
      password?: string;
    }
  ) => {
    setRegistering(true);
    try {
      const { data } = await axios.post("/users/register", user);
      setUser(data.user);
      await AsyncStorage.setItem("token", data.access_token);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: data.message || "Account created successfully",
      });
    } catch (error: any) {
      console.log("Error while signing up the user: ", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.message || "An error occurred",
      });
    } finally {
      setRegistering(false);
    }
  };

  const logout = async () => {
    setLoggingOut(true);
    try {
      await axios.get("/users/logout");
      setUser(null);
      await AsyncStorage.removeItem("token");

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Logged out successfully",
      });

    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "An error occurred",
      });
      console.log("Error while logging out: ", error);
    } finally {
      setLoggingOut(false);
    }
  };

  const updateProfile = async (updatedUser: Partial<User> | FormData) => {
    try {
      let headers = {
        "Content-Type": "application/json",
      };

      // Check if the updatedUser is a FormData instance (for profile image uploads)
      if (updatedUser instanceof FormData) {
        headers = {
          "Content-Type": "multipart/form-data",
        };
      }

      const { data } = await axios.patch("/users/update-profile", updatedUser, {
        headers,
      });

      setUser((prevUser) => ({
        ...prevUser,
        ...data.user,
      }));

      Toast.show({
        type: "success",
        text1: "Profile Updated",
        text2: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "An error occurred while updating the profile",
      });
      console.error("Error while updating the profile: ", error);
    }
  };

  const verifyOtp = async (email: string, code: string) => {
    try {
      const { data } = await axios.post("/users/verify-otp", { email, code });
      if (data.success) {
        Alert.alert("Success", "Account verified successfully!");
      }
    } catch (error: any) {
      console.log("Error while verifying the OTP: ", error?.message);
      Alert.alert("Error", "Invalid verification code");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loggingIn,
        register,
        registering,
        verifyOtp,
        logout,
        loggingOut,
        initialLoading,
        updateProfile,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}