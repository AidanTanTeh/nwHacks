import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";

export default function WorkoutSelectorScreen() {
  return (
    <View className="flex-1 bg-black px-6 pt-16">
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <Text className="text-white text-4xl font-extrabold">Choose Workout</Text>
        <Pressable onPress={() => router.back()}>
          <Text className="text-zinc-500 text-3xl">×</Text>
        </Pressable>
      </View>

      <Text className="text-zinc-400 text-lg mt-3">
        Select your workout type to get started
      </Text>

      {/* Cards */}
      <View className="mt-8 flex-row gap-4">
        <Pressable
          onPress={() => router.push({ pathname: "/run/tracker", params: { type: "run" } })}
          className="flex-1 rounded-3xl overflow-hidden"
          style={{
            backgroundColor: "transparent",
          }}
        >
          <View className="rounded-3xl bg-orange-500 py-16 items-center justify-center">
            <Text className="text-5xl mb-3">🏃‍♂️</Text>
            <Text className="text-white text-3xl font-extrabold">Run</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => router.push({ pathname: "/run/tracker", params: { type: "walk" } })}
          className="flex-1 rounded-3xl overflow-hidden"
        >
          <View className="rounded-3xl bg-green-500 py-16 items-center justify-center">
            <Text className="text-5xl mb-3">🚶‍♂️</Text>
            <Text className="text-white text-3xl font-extrabold">Walk</Text>
          </View>
        </Pressable>
      </View>

      {/* Coming soon grid */}
      <View className="mt-6 flex-row gap-4">
        <ComingSoonCard />
        <ComingSoonCard />
      </View>
      <View className="mt-4 flex-row gap-4">
        <ComingSoonCard />
        <ComingSoonCard />
      </View>
    </View>
  );
}

function ComingSoonCard() {
  return (
    <View className="flex-1 rounded-3xl bg-zinc-900/60 h-48 items-center justify-center">
      <View className="bg-black/40 px-6 py-3 rounded-full">
        <Text className="text-zinc-400 font-extrabold tracking-widest">
          COMING SOON
        </Text>
      </View>
    </View>
  );
}
