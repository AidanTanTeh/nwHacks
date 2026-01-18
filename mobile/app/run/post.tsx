import { View, Text, Image, TextInput, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import { useSocial } from "../context/SocialContext";

export default function CreateRunPostScreen() {
  const { imageUri, distanceKm } = useLocalSearchParams<{
    imageUri: string;
    distanceKm: string;
  }>();

  const { addPost } = useSocial();
  const [caption, setCaption] = useState("");

  const submit = () => {
    addPost({
      id: Date.now().toString(),
      userName: "You",
      userAvatar: "https://picsum.photos/100",
      date: new Date().toLocaleDateString(),
      imageUri,
      typeLabel: "RUN",
      distanceKm: Number(distanceKm),
      caption,
      minutesAgo: 0,
    });

    router.replace("/social");
  };

  return (
    <View className="flex-1 bg-black px-6 pt-12">
      <Image source={{ uri: imageUri }} className="w-full h-96 rounded-3xl" />

      <TextInput
        placeholder="How was your run?"
        placeholderTextColor="#6b7280"
        value={caption}
        onChangeText={setCaption}
        className="mt-6 bg-zinc-900 text-white p-4 rounded-2xl"
      />

      <Pressable
        onPress={submit}
        className="mt-6 bg-orange-500 py-5 rounded-3xl items-center"
      >
        <Text className="text-white font-extrabold text-lg">Post</Text>
      </Pressable>
    </View>
  );
}
