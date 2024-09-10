"use client"
import React, { useEffect, useRef } from 'react';
import Artplayer from 'artplayer';
import Hls from 'hls.js';
import artplayerPluginHlsQuality from 'artplayer-plugin-hls-quality';

interface VideoPlayerProps {
  src: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
  const artRef = useRef<Artplayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const art = new Artplayer({
      container: containerRef.current,
      url: src,
      pip: true,
      flip: true,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      fullscreenWeb: true,
      miniProgressBar: true,
      autoSize: true,
      autoMini: true,
      autoOrientation: true,
      airplay: true,
      theme: '#23ade5', // This should match your primary color
      lang: navigator.language.toLowerCase(),
      setting: true,
      moreVideoAttr: {
        crossOrigin: 'anonymous',
      },
      controls: [
        {
          position: 'right',
          html: 'Quality',
          click: function () {
            art.setting.show = true;
            art.setting.toggle();
          },
        },
      ],
      settings: [
        {
          html: 'Quality',
          selector: [
            {
              html: 'Auto',
              default: true,
            },
          ],
          onSelect: function (item) {
            // Handle quality selection
            console.log(item);
          },
        },
      ],
      plugins: [
        artplayerPluginHlsQuality({
          control: false,
          setting: true,
          getResolution: (level) => level.height + 'P',
          title: 'Quality',
          auto: 'Auto',
        }),
      ],
      customType: {
        m3u8: function playM3u8(video, url, art) {
          if (Hls.isSupported()) {
            if (art.hls) art.hls.destroy();
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
            art.hls = hls;
            art.on('destroy', () => hls.destroy());
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
          } else {
            art.notice.show = 'Unsupported playback format: m3u8';
          }
        },
      },
    });

    artRef.current = art;

    return () => {
      if (artRef.current) {
        artRef.current.destroy(false);
      }
    };
  }, [src]);

  return (
    <div className="w-full h-0 pb-[56.25%] relative">
      <div ref={containerRef} className="absolute top-0 left-0 w-full h-full" />
    </div>
  );
};

export default VideoPlayer;