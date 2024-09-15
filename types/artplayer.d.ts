declare module 'artplayer' {
  export default class Artplayer {
    constructor(options: any);
    on(event: string, callback: Function): void;
    destroy(removeHtml?: boolean): void;
    notice: { show: string };
    hls: any;
    switchUrl(url: string): void;
    resize(): void;
  }
}

declare module 'artplayer-plugin-hls-quality' {
  function artplayerPluginHlsQuality(options: any): (art: any) => void;
  export = artplayerPluginHlsQuality;
}