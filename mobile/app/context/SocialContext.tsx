import { createContext, useContext, useState, ReactNode } from "react";

export type SocialPost = {
  id: string;
  userName: string;
  userAvatar: string;
  date: string;
  imageUri: string;
  typeLabel: "RUN";
  distanceKm: number;
  caption: string;
  minutesAgo: number;
};

type SocialContextType = {
  posts: SocialPost[];
  addPost: (post: SocialPost) => void;
};

const SocialContext = createContext<SocialContextType | null>(null);

export function SocialProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<SocialPost[]>([]);

  const addPost = (post: SocialPost) => {
    setPosts((prev) => [post, ...prev]);
  };

  return (
    <SocialContext.Provider value={{ posts, addPost }}>
      {children}
    </SocialContext.Provider>
  );
}

export function useSocial() {
  const ctx = useContext(SocialContext);
  if (!ctx) throw new Error("useSocial must be used inside SocialProvider");
  return ctx;
}
