import { View, Pressable, Text } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";

export default function RunSelfieScreen() {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const params = useLocalSearchParams<{
    distanceKm: string;
  }>();

  if (!permission?.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Pressable onPress={requestPermission}>
          <Text className="text-white font-bold">Enable Camera</Text>
        </Pressable>
      </View>
    );
  }

  const takePhoto = async () => {
    const photo = await cameraRef.current?.takePictureAsync();
    if (!photo) return;

    router.push({
      pathname: "/run/post",
      params: {
        imageUri: photo.uri,
        distanceKm: params.distanceKm,
      },
    });
  };

  return (
    <View className="flex-1 bg-black">
      <CameraView ref={cameraRef} facing="front" style={{ flex: 1 }} />
      <Pressable
        onPress={takePhoto}
        className="absolute bottom-12 self-center bg-orange-500 px-8 py-4 rounded-full"
      >
        <Text className="text-white font-black text-lg">Snap</Text>
      </Pressable>
    </View>
  );
}
