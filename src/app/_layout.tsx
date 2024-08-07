import "../global.css";
import "../output.css";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Slot, SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { SessionProvider } from "../context/SessionContext";
import messaging from "@react-native-firebase/messaging";
import { AppProvider } from "@/context/AppContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/components/Toast";
import { PortalHost } from "@/components/primitives/portal";
import { LogBox } from "react-native";

LogBox.ignoreLogs([
  "Warning: Failed prop type: Invalid prop `color` supplied to `Text`: hsla(0)",
]);

// Tu código de la aplicación continúa aquí

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

messaging().setBackgroundMessageHandler(async (msg) => {
  console.log("NOTIFICATION ON BACKGROUND", msg.data);
});

const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <SessionProvider>
            <BottomSheetModalProvider>
              <Slot />
              <PortalHost />
            </BottomSheetModalProvider>
            <Toast config={toastConfig} />
          </SessionProvider>
        </AppProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

/* import { Redirect, Slot } from "expo-router";
import { SessionProvider } from "../context/SessionContext";
import { useStorageState } from "../hooks/useStorageState";
import { Text } from "../components/Themed";
import messaging from '@react-native-firebase/messaging';

export default function Root() {
  // Set up the auth context and render our layout inside of it.

  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}
 */
