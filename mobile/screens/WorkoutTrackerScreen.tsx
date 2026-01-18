import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, Pressable, Platform } from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";

type LatLng = { latitude: number; longitude: number };

function haversineKm(a: LatLng, b: LatLng) {
  const R = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(x));
}

function formatTime(totalSec: number) {
  const hrs = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function formatPaceMinPerKm(distanceKm: number, seconds: number) {
  if (distanceKm <= 0.001) return `--'--"`;
  const paceMinPerKm = (seconds / 60) / distanceKm;
  const paceMin = Math.floor(paceMinPerKm);
  const paceSec = Math.round((paceMinPerKm - paceMin) * 60);
  return `${paceMin}'${paceSec.toString().padStart(2, "0")}"`;
}

type TrackingState = "IDLE" | "RUNNING" | "PAUSED";

export default function WorkoutTrackerScreen() {
  // from /run/tracker?workoutType=RUN
  const { workoutType } = useLocalSearchParams<{ workoutType: string }>();

  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [tracking, setTracking] = useState<TrackingState>("IDLE");

  const [seconds, setSeconds] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0);

  const [route, setRoute] = useState<LatLng[]>([]);

  const [lastAccuracy, setLastAccuracy] = useState<number | null>(null);
  const [lastSpeed, setLastSpeed] = useState<number | null>(null);


  const mapRef = useRef<MapView | null>(null);
  const lastPointRef = useRef<LatLng | null>(null);

  const trackingRef = useRef<TrackingState>("IDLE");
  const animateCounterRef = useRef(0);

  const watchSubRef = useRef<Location.LocationSubscription | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
  trackingRef.current = tracking;
}, [tracking]);

  const pace = useMemo(() => formatPaceMinPerKm(distanceKm, seconds), [distanceKm, seconds]);

  const startTimer = () => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  
  const startLocationWatch = async () => {
    // high accuracy updates; pace/route depends on good updates
    if (watchSubRef.current) return;

    watchSubRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 1,
        mayShowUserSettingsDialog: true,
      },
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        
        setLastAccuracy(accuracy ?? null);
        setLastSpeed(pos.coords.speed ?? null);

        // ignore very bad points (optional but helps)
        if (accuracy != null && accuracy > 200) return;

        const point = { latitude, longitude };
        if (trackingRef.current === "RUNNING") {
            animateCounterRef.current += 1;

            // animate every 4 GPS updates (~every 4 seconds if timeInterval=1000)
            if (animateCounterRef.current === 1 || animateCounterRef.current % 4 === 0) {
                mapRef.current?.animateToRegion(
                {
                    latitude: point.latitude,
                    longitude: point.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                },
                400
                );
            }
        }

        setRoute((prev) => (prev.length === 0 ? [point] : [...prev, point]));

        if (lastPointRef.current) {
          const d = haversineKm(lastPointRef.current, point);
          // ignore micro-jitter
          if (d >= 0.001) setDistanceKm((km) => km + d);
        }
        lastPointRef.current = point;
      }
    );
  };

  const stopLocationWatch = () => {
    watchSubRef.current?.remove();
    watchSubRef.current = null;
  };

  useEffect(() => {
    (async () => {
      const fg = await Location.requestForegroundPermissionsAsync();
      setPermissionGranted(fg.status === "granted");
    })();

    return () => {
      stopTimer();
      stopLocationWatch();
    };
  }, []);

  const onStart = async () => {
    lastPointRef.current = null;
    setRoute([]);
    setDistanceKm(0);
    setSeconds(0);

    animateCounterRef.current = 0;

    trackingRef.current = "RUNNING";
    setTracking("RUNNING");
    startTimer();

    await startLocationWatch();
  };

  const onPause = () => {
    trackingRef.current = "PAUSED";
    setTracking("PAUSED");
    stopTimer();
    stopLocationWatch();
  };

  const onResume = async () => {
    animateCounterRef.current = 0;
    trackingRef.current = "RUNNING";
    setTracking("RUNNING");
    startTimer();
    await startLocationWatch();
  };

  const onFinish = () => {
    // Here you’d save the run to state/db; for now just go back.
    stopTimer();
    stopLocationWatch();

    trackingRef.current = "IDLE";
    setTracking("IDLE");
    // TODO: pass stats somewhere (router params, store, context)
    router.back();
  };

  const onCancel = () => {
    stopTimer();
    stopLocationWatch();

    trackingRef.current = "IDLE";
    setTracking("IDLE");

    router.back();
  };

  if (permissionGranted === null) {
    return (
        <View className="flex-1 bg-zinc-950 items-center justify-center">
        <Text className="text-white font-bold">Requesting location…</Text>
        </View>
    );
}

  if (permissionGranted === false) {
    return (
      <View className="flex-1 bg-zinc-950 items-center justify-center px-6">
        <Text className="text-white text-lg font-bold mb-2">Location permission needed</Text>
        <Text className="text-zinc-400 text-center mb-6">
          Enable location access to track distance, pace, and show your run route.
        </Text>
        <Pressable onPress={onCancel} className="bg-white/10 px-4 py-3 rounded-xl">
          <Text className="text-white font-bold">Go back</Text>
        </Pressable>
      </View>
    );
  }

  const center = route[route.length - 1] ?? {
    latitude: 49.2827, // fallback Vancouver-ish
    longitude: -123.1207,
  };

  return (
    <View className="flex-1 bg-zinc-950">
      {/* Map */}
      <View className="flex-1">
        <MapView
          ref={(r) => (mapRef.current = r)}
          style={{ flex: 1 }}
          initialRegion={{
            latitude: center.latitude,
            longitude: center.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation
          followsUserLocation={tracking === "RUNNING"}
          showsMyLocationButton
        >
          {route.length >= 2 && (
            <Polyline coordinates={route} strokeWidth={5} strokeColor="#FF7A00" />
          )}
          {route.length >= 1 && (
            <Marker coordinate={route[route.length - 1]} />
          )}
        </MapView>
      </View>

      {/* Stats overlay */}
      <View
        className="absolute left-0 right-0"
        style={{ top: Platform.OS === "ios" ? 60 : 40 }}
      >
        <View className="mx-4 bg-black/70 border border-white/10 rounded-2xl p-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-zinc-400 text-xs font-bold uppercase">Distance</Text>
              <Text className="text-white text-4xl font-black tabular-nums">{distanceKm.toFixed(2)} km</Text>
            </View>
            <View className="items-end">
              <Text className="text-zinc-400 text-xs font-bold uppercase">Pace</Text>
              <Text className="text-white text-3xl font-black tabular-nums">{pace}/km</Text>
            </View>
          </View>

          <View className="mt-3 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.7)" />
              <Text className="text-white/80 font-bold tabular-nums">{formatTime(seconds)}</Text>
            </View>
            <Text className="text-white/60 font-bold">{workoutType ?? "RUN"}</Text>
          </View>

          <Text className="text-white/60 text-xs mt-1">
        acc: {lastAccuracy?.toFixed(0) ?? "--"}m • speed: {lastSpeed?.toFixed(2) ?? "--"} m/s
        </Text>

        </View>
      </View>

      {/* Controls */}
      <View className="absolute left-0 right-0 bottom-0 pb-10">
        <View className="mx-6 mb-6 flex-row items-center justify-between">
          <Pressable onPress={onCancel} className="bg-white/10 px-4 py-3 rounded-xl">
            <Text className="text-white font-bold">Cancel</Text>
          </Pressable>

          {tracking === "IDLE" && (
            <Pressable onPress={onStart} className="bg-orange-500 px-6 py-4 rounded-2xl">
              <Text className="text-white font-black text-lg">Start</Text>
            </Pressable>
          )}

          {tracking === "RUNNING" && (
            <Pressable onPress={onPause} className="bg-white px-6 py-4 rounded-2xl">
              <Text className="text-black font-black text-lg">Pause</Text>
            </Pressable>
          )}

          {tracking === "PAUSED" && (
            <View className="flex-row gap-3">
              <Pressable onPress={onResume} className="bg-white px-5 py-4 rounded-2xl">
                <Text className="text-black font-black text-lg">Resume</Text>
              </Pressable>
              <Pressable onPress={onFinish} className="bg-orange-500 px-5 py-4 rounded-2xl">
                <Text className="text-white font-black text-lg">Finish</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
