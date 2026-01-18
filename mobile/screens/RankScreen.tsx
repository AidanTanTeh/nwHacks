import { View, Text, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Row = {
  id: string;
  rank: number;
  name: string;
  workouts: number;
  streakDays: number;
  avatar: string;
  isYou?: boolean;
};

const data: Row[] = [
  {
    id: "1",
    rank: 1,
    name: "Mike Marathon",
    workouts: 134,
    streakDays: 15,
    avatar:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=200&q=80",
  },
  {
    id: "2",
    rank: 2,
    name: "Sarah Sprinter",
    workouts: 62,
    streakDays: 8,
    avatar:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=200&q=80",
  },
  {
    id: "3",
    rank: 3,
    name: "Alex Runner",
    workouts: 47,
    streakDays: 5,
    avatar:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=200&q=80",
    isYou: true,
  },
  {
    id: "4",
    rank: 4,
    name: "Jess Jogger",
    workouts: 28,
    streakDays: 3,
    avatar:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&q=80",
  },
  {
    id: "5",
    rank: 5,
    name: "Tom Trail",
    workouts: 41,
    streakDays: 1,
    avatar:
      "https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=200&q=80",
  },
];

export default function RankScreen() {
  return (
    <ScrollView className="flex-1 bg-black px-6 pt-16" contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Header */}
      <View className="flex-row items-center gap-3">
        <Ionicons name="trophy" size={28} color="#f59e0b" />
        <Text className="text-white text-4xl font-extrabold tracking-wide">
          LEADERBOARD
        </Text>
      </View>
      <Text className="text-zinc-400 text-lg mt-2">Ranked by current streak</Text>

      {/* Orange top card */}
      <View className="mt-6 rounded-3xl bg-orange-500 px-6 py-6">
        <View className="flex-row justify-between">
          <View>
            <Text className="text-white/90 font-extrabold tracking-widest">YOUR RANK</Text>
            <Text className="text-white text-6xl font-extrabold mt-2">#3</Text>
          </View>

          <View className="items-end">
            <Text className="text-white/90 font-extrabold tracking-widest">CURRENT STREAK</Text>
            <View className="flex-row items-center gap-2 mt-3">
              <Ionicons name="flame" size={26} color="white" />
              <Text className="text-white text-6xl font-extrabold">5</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Rows */}
      <View className="mt-10">
        {data.map((row) => (
          <RowItem key={row.id} row={row} />
        ))}
      </View>
    </ScrollView>
  );
}

function RowItem({ row }: { row: Row }) {
  const isTop = row.rank === 1;
  const isYou = !!row.isYou;

  return (
    <View
      className={[
        "flex-row items-center justify-between mb-6",
        isYou ? "rounded-2xl border-2 border-orange-500 bg-orange-500/15 px-4 py-3" : "",
      ].join(" ")}
    >
      {/* Left: rank + avatar + name */}
      <View className="flex-row items-center gap-4">
        <View className="w-8 items-center">
          {isTop ? (
            <Ionicons name="star" size={26} color="#f59e0b" />
          ) : (
            <Text className="text-zinc-500 text-3xl font-extrabold">{row.rank}</Text>
          )}
        </View>

        <Image
          source={{ uri: row.avatar }}
          className={[
            "w-14 h-14 rounded-full",
            isTop
              ? "border-4 border-yellow-500"
              : isYou
              ? "border-4 border-orange-500"
              : "border-4 border-zinc-700",
          ].join(" ")}
        />

        <View>
          <View className="flex-row items-baseline gap-2">
            <Text className="text-white text-xl font-extrabold">{row.name}</Text>
            {isYou ? (
              <Text className="text-orange-400 text-lg font-extrabold">(You)</Text>
            ) : null}
          </View>
          <Text className="text-zinc-400 text-base">{row.workouts} workouts</Text>
        </View>
      </View>

      {/* Right: streak */}
      <View className="items-end">
        <View className="flex-row items-center gap-2">
          <Ionicons name="flame" size={22} color="#f97316" />
          <Text className="text-orange-400 text-4xl font-extrabold">{row.streakDays}</Text>
        </View>
        <Text className="text-zinc-500 font-extrabold tracking-widest">DAYS</Text>
      </View>
    </View>
  );
}
