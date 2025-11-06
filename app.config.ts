import { ExpoConfig, ConfigContext } from 'expo/config';
import { execSync } from 'node:child_process';

export default ({ config }: ConfigContext): ExpoConfig => {
  let gitSha = 'dev';
  try {
    gitSha = process.env.EAS_BUILD_GIT_COMMIT_HASH
      || execSync('git rev-parse HEAD').toString().trim();
  } catch {
  }

  const name = config.name ?? 'EasyFinder';
  const slug = config.slug ?? 'EasyFinder';

  return {
    ...config,
    name,
    slug,
    extra: {
      ...(config.extra ?? {}),
      EXPO_PUBLIC_GIT_SHA: gitSha,
    },
  } as ExpoConfig;
};
