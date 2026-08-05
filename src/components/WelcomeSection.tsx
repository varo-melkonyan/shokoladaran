"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export default function WelcomeSection() {
  const { t } = useTranslation();
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    const element = videoContainerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full py-12 bg-white flex items-center justify-center">
        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-12 px-4">
            {/* Left: Welcome Text */}
            <div className="flex-1">
            <h2 className="text-3xl font-bold text-chocolate mb-4">{t("welcome_title")}</h2>
            <p className="text-lg text-gray-700 max-w-xl">{t("welcome_messages")}</p>
            </div>
            {/* Right: Image */}
            <div ref={videoContainerRef} className="flex-1 flex justify-center items-center min-h-72">
                {shouldLoadVideo && (
                  <video
                      className="w-full max-h-[620px] rounded-xl"
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      aria-label={t("welcome_title")}
                  >
                    <source src="/assets/animation_chocolate.webm" type="video/webm" />
                  </video>
                )}
            </div>
      </div>
    </section>
  );
}
