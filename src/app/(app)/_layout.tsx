import { Slot } from "expo-router";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { AppProvider } from "@/context/AppContext";
import messaging from "@react-native-firebase/messaging";
import { Alert, PermissionsAndroid, Platform, StyleSheet } from "react-native";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useRootNavigationState } from "expo-router";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  TourGuideProvider, // Main provider
} from "rn-tourguide";
import Constants from "expo-constants";
import Colors from "@/constants/Colors";
import { useColorScheme } from "nativewind";

const queryClient = new QueryClient();

const FIREBASE_NOTIFICATION_TOPIC = "testing"; // TOPIC FOR TESTING USERS

const Layout = () => {
  const { onLogout, onRefresh, status } = useAuth();
  const navigationState = useRootNavigationState();
  const isDark = useColorScheme().colorScheme === "dark";
  const isIos = Platform.OS === "ios";

  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    if (!user) return onLogout();
    onRefresh(user);
  }

  const requestPermissionIos = async () => {
    const result = await messaging().requestPermission({ announcement: true });

    if (result === messaging.AuthorizationStatus.AUTHORIZED) {
      // ? DEBUG
      Alert.alert("NOTIFICACIONES ACTIVADAS");
    } else if (result === messaging.AuthorizationStatus.PROVISIONAL) {
      // ? DEBUG
      Alert.alert("NOTIFICACIONES PROVISIONALES");
    } else if (result === messaging.AuthorizationStatus.DENIED) {
      // ? DEBUG
      Alert.alert("NOTIFICACIONES DENEGADAS");
    }
  };

  const requestPermissionsAndroid = async () => {
    return await Notifications.requestPermissionsAsync({
      android: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
      },
    });
  };

  const getInitialNotification = async () => {
    const notification = await messaging().getInitialNotification();
    if (!notification) return;

    if (notification?.data && notification?.data.to) {
      router.push(notification.data.to as any);
    }
  };

  const configureNotifications = async () => {
    if (isIos) {
      await requestPermissionIos();
    } else {
      //await requestPermissionsAndroid();

      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      ).then((x) => {
        console.log("PERMISOS NOTIFICATION ANDROID: ", x);
      });
    }

    if (!isIos) {
      try {
        const token = await messaging().getToken();
        console.log(`TOKEN NOTIFICATION DEVICE: ${token}`);
      } catch {
        console.log("FALLO AL OBTENER EL TOKEN");
        // Alert.alert("FALLO AL OBTENER EL TOKEN")
      }
    }

    messaging()
      .subscribeToTopic(FIREBASE_NOTIFICATION_TOPIC)
      .then((x) => {
        console.log(
          `SUSCRIBE TO ${FIREBASE_NOTIFICATION_TOPIC} TOPIC NOTIFICATIONS`
        );
        //Alert.alert("SUSCRITO")
      })
      .catch((e) => {
        // Alert.alert(e.message)
      })
      .finally(() => {
        // Alert.alert("SUSCRITO SIN ERRORES")
      });
  };

  //VERIFY AUTHENCATION
  useEffect(() => {
    try {
      const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
      return subscriber;
    } catch {
      console.log("error");
    }
  }, []);

  // REQUEST NOTIFICATION PERMISSIONS
  useEffect(() => {
    configureNotifications();
  }, []);

  // NOTIFICATION TOAST
  useEffect(() => {
    messaging().onMessage(async (msg) => {
      Toast.show({
        type: "success",
        text1: msg.notification?.title,
        text2: msg.notification?.body,
        visibilityTime: 7000,
      });
    });
  }, []);

  // ON OPENED APP NOTIFICATION
  useEffect(() => {
    messaging().onNotificationOpenedApp((data) => {
      if (data && data?.data && data?.data.to && data.data.to !== "") {
        router.push(data.data.to as any);
      }
    });
  }, []);

  //GET INITIAL NOTIFICATION
  // CHECK IF AN INITIAL NOTIFICATION EXISTS AND REDIRECT IF THERE IS A ROUTING SPECIFIED
  useEffect(() => {
    if (!navigationState?.key) return;
    if (status === "pending") return;

    getInitialNotification();
  }, [navigationState, status]);

  if (!navigationState?.key) return null;

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <BottomSheetModalProvider>
              <TourGuideProvider
                // backdropColor={
                //   isDark ? "rgba(0, 87, 91, 0.4)" : "rgba(31, 70, 61, 0.8)"
                // }
                verticalOffset={Constants.statusBarHeight}
                labels={{
                  previous: "Anterior",
                  next: "Siguiente",
                  skip: "Saltar",
                  finish: "Finalizar",
                }}
              >
                <Slot />
              </TourGuideProvider>
            </BottomSheetModalProvider>
          </AppProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </>
  );
};

export default Layout;
