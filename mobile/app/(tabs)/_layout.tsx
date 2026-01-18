import { Tabs } from "expo-router";
import { Platform, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Home, Users, BarChart, User } from "lucide-react-native";

function RunButton({ onPress }: any) {
  return (
    <View style={{ position: "relative", top: -18, left: 10 }}>
      <Pressable
        onPress={onPress}
        className="w-16 h-16 rounded-full bg-orange-500 items-center justify-center border-4 border-white dark:border-black"
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 8 },
          elevation: 12,
        }}
      >
        <Ionicons name="play" size={28} color="white" style={{ marginLeft: 4 }}/>
      </Pressable>
    </View>
  );
}

export default function TabsLayout() {
  const TabIcon = ({ Icon, color, focused }: any) => (
  <View
    style={{
      shadowColor: focused ? "#ffffff" : "transparent",
      shadowOpacity: focused ? 0.9 : 0,
      shadowRadius: focused ? 10 : 0,
    }}
  >
    <Icon color={color} size={26} strokeWidth={1.75} />
  </View>
);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#6b7280",
        tabBarStyle: {
          height: 88,
          paddingTop: 10,
          paddingBottom: Platform.OS === "ios" ? 26 : 16,
          borderTopWidth: 0,
          backgroundColor: "rgba(0,0,0,0.92)",
        },
      }}
    >
      <Tabs.Screen
  name="index"
  options={{
    title: "Home",
    tabBarIcon: ({ color, focused }) => (
      <TabIcon Icon={Home} color={color} focused={focused} />
    ),
  }}
/>

      <Tabs.Screen
  name="social"
  options={{
    title: "Social",
    tabBarIcon: ({ color, focused }) => (
      <TabIcon Icon={Users} color={color} focused={focused} />
    ),
  }}
/>

<Tabs.Screen
  name="run"
  options={{
    title: "",
    tabBarButton: (props) => <RunButton {...props} />,
  }}
/>


      <Tabs.Screen
  name="rank"
  options={{
    title: "Rank",
    tabBarIcon: ({ color, focused }) => (
<TabIcon Icon={BarChart} color={color} focused={focused} />
    ),
  }}
/>


      <Tabs.Screen
  name="profile"
  options={{
    title: "Profile",
    tabBarIcon: ({ color, focused }) => (
      <TabIcon Icon={User} color={color} focused={focused} />
    ),
  }}
/>

    </Tabs>
  );
}
