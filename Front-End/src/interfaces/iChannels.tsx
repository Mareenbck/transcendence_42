export interface UserMute {
    id: number;
    username: string;
    mute: UserMute[];
    unMute: UserMute[];
}