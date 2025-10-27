
export const platformConfig = {
  twitter: {
    maxLength: 280,
  },
  linkedin: {
    maxLength: 1300,
  },
  devto: {
    maxLength: 10000,
  },
  generic: {
    maxLength: Infinity,
  },
};

export function getPlatformConfig(platform: string) {
  return platformConfig[platform as keyof typeof platformConfig] || platformConfig.generic;
}
