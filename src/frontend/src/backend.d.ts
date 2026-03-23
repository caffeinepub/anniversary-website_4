import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
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
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getBackgroundMusicKey(): Promise<ExternalBlob | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCoupleInfo(): Promise<CoupleInfo>;
    getLoveLetter(): Promise<LoveLetter>;
    getReasonsList(): Promise<Array<string>>;
    getTimelineMilestones(): Promise<Array<TimelineMilestone>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setBackgroundMusicKey(blob: ExternalBlob): Promise<void>;
    updateCoupleInfo(newInfo: CoupleInfo): Promise<void>;
    updateLoveLetter(newLetter: LoveLetter): Promise<void>;
    updateReasonsList(newReasons: Array<string>): Promise<void>;
    updateTimelineMilestones(newMilestones: Array<TimelineMilestone>): Promise<void>;
}
