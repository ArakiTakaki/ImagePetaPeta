export interface Settings {
  dbDirectory: string,
  lowMemoryMode: boolean,
  darkMode: boolean,
  autoDarkMode: boolean,
  alwaysOnTop: boolean,
  enableHardwareAcceleration: boolean,
  showFPS: boolean,
  zoomSensitivity: number,
  moveSensitivity: number,
  autoHideUI: boolean
}
export const defaultSettings: Settings = {
  dbDirectory: "",
  lowMemoryMode: false,
  darkMode: false,
  autoDarkMode: true,
  alwaysOnTop: false,
  enableHardwareAcceleration: true,
  showFPS: false,
  zoomSensitivity: 100,
  moveSensitivity: 100,
  autoHideUI: false,
}
export function upgradeSettings(settings: Settings) {
  // バージョンアップで旧ファイルとの整合性を取る
  if (settings.zoomSensitivity === undefined) {
    settings.zoomSensitivity = 100;
  }
  if (settings.moveSensitivity === undefined) {
    settings.moveSensitivity = 100;
  }
  return settings;
}