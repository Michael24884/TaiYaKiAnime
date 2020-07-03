
import androidLogo from '../assets/androidLogo.png';
import appleLogo from '../assets/appleLogo.png';
import githubLogo from '../assets/githubLogo.png';


export type PlatformTypes = "android" | "ios" | "github"; 

export const platformToText: Map<PlatformTypes, string> = new Map([
    ["android", "Android"],
    ["ios", "iOS"],
    ["github", "Github"],
]);

export const platformToIcon: Map<PlatformTypes, string> = new Map([
    ["android", androidLogo],
    ["ios", appleLogo],
    ["github", githubLogo],
]);