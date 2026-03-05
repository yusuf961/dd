import type { TrendyolBridge } from './index';

declare global {
  interface Window {
    trendyol: TrendyolBridge;
  }
}

export {};
