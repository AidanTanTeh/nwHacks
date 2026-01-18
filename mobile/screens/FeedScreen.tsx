import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { Flame, Trophy, TrendingUp } from "lucide-react-native";

export default function FeedScreen() {
  return (
    <ScrollView className="flex-1 bg-black px-6 pt-16">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-8">
        <View>
          <Text className="text-white text-3xl font-extrabold">
            Hey, Alex! 👋
          </Text>
          <Text className="text-zinc-400 mt-1">
            Ready to keep the streak alive?
          </Text>
        </View>

        <Image
          source={{ uri: "https://picsum.photos/100" }}
          className="w-12 h-12 rounded-full"
        />
      </View>

      {/* Streak Card */}
      <View className="rounded-3xl p-6 mb-6 bg-orange-500">
        <View className="flex-row items-center mb-4">
          <Flame color="white" size={20} />
          <Text className="text-white font-bold ml-2 tracking-widest">
            CURRENT STREAK
          </Text>
        </View>

        <Text className="text-white text-6xl font-extrabold">
          5 <Text className="text-2xl font-semibold">days</Text>
        </Text>

        <View className="flex-row justify-between mt-6">
          <View>
            <Text className="text-white/80 text-sm">Longest Streak</Text>
            <Text className="text-white text-xl font-bold">12 days</Text>
          </View>

          <View>
            <Text className="text-white/80 text-sm">Total Workouts</Text>
            <Text className="text-white text-xl font-bold text-right">
              47
            </Text>
          </View>
        </View>
      </View>

      {/* Stats Cards */}
      <View className="flex-row gap-4 mb-8">
        <View className="flex-1 bg-zinc-900 rounded-2xl p-5">
          <View className="flex-row items-center mb-2">
            <TrendingUp size={16} color="#22c55e" />
            <Text className="text-zinc-400 ml-2 font-bold">
              THIS WEEK
            </Text>
          </View>
          <Text className="text-white text-4xl font-extrabold">5</Text>
          <Text className="text-zinc-500">workouts</Text>
        </View>

        <View className="flex-1 bg-zinc-900 rounded-2xl p-5">
          <View className="flex-row items-center mb-2">
            <Trophy size={16} color="#facc15" />
            <Text className="text-zinc-400 ml-2 font-bold">
              RANK
            </Text>
          </View>
          <Text className="text-white text-4xl font-extrabold">#3</Text>
          <Text className="text-zinc-500">in friends</Text>
        </View>
      </View>

      {/* Challenges */}
      <View className="mb-24">
        <View className="flex-row justify-between mb-4">
          <Text className="text-white text-2xl font-bold">
            Today’s Challenges
          </Text>
          <Text className="text-zinc-500">0/3 Complete</Text>
        </View>

        <Challenge
          title="30 Minute Workout"
          subtitle="Complete any 30-minute workout"
          progress="0/30"
        />

        <Challenge
          title="Early Bird"
          subtitle="Workout before 8 AM"
        />

        <Challenge
          title="Share the Love"
          subtitle="Comment on 3 friends' workouts"
          progress="1/3"
          highlight
        />
      </View>
    </ScrollView>
  );
}

function Challenge({
  title,
  subtitle,
  progress,
  highlight,
}: {
  title: string;
  subtitle: string;
  progress?: string;
  highlight?: boolean;
}) {
  return (
    <TouchableOpacity className="bg-zinc-900 rounded-2xl p-4 mb-4">
      <View className="flex-row justify-between items-center mb-2">
        <View>
          <Text className="text-white font-bold">{title}</Text>
          <Text className="text-zinc-500 text-sm">{subtitle}</Text>
        </View>
        <Text className="text-zinc-400">{">"}</Text>
      </View>

      {progress && (
        <View className="mt-3">
          <View className="h-2 bg-zinc-700 rounded-full overflow-hidden">
            <View
              className={`h-full ${
                highlight ? "bg-orange-500" : "bg-zinc-400"
              }`}
              style={{ width: progress.startsWith("1") ? "33%" : "0%" }}
            />
          </View>
          <Text className="text-zinc-500 text-right mt-1">
            {progress}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
