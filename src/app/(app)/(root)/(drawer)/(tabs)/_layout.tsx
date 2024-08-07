import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { Animated, useWindowDimensions } from "react-native";
import { MaterialTopTabs } from "../../../../../navigator/top-tabs";
import LayoutWithTopBar from "../../../../../layout/LayoutWithTopBar";
import Colors from "@/constants/Colors";
import { Platform } from "react-native";
import { useColorScheme } from "nativewind";
import useDeviceSize from "@/hooks/useDeviceSize";
import { useQueryClient } from "@tanstack/react-query";

const av = new Animated.Value(0);
av.addListener(() => {
  return;
});

export default function Layout() {
  const isDark = useColorScheme().colorScheme === "dark";

  const deviceSize = useDeviceSize();

  const smallDevice = deviceSize === "xsmall" || deviceSize === "small";

  const client = useQueryClient();

  const invalidateAnnouncement = () => {
    client.invalidateQueries({
      queryKey: ["announcements"],
    });
  };

  return (
    <>
      <StatusBar
        backgroundColor={isDark ? Colors.primario[800] : Colors.primario[600]}
        style={Platform.select({
          ios: "dark",
          android: "light",
        })}
      />

      <LayoutWithTopBar>
        <MaterialTopTabs
          screenListeners={{
            focus: () => {
              Animated.timing(av, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
              }).start();
            },
          }}
          tabBarPosition="bottom"
          screenOptions={{
            lazy: true,
            //tabBarItemStyle: { padding: 6 },

            tabBarStyle: {
              backgroundColor: isDark ? Colors.primario[800] : "white",
            },
            tabBarLabelStyle: { margin: 0, padding: 0, fontSize: 12 },
            //tabBarActiveTintColor: Colors.primario[700],
            tabBarActiveTintColor: isDark ? "#FFF" : Colors.primario[800],
          }}
        >
          <MaterialTopTabs.Screen
            name="index"
            options={{
              title: "Inicio",
              tabBarShowLabel: !smallDevice,
              tabBarIcon: ({ color }) => (
                <MaterialIcons name="home" color={color} size={20} />
              ),
            }}
            listeners={{ focus: () => invalidateAnnouncement() }}
          />

          <MaterialTopTabs.Screen
            name="community"
            options={{
              title: "Comunidad",
              tabBarShowLabel: !smallDevice,
              tabBarIcon: ({ color }) => (
                <MaterialIcons name="unarchive" color={color} size={20} />
              ),
            }}
          />

          <MaterialTopTabs.Screen
            name="payments"
            options={{
              title: "Cargos",
              tabBarShowLabel: !smallDevice,
              tabBarIcon: ({ color }) => (
                <MaterialIcons name="payments" color={color} size={20} />
              ),
            }}
          />

          <MaterialTopTabs.Screen
            name="reservations"
            options={{
              title: "Reservas",
              tabBarShowLabel: !smallDevice,
              tabBarIcon: ({ color }) => (
                <MaterialIcons name="calendar-today" color={color} size={20} />
              ),
            }}
          />
          {/**
           <MaterialTopTabs.Screen
            name="perfil"
            options={{
              title: 'Perfil',
              tabBarIcon: ({color}) => (
                <MaterialIcons name="verified-user" color={color} size={20} />
              ),
            }}
          /> 

        */}
        </MaterialTopTabs>
      </LayoutWithTopBar>
    </>
  );
}
