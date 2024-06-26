import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import DefaultLayout from "./DefaultLayout";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Link } from "expo-router";
import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useColorScheme } from "nativewind";

const LayoutWithTopBar: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { toggleColorScheme, colorScheme } = useColorScheme();
  return (
    <DefaultLayout withSafeArea>
      <View
        className="bg-primario-600 dark:bg-primario-800 flex-row justify-between items-center p-2"
        /*  style={{ backgroundColor: "ue" }} */
      >
        <DrawerToggleButton tintColor="#fff" pressColor="#fff" />

        <View className="flex-row items-center">
          <TouchableOpacity onPress={toggleColorScheme}>
            <View className="p-2">
              {colorScheme === "dark" ? (
                <Feather name="sun" size={23} color="#fff" />
              ) : (
                <MaterialIcons name="dark-mode" size={23} color="#fff" />
              )}
            </View>
          </TouchableOpacity>
          <Link href="/notifications" asChild>
            <TouchableOpacity>
              <View className="p-2 ">
                <MaterialIcons name="notifications" color={"#FFF"} size={23} />
              </View>
            </TouchableOpacity>
          </Link>

          <Link href="/profile" asChild>
            <TouchableOpacity>
              <View className="mr-4 p-2 ">
                <FontAwesome name="user-circle-o" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      {children}
    </DefaultLayout>
  );
};

export default LayoutWithTopBar;
