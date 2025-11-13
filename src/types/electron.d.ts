/**
 * Electron 환경 타입 정의
 */

export interface ElectronAPI {
  platform: string;
  minimize: () => void;
  maximize: () => void;
  close: () => void;
  isMaximized: () => Promise<boolean>;
  onMaximizeChange: (callback: (isMaximized: boolean) => void) => void;
}

declare global {
  interface Window {
    electron?: ElectronAPI;
  }
}
