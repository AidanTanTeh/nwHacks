import React, { useMemo } from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import { Flame, Trophy, Crown } from "lucide-react-native";

type Friend = {
  id: string;
  name: string;
  avatar: string;
  currentStreak: number;
  totalWorkouts: number;
};

type User = Friend;

const mockCurrentUser: User = {
  id: "me",
  name: "Alex Runner",
  avatar: "https://picsum.photos/200",
  currentStreak: 5,
  totalWorkouts: 47,
};

const mockFriends: Friend[] = [
  { id: "1", name: "Mike Marathon", avatar: "https://picsum.photos/201", currentStreak: 15, totalWorkouts: 134 },
  { id: "2", name: "Sarah Sprinter", avatar: "https://picsum.photos/202", currentStreak: 8, totalWorkouts: 62 },
  { id: "3", name: "Jess Jogger", avatar: "https://picsum.photos/203", currentStreak: 3, totalWorkouts: 28 },
  { id: "4", name: "Tom Trail", avatar: "https://picsum.photos/204", currentStreak: 1, totalWorkouts: 41 },
];

export default function RankScreen() {
  const allUsers = useMemo(() => {
    return [
      { ...mockCurrentUser, isCurrentUser: true },
      ...mockFriends.map((f) => ({ ...f, isCurrentUser: false })),
    ].sort((a, b) => b.currentStreak - a.currentStreak);
  }, []);

  const myRank = allUsers.findIndex((u) => u.isCurrentUser) + 1;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Trophy color="#F5B400" size={26} />
          <Text style={styles.title}>LEADERBOARD</Text>
        </View>
        <Text style={styles.subtitle}>Ranked by current streak</Text>
      </View>

      {/* Your rank card */}
      <View style={styles.rankCardWrap}>
        <View style={styles.rankCard}>
          <View style={styles.rankCardRow}>
            <View>
              <Text style={styles.rankCardLabel}>YOUR RANK</Text>
              <Text style={styles.rankCardBig}>#{myRank}</Text>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.rankCardLabel}>CURRENT STREAK</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Flame color="#fff" size={20} />
                <Text style={styles.rankCardBig}>{mockCurrentUser.currentStreak}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* List */}
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
        data={allUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const isTop3 = index < 3;
          const isMe = item.isCurrentUser;

          const rankColor =
            index === 0 ? "#F5B400" : index === 1 ? "rgba(255,255,255,0.55)" : index === 2 ? "#FF7A00" : "rgba(255,255,255,0.35)";

          return (
            <View style={[styles.row, isMe && styles.rowMe]}>
              {/* Rank */}
              <View style={{ width: 34, alignItems: "center", marginRight: 10 }}>
                {index === 0 ? <Crown color={rankColor} size={22} /> : <Text style={[styles.rankNum, { color: rankColor }]}>{index + 1}</Text>}
              </View>

              {/* Avatar */}
              <View style={{ marginRight: 12 }}>
                <Image
                  source={{ uri: item.avatar }}
                  style={[
                    styles.avatar,
                    isTop3 && {
                      borderWidth: 2,
                      borderColor: index === 0 ? "#F5B400" : index === 1 ? "rgba(255,255,255,0.55)" : "#FF7A00",
                    },
                  ]}
                />
              </View>

              {/* Name */}
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>
                  {item.name}
                  {isMe ? <Text style={{ color: "#FF7A00" }}> (You)</Text> : null}
                </Text>
                <Text style={styles.meta}>{item.totalWorkouts} workouts</Text>
              </View>

              {/* Streak */}
              <View style={{ alignItems: "flex-end" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Flame color="#FF7A00" size={16} />
                  <Text style={styles.streakNum}>{item.currentStreak}</Text>
                </View>
                <Text style={styles.days}>DAYS</Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0C0E" },

  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 12 },
  title: { color: "#fff", fontSize: 26, fontWeight: "900" },
  subtitle: { marginTop: 6, color: "rgba(255,255,255,0.6)", fontSize: 14 },

  rankCardWrap: { paddingHorizontal: 24, paddingBottom: 18 },
  rankCard: {
    backgroundColor: "#FF7A00",
    borderRadius: 18,
    padding: 16,
  },
  rankCardRow: { flexDirection: "row", justifyContent: "space-between" },
  rankCardLabel: { color: "rgba(255,255,255,0.75)", fontSize: 12, fontWeight: "800" },
  rankCardBig: { color: "#fff", fontSize: 38, fontWeight: "900" },

  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.02)",
    marginBottom: 10,
  },
  rowMe: {
    backgroundColor: "rgba(255,122,0,0.14)",
    borderWidth: 2,
    borderColor: "#FF7A00",
  },

  rankNum: { fontSize: 18, fontWeight: "900" },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: "#222" },

  name: { color: "#fff", fontSize: 16, fontWeight: "800" },
  meta: { marginTop: 2, color: "rgba(255,255,255,0.55)", fontSize: 12, fontWeight: "600" },

  streakNum: { color: "#FF7A00", fontSize: 22, fontWeight: "900" },
  days: { marginTop: 2, color: "rgba(255,255,255,0.45)", fontSize: 10, fontWeight: "900", letterSpacing: 1 },
});
