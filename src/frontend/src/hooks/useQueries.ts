import { useQuery } from "@tanstack/react-query";
import type { CoupleInfo, LoveLetter, TimelineMilestone } from "../backend.d";
import { useActor } from "./useActor";

export function useCoupleInfo() {
  const { actor } = useActor();
  return useQuery<CoupleInfo>({
    queryKey: ["coupleInfo"],
    queryFn: async () => {
      if (!actor) {
        return {
          partner1Name: "Jeeya",
          partner2Name: "Anuj",
          anniversaryDate: "September 25, 2025",
          tagline:
            "Every day with you is a blessing I never want to take for granted.",
        };
      }
      return actor.getCoupleInfo();
    },
    enabled: true,
    staleTime: 1000 * 60 * 5,
  });
}

export function useLoveLetter() {
  const { actor } = useActor();
  return useQuery<LoveLetter>({
    queryKey: ["loveLetter"],
    queryFn: async () => {
      if (!actor) return { content: "", recipient: "", author: "" };
      return actor.getLoveLetter();
    },
    enabled: true,
    staleTime: 1000 * 60 * 5,
  });
}

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

export function useTimelineMilestones() {
  const { actor } = useActor();
  return useQuery<TimelineMilestone[]>({
    queryKey: ["timelineMilestones"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTimelineMilestones();
    },
    enabled: true,
    staleTime: 1000 * 60 * 5,
  });
}
