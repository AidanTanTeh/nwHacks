import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { Flame, Trophy, TrendingUp } from "lucide-react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";

export default function FeedScreen() {
    // ⏱️ Countdown timer (2 hours)
    const [secondsLeft, setSecondsLeft] = useState(2 * 60 * 60);

    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const hours = Math.floor(secondsLeft / 3600);
    const minutes = Math.floor((secondsLeft % 3600) / 60);
    const seconds = secondsLeft % 60;

    return (
        <ScrollView className="flex-1 bg-black px-6 pt-16">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-8">
                <View>
                    <Text className="text-white text-3xl font-extrabold">
                        Hey, Alex!
                    </Text>
                    <Text className="text-zinc-400 mt-1">
                        Ready to keep the streak alive?
                    </Text>
                </View>

                <View className="w-20 h-20 rounded-full items-center justify-center overflow-hidden">
                    <Image
                        source={require("../assets/images/Running in Track 3.png")}
                        className="w-22 h-22 rounded-full"
                        resizeMode="cover"
                        style={{ transform: [{ scaleX: -1 }] }}
                    />
                </View>

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
                {/* Countdown Timer */}
                <View className="bg-red-500 rounded-3xl p-6 mb-6 items-center">
                    <Text className="text-white/90 text-sm tracking-widest mb-1">
                        TIME LEFT
                    </Text>

                    <Text className="text-white text-5xl font-extrabold">
                        {hours.toString().padStart(2, "0")}:
                        {minutes.toString().padStart(2, "0")}:
                        {seconds.toString().padStart(2, "0")}
                    </Text>

                    <Text className="text-white/80 text-sm mt-2 text-center">
                        Complete a challenge before time runs out
                    </Text>
                </View>

                <View className="flex-row justify-between mb-4">
                    <Text className="text-white text-2xl font-bold">
                        Today’s Challenges
                    </Text>
                    <Text className="text-zinc-500">Incomplete</Text>
                </View>

                <Challenge
                    title="2.0 Km Run or Walk"
                    subtitle="Complete a 2.0 Km Run or Walk"
                    progress="0/2000"
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
        <TouchableOpacity
            className="bg-zinc-900 rounded-2xl p-4 mb-4"
            onPress={() => router.push("/WorkoutSelectorScreen")}
        >
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
                            className={`h-full ${highlight ? "bg-orange-500" : "bg-zinc-400"
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