import { useState } from "react";
import { View, Text, Image, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const [goal, setGoal] = useState(0);

  const increaseGoal = () => setGoal((prev) => prev + 1);
  const decreaseGoal = () => setGoal((prev) => Math.max(0, prev - 1));

  return (
    <ScrollView
      className="flex-1 bg-black"
      contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 64, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Top bar */}
      <View className="flex-row items-center justify-between">
        <Text className="text-white text-xl font-semibold">Profile</Text>
        <Pressable onPress={() => {}}>
          <Ionicons name="settings-outline" size={22} color="#a1a1aa" />
        </Pressable>
      </View>

      {/* Avatar */}
      <View className="items-center mt-6">
        {/* Outer circle for styling/background */}
        <View className="w-28 h-28 rounded-full bg-orange-500 items-center justify-center overflow-hidden">
          <Image
            source={{ uri: "https://picsum.photos/100/100" }}
            className="w-32 h-32 rounded-full"
            style={{ transform: [{ scaleX: -1 }] }} // optional flip
            resizeMode="cover"
          />
        </View>

        <Text className="text-white text-4xl font-extrabold mt-4">
          Alex Runner
        </Text>
        <Text className="text-zinc-400 text-lg mt-1">Fitness Enthusiast</Text>
      </View>

      {/* Stats */}
      <View className="flex-row gap-4 mt-8">
        <StatCard title="STREAK" value="5" suffix="days" />
        <StatCard title="WORKOUTS" value="47" />
      </View>

      {/* Achievements */}
      <SectionCard icon="trophy" title="Achievements">
        <View className="rounded-2xl bg-zinc-800/40 px-4 py-4 flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full bg-zinc-900 items-center justify-center">
            <Ionicons name="flame" size={18} color="#f97316" />
          </View>
          <View>
            <Text className="text-white font-extrabold">5 Day Streak</Text>
            <Text className="text-zinc-400">Keep it up!</Text>
          </View>
        </View>
      </SectionCard>

      {/* Goal Setting */}
      <View className="mt-6 rounded-3xl bg-zinc-900/60 px-5 py-5">
        <View className="flex-row items-center gap-3 mb-4">
          <Ionicons name="trophy" size={18} color="#f59e0b" />
          <Text className="text-white font-extrabold">Goal Setting</Text>
        </View>

        <View className="flex-row items-center gap-3 bg-zinc-800/40 rounded-2xl px-4 py-4">
          <View>
            <Text className="text-white font-bold text-sm">Current Goal</Text>
            <Text className="text-zinc-400 text-sm">{goal}.0 km</Text>
          </View>

          <View className="ml-auto flex-row gap-3">
            <Pressable
              onPress={decreaseGoal}
              className="w-10 h-10 rounded-xl bg-zinc-700/40 items-center justify-center"
            >
              <Text className="text-white text-2xl font-extrabold">−</Text>
            </Pressable>

            <Pressable
              onPress={increaseGoal}
              className="w-10 h-10 rounded-xl bg-zinc-700/40 items-center justify-center"
            >
              <Text className="text-white text-2xl font-extrabold">+</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Appearance */}
      <View className="mt-6 rounded-3xl bg-zinc-900/60 px-5 py-5 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Ionicons name="moon" size={18} color="#a1a1aa" />
          <Text className="text-white font-semibold">Appearance</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Text className="text-zinc-400">Dark</Text>
          <Ionicons name="chevron-forward" size={18} color="#71717a" />
        </View>
      </View>
    </ScrollView>
  );
}

function StatCard({ title, value, suffix }: { title: string; value: string; suffix?: string }) {
  return (
    <View className="flex-1 rounded-2xl bg-zinc-900/60 px-5 py-5">
      <Text className="text-zinc-500 font-extrabold tracking-widest">{title}</Text>
      <View className="flex-row items-baseline gap-2 mt-3">
        <Text className="text-white text-4xl font-extrabold">{value}</Text>
        {suffix ? <Text className="text-zinc-400 font-semibold">{suffix}</Text> : null}
      </View>
    </View>
  );
}

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mt-5 rounded-3xl bg-zinc-900/60 px-5 py-5">
      <View className="flex-row items-center gap-3 mb-4">
        <Ionicons name={icon} size={18} color="#f59e0b" />
        <Text className="text-white font-extrabold">{title}</Text>
      </View>
      {children}
    </View>
  );
}