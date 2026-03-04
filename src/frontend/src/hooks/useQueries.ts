import { useQuery } from "@tanstack/react-query";
import type { CoupleInfo, LoveLetter, TimelineMilestone } from "../backend.d";
import { useActor } from "./useActor";

const FALLBACK_COUPLE_INFO: CoupleInfo = {
  partner1Name: "Jeeya",
  partner2Name: "Anuj",
  anniversaryDate: "September 25, 2025",
  tagline: "Six months of love, laughter, and forever in the making",
};

const FALLBACK_LOVE_LETTER: LoveLetter = {
  content:
    "My baby Anuj,\n\nFrom the moment you became mine on September 25, my world has been more colourful, more joyful, and more complete. Every laugh we have shared, every quiet moment spent together, every little memory we have created — I hold all of it close to my heart.\n\nYou have a way of making even the simplest days feel like something worth remembering. I never knew love could feel this natural, this warm, and this real until I found it with you.\n\nAs we reach six months together on March 25, I want you to know that every single day with you has been a gift. Here is to many more months, many more smiles, and a lifetime of us.\n\nAlways yours,\nJeeya",
  recipient: "Anuj",
  author: "Jeeya",
};

export function useCoupleInfo() {
  const { actor } = useActor();
  return useQuery<CoupleInfo>({
    queryKey: ["coupleInfo"],
    queryFn: async () => {
      if (!actor) return FALLBACK_COUPLE_INFO;
      try {
        return await actor.getCoupleInfo();
      } catch {
        return FALLBACK_COUPLE_INFO;
      }
    },
    enabled: true,
    staleTime: 1000 * 60 * 5,
    placeholderData: FALLBACK_COUPLE_INFO,
  });
}

export function useLoveLetter() {
  const { actor } = useActor();
  return useQuery<LoveLetter>({
    queryKey: ["loveLetter"],
    queryFn: async () => {
      if (!actor) return FALLBACK_LOVE_LETTER;
      try {
        return await actor.getLoveLetter();
      } catch {
        return FALLBACK_LOVE_LETTER;
      }
    },
    enabled: true,
    staleTime: 1000 * 60 * 5,
    placeholderData: FALLBACK_LOVE_LETTER,
  });
}

export function useTimelineMilestones() {
  const { actor } = useActor();
  return useQuery<TimelineMilestone[]>({
    queryKey: ["timelineMilestones"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getTimelineMilestones();
      } catch {
        return [];
      }
    },
    enabled: true,
    staleTime: 1000 * 60 * 5,
    placeholderData: [],
  });
}

// Keep for backward compatibility but no longer used in UI
export function useReasonsList() {
  const { actor } = useActor();
  return useQuery<string[]>({
    queryKey: ["reasonsList"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReasonsList();
    },
    enabled: true,
    staleTime: 1000 * 60 * 5,
  });
}
