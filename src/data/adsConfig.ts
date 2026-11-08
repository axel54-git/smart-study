export interface AdPlacementConfig {
  id: string;
  name: string;
  key: string;
  scriptUrl: string;
  width: number;
  height: number;
  format: string;
  enabled: boolean;
  customCode?: string;
}

export interface AdsSystemConfig {
  globalEnabled: boolean;
  redBanner: AdPlacementConfig;
  greenBanner: AdPlacementConfig;
  socialBar?: AdPlacementConfig;
}

export const DEFAULT_ADS_CONFIG: AdsSystemConfig = {
  globalEnabled: true,
  redBanner: {
    id: 'red_banner',
    name: 'লাল দাগ ব্যানার (৪০০×৬০ - কার্ডের মাঝে ও ভিডিও উপরে/নিচে)',
    key: '5febadcb47e71b73b1202fd206a76c5c',
    scriptUrl: 'https://bauval.org/22/5febadcb47e71b73b1202fd206a76c5c',
    width: 400,
    height: 60,
    format: 'iframe',
    enabled: true,
    customCode: ''
  },
  greenBanner: {
    id: 'green_banner',
    name: 'সবুজ দাগ ব্যানার (ভিডিও পেজ বটম সেকশন)',
    key: '911ee250303f0d466e6e2cab58b077e0',
    scriptUrl: 'https://bauval.org/22/911ee250303f0d466e6e2cab58b077e0',
    width: 300,
    height: 250,
    format: 'iframe',
    enabled: true,
    customCode: ''
  },
  socialBar: {
    id: 'social_bar',
    name: 'পপ আপ নোটিফিকেশন অ্যাড (শুধু ক্লাস লেকচার পেজে)',
    key: 'd5971812e8228bafc23fefa5e2dcedb5',
    scriptUrl: 'https://bauval.org/14/d5971812e8228bafc23fefa5e2dcedb5',
    width: 0,
    height: 0,
    format: 'social_bar',
    enabled: true,
    customCode: ''
  }
};
