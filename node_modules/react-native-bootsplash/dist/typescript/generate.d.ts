export declare const generate: ({ android, ios, workingDirectory, logoPath, backgroundColor, logoWidth, assetsPath, }: {
    android: {
        sourceDir: string;
        appName: string;
    } | null;
    ios: {
        projectPath: string;
    } | null;
    workingDirectory: string;
    logoPath: string;
    backgroundColor: string;
    logoWidth: number;
    assetsPath?: string | undefined;
}) => Promise<void>;
