import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import DefaultLayout from "@/layout/DefaultLayout";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";

type Menu = {
  icon: any;
  title: string;
  to: any;
};

const menu: Menu[] = [
  {
    icon: <FontAwesome name="warning" size={50} color="#4f46e5" />,
    title: "INCIDENTES",
    to: "/incidents",
  },
  {
    icon: <FontAwesome name="group" size={50} color="#4f46e5" />,
    title: "LIBRO VISITAS",
    to: "/visits",
  },
  {
    icon: <FontAwesome name="group" size={50} color="#4f46e5" />,
    title: "REUNIONES",
    to: "/otromas",
  },
];
const Community = () => {
  return (
    <DefaultLayout withSafeArea={false}>
      <FlatList
        data={null}
        contentContainerClassName="p-4"
        renderItem={() => null}
        ListHeaderComponent={() => (
          <View className="flex-row flex-wrap gap-2 justify-center">
            {menu.map((option, i) => (
              <Link href={option.to} key={option.title + i} asChild>
                <TouchableOpacity activeOpacity={0.8}>
                  <Card {...option} />
                </TouchableOpacity>
              </Link>
            ))}
          </View>
        )}
      />
    </DefaultLayout>
  );
};

type CardProps = {
  title: string;
  icon: any;
};
const Card: React.FC<CardProps> = ({ icon, title }) => {
  return (
    <View
      className="bg-white p-5 items-center  justify-center gap-3 rounded-2xl w-40 h-40"
      style={styles.shadowCard}
    >
      {icon}
      <Text className="text-primario-600">{title}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  shadowCard: {
    shadowColor: "#4f46e5",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.62,
    elevation: 7,
  },
});
export default Community;
