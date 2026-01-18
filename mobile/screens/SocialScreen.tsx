import { useMemo, useState } from "react";
import {
    View,
    Text,
    Image,
    FlatList,
    Pressable,
    TextInput,
} from "react-native";
import { Search, UserPlus2, MoreHorizontal, Heart, MessageCircle, Flame } from "lucide-react-native";
import { useSocial, type SocialPost } from "../app/context/SocialContext";

type SocialMode = "feed" | "friends";

type FriendRow = {
    id: string;
    name: string;
    avatar: string;
    streakDays: number;
    online: boolean;
};



const MOCK_FRIENDS: FriendRow[] = [
    {
        id: "f1",
        name: "Henry Hiker",
        avatar: "https://picsum.photos/90/90?4",
        streakDays: 12,
        online: true,
    },
    {
        id: "f2",
        name: "Winnie Walker",
        avatar: "https://picsum.photos/90/90?5",
        streakDays: 2,
        online: false,
    },
];

export default function SocialScreen() {
    const { posts } = useSocial(); 
    const [mode, setMode] = useState<SocialMode>("feed");
    const [query, setQuery] = useState("");

    const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());

    const sendFriendRequest = (friendId: string) => {
        setSentRequests((prev) => new Set(prev).add(friendId));
    };

    const filteredFriends = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return MOCK_FRIENDS;
        return MOCK_FRIENDS.filter((f) => f.name.toLowerCase().includes(q));
    }, [query]);

    return (
        <View className="flex-1 bg-black">
            {/* Header */}
            <View className="px-6 pt-16 pb-4">
                <Text className="text-white text-4xl font-extrabold">Social</Text>

                {/* Segmented control */}
                <View className="mt-6 flex-row gap-4">
                    <Pressable
                        onPress={() => setMode("feed")}
                        className={`flex-1 rounded-2xl py-4 items-center ${mode === "feed" ? "bg-orange-500" : "bg-zinc-900"
                            }`}
                    >
                        <Text
                            className={`text-lg font-bold ${mode === "feed" ? "text-white" : "text-zinc-400"
                                }`}
                        >
                            Feed
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => setMode("friends")}
                        className={`flex-1 rounded-2xl py-4 items-center ${mode === "friends" ? "bg-orange-500" : "bg-zinc-900"
                            }`}
                    >
                        <Text
                            className={`text-lg font-bold ${mode === "friends" ? "text-white" : "text-zinc-400"
                                }`}
                        >
                            Friends
                        </Text>
                    </Pressable>
                </View>
            </View>

            {/* Divider */}
            <View className="h-px bg-zinc-900" />

            {mode === "feed" ? (
                <FlatList
                    data={posts}
                    keyExtractor={(p) => p.id}
                    contentContainerStyle={{ paddingBottom: 120 }}
                    renderItem={({ item }) => <PostCard post={item} />}
                />
            ) : (
                <View className="flex-1 px-6 pt-6">
                    {/* Search */}
                    <View className="bg-zinc-900 rounded-2xl flex-row items-center px-4 py-4">
                        <Search size={18} color="#9ca3af" />
                        <TextInput
                            value={query}
                            onChangeText={setQuery}
                            placeholder="Search friends..."
                            placeholderTextColor="#6b7280"
                            className="flex-1 ml-3 text-white text-base"
                        />
                    </View>

                    {/* Find new friends */}
                    <Pressable className="mt-5 rounded-3xl py-5 items-center bg-[rgba(240,101,22,0.3)]">
                        <View className="flex-row items-center gap-3">
                        <UserPlus2 size={22} color="#FFFFFF5F" />
                        <Text style={{ color: 'rgba(255,255,255,0.4)' }} className="text-xl font-extrabold">
                            Find New Friends
                        </Text>
                        </View>
                    </Pressable>

                    {/* Friends list */}
                    <View className="mt-6">
                        {filteredFriends.map((f) => (
                            <View
                                key={f.id}
                                className="bg-zinc-900 rounded-2xl px-4 py-4 mb-4 flex-row items-center"
                            >
                                <View className="relative mr-4">
                                    <Image
                                        source={{ uri: f.avatar }}
                                        className="w-14 h-14 rounded-full"
                                    />
                                    {f.online && (
                                        <View className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-zinc-900" />
                                    )}
                                </View>

                                <View className="flex-1">
                                    <Text className="text-white text-lg font-bold">
                                        {f.name}
                                    </Text>
                                    <View className="flex-row items-center mt-1">
                                        <Flame size={16} color="#f97316" />
                                        <Text className="text-zinc-400 ml-2 text-base">
                                            {f.streakDays} day streak
                                        </Text>
                                    </View>
                                </View>
                                <Pressable
                                    disabled={sentRequests.has(f.id)}
                                    onPress={() => sendFriendRequest(f.id)}
                                    className={`rounded-full px-5 py-3 ${sentRequests.has(f.id)
                                        ? "bg-zinc-700"
                                        : "bg-orange-500"
                                        }`}
                                >
                                    <Text
                                        className={`font-bold text-base ${sentRequests.has(f.id)
                                            ? "text-zinc-400"
                                            : "text-white"
                                            }`}
                                    >
                                        {sentRequests.has(f.id) ? "Request Sent" : "Add"}
                                    </Text>
                                </Pressable>

                            </View>
                        ))}
                    </View>
                </View>
            )}
        </View>
    );
}

function PostCard({ post }: { post: SocialPost }) {
    return (
        <View className="px-6 pt-6">
            {/* top row */}
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                    <Image
                        source={{ uri: post.userAvatar }}
                        className="w-12 h-12 rounded-full"
                    />
                    <View className="ml-4">
                        <Text className="text-white text-xl font-bold">{post.userName}</Text>
                        <Text className="text-zinc-500">{post.date}</Text>
                    </View>
                </View>
                <MoreHorizontal size={22} color="#9ca3af" />
            </View>

            {/* image card */}
            <View className="rounded-3xl overflow-hidden bg-zinc-900">
                <Image
                    source={{ uri: post.imageUri }}
                    className="w-full h-[520px]"
                    resizeMode="cover"
                />

                {/* distance badge */}
                <View className="absolute top-5 left-5 bg-black/50 rounded-2xl px-4 py-3">
                    <Text className="text-white/80 font-bold">{post.typeLabel}</Text>
                    <Text className="text-white text-3xl font-extrabold">
                        {post.distanceKm.toFixed(2)}{" "}
                        <Text className="text-white/80 text-lg font-bold">km</Text>
                    </Text>
                </View>
            </View>

            {/* caption */}
            <Text className="text-white text-lg mt-4">
                <Text className="font-bold">{post.userName} </Text>
                {post.caption}
            </Text>

            {/* actions */}
            <View className="flex-row items-center mt-4">

                <View className="w-6" />

                <View className="flex-1" />
                <Text className="text-zinc-500 text-base">{post.minutesAgo}m</Text>
            </View>

            {/* divider */}
            <View className="h-px bg-zinc-900 mt-8" />
        </View>
    );
}
