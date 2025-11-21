declare module 'react-native-config' {
  export interface NativeConfig {
    GIT_BRANCH?: string;
    GIT_COMMIT?: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
