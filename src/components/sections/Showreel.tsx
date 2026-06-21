import React from 'react';
import { Play } from 'lucide-react';

export const Showreel = () => {
  return (
    <section className="relative py-24 px-6 md:px-12 flex flex-col items-center justify-center bg-[#F5F7FA] border-y border-[#7F7F7F]/20">
      <div className="w-full max-w-6xl mx-auto rounded border border-[#7F7F7F]/40 relative overflow-hidden group shadow-md hover:shadow-lg transition-shadow">
        <div className="relative w-full h-64 sm:h-80 md:h-[500px] bg-[#333333] flex flex-col items-center justify-center">
          <div className="absolute inset-0 bg-[url('/video_frames/ezgif-frame-001.jpg')] bg-cover bg-center bg-no-repeat transition-transform duration-10000 hover:scale-110 opacity-70"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent opacity-80"></div>
          
          <button className="relative z-10 w-16 h-16 rounded-full border border-[#FFFFFF]/40 bg-[#FFFFFF]/10 flex items-center justify-center text-[#FFFFFF] hover:bg-[#00A651] hover:border-[#00A651] transition-all duration-300 shadow-[0_0_15px_rgba(0, 166, 81,0)] hover:shadow-[0_0_20px_rgba(0, 166, 81,0.5)]">
            <Play className="w-6 h-6 ml-1 fill-current" />
          </button>
        </div>

        {/* Overlay elements like duration indicator or specs */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-[9px] text-[#FFFFFF] px-3 py-1.5 bg-[#1A1A1A]/70 backdrop-blur-md rounded border border-[#FFFFFF]/20 font-semibold">
          <div className="flex items-center gap-2">
            <Play className="w-3 h-3 text-[#00A651] fill-current" />
            <span>CORPORATE_OVERVIEW_2026.MP4</span>
          </div>
          <div className="text-[#7F7F7F]">SEC: 02:44 / SIZE: 44.5MB</div>
        </div>
      </div>
    </section>
  );
};
