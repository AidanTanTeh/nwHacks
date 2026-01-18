import { View, Text, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";

export default function TrackerScreen() {
  const { type } = useLocalSearchParams<{ type?: string }>();
  const workoutType = type === "walk" ? "WALK" : "RUN";

  return (
    <View className="flex-1 bg-black px-6 pt-16">
      {/* Top bar */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Text className="text-2xl">🏃‍♂️</Text>
          <Text className="text-white text-3xl font-extrabold">
            {workoutType}
          </Text>
        </View>

        <Pressable onPress={() => router.back()}>
          <Text className="text-zinc-500 text-4xl">×</Text>
        </Pressable>
      </View>

      {/* Big distance */}
      <View className="flex-1 items-center justify-center">
        <Text className="text-white text-8xl font-extrabold">0.00</Text>
        <Text className="text-zinc-500 tracking-widest mt-2">
          KILOMETERS
        </Text>
      </View>

      {/* Start button */}
      <View className="items-center pb-10">
        <Pressable className="w-24 h-24 rounded-full bg-orange-500 items-center justify-center">
          <Text className="text-white text-4xl">▶</Text>
        </Pressable>
      </View>
    </View>
  );
}
