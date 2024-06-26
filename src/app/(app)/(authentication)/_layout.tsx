import { Redirect, Stack } from "expo-router";
import { useSessionContext } from "../../../hooks/useSessionContext";
import { useStorageState } from "../../../hooks/useStorageState";
import { Text, Image } from "react-native";

import { View } from "react-native";
import Loader from "@/components/Loader";

export default function UnprotectedLayout() {
  const { status, isLoadingShowWelcomeScreen, showWelcomeScreen } =
    useSessionContext();

  if (status == "pending" || isLoadingShowWelcomeScreen) {
    return (
      <View className="flex-1 items-center justify-center">
        {/* <Image
          style={{
            height: 150,
            width: 150,
            justifyContent: "center",
            alignItems: "center",
          }}
          source={require("../../../assets/images/adaption-icon.png")}
        />
        <Loader />; */}
      </View>
    );
  }

  if (status == "authenticated" && showWelcomeScreen == "true") {
    return <Redirect href="/" />;
  }

  if (!showWelcomeScreen) {
    return <Redirect href="/welcome/" />;
  }

  return <Stack />;
}
