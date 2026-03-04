import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TimelineMilestone {
    title: string;
    date: string;
    description: string;
}
export interface LoveLetter {
    content: string;
    recipient: string;
    author: string;
}
export interface CoupleInfo {
    anniversaryDate: string;
    tagline: string;
    partner2Name: string;
    partner1Name: string;
}
export interface backendInterface {
    getCoupleInfo(): Promise<CoupleInfo>;
    getLoveLetter(): Promise<LoveLetter>;
    getReasonsList(): Promise<Array<string>>;
    getTimelineMilestones(): Promise<Array<TimelineMilestone>>;
    updateCoupleInfo(newInfo: CoupleInfo): Promise<void>;
    updateLoveLetter(newLetter: LoveLetter): Promise<void>;
    updateReasonsList(newReasons: Array<string>): Promise<void>;
    updateTimelineMilestones(newMilestones: Array<TimelineMilestone>): Promise<void>;
}
