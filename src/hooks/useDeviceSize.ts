import { useEffect, useState } from "react";
import { useWindowDimensions, Platform } from "react-native";
import Constants from "expo-constants";

export default function useDeviceSize() {
  const { width, height } = useWindowDimensions();

  const platform = Platform.OS;

  if (platform === "ios") {
    if ((width <= 320 && height <= 480) || (width <= 480 && height <= 320)) {
      return "xsmall";
    } else if (
      (width <= 320 && height <= 568) ||
      (width <= 568 && height <= 320)
    ) {
      return "small";
    } else if (
      (width <= 375 && height <= 667) ||
      (width <= 667 && height <= 375)
    ) {
      return "normal";
    } else if (
      (width <= 414 && height <= 736) ||
      (width <= 736 && height <= 414)
    ) {
      return "large";
    }
    return "xlarge";
  } else if (platform === "android") {
    if ((width >= 960 && height >= 720) || (width >= 720 && width >= 960)) {
      return "xlarge";
    } else if (
      (width >= 640 && height >= 480) ||
      (width >= 480 && height >= 640)
    ) {
      return "large";
    } else if (
      (width >= 580 && height >= 320) ||
      (width >= 320 && height >= 580)
    ) {
      return "normal";
    } else if (
      (width >= 426 && height >= 320) ||
      (width >= 320 && height >= 426)
    ) {
      return "small";
    }
    return "xsmall";
  }

  return "unknown";
}
