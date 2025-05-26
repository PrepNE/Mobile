import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Asset } from "expo-asset";
import { ToastProvider } from "react-native-toast-notifications";
import { RecoilRoot } from "recoil";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Rubik: require("../assets/fonts/Rubik-Regular.ttf"),
    RubikBold: require("../assets/fonts/Rubik-Bold.ttf"),
    RubikMedium: require("../assets/fonts/Rubik-Medium.ttf"),
    RubikSemibold: require("../assets/fonts/Rubik-SemiBold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      Asset.loadAsync([
        require("../assets/images/undraw_electricity_iu6d.png"),
        require("../assets/images/undraw_schedule_6t8k.png"),
        require("../assets/images/undraw_mobile-payments_0u42.png"),
      ]);
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <RecoilRoot>
      <ToastProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <GestureHandlerRootView>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
               <Stack.Screen name="product/[productId]" options={{ headerShown: false }} />
              <Stack.Screen name="(root)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </GestureHandlerRootView>
        </ThemeProvider>
      </ToastProvider>
    </RecoilRoot>
  );
}
