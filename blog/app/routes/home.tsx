import type { Route } from "./+types/home";
import {
  Equalizer,
  LoadingSpinner,
  ProgressBar,
  msToMinsAndSecs,
} from "@dallascarraher/ui";
import { useSpotify } from "../hooks/useSpotify";
import { siGithub, siSpotify } from "simple-icons";
import { Linkedin } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dallas Carraher" },
    { name: "description", content: "Personal website of Dallas Carraher" },
  ];
}

export default function Home() {
  const { data: currentlyPlaying, isLoading } = useSpotify();

  // Derived state (mocked for now)
  const artists = currentlyPlaying?.item?.artists;
  const trackName = currentlyPlaying?.item?.name;
  const albumImg = currentlyPlaying?.item?.album?.images[0]?.url;
  const trackLink = currentlyPlaying?.item?.external_urls?.spotify;
  const mediaType = currentlyPlaying?.currently_playing_type;
  const progress = currentlyPlaying?.progress_ms;
  const duration = currentlyPlaying?.item?.duration_ms;

  const songProgress = progress && duration && (progress / duration) * 100;
  const tsCurrent = progress && msToMinsAndSecs(progress);
  const tsTotal = duration && msToMinsAndSecs(duration);

  return (
    <div className="min-h-full flex flex-col">
      {/* Header Section */}
      <header className="w-full bg-cover bg-center bg-no-repeat pt-8 pb-6 px-4">
        <div className="max-w-screen-sm mx-auto flex flex-col items-center">
          <div className="w-40 h-40 md:w-56 md:h-56">
            <img
              src="https://github.com/DallasCarraher.png"
              alt="A picture of me"
              className="w-full h-full select-none rounded-full"
            />
          </div>
          <h1 className="text-2xl md:text-3xl p-3 font-bold text-gray-900 dark:text-white">
            Dallas Carraher
          </h1>

          {/* Spotify Section */}
          <div className="flex flex-col mt-6 md:mt-8 text-center items-center min-h-25 w-full px-4">
            {isLoading ? (
              <LoadingSpinner />
            ) : currentlyPlaying ? (
              <>
                <div className="flex gap-2">
                  {albumImg ? (
                    <a href={trackLink} target="_blank" rel="noreferrer">
                      <img
                        src={albumImg}
                        alt="album art"
                        className="h-10 m-0 rounded border-green-500 border-2"
                      />
                    </a>
                  ) : (
                    <svg
                      role="img"
                      viewBox="0 0 24 24"
                      className="h-7 pr-3"
                      fill={`#${siSpotify.hex}`}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <title>{siSpotify.title}</title>
                      <path d={siSpotify.path} />
                    </svg>
                  )}
                  <Equalizer />
                </div>
                <div className="pt-2 pb-1 flex flex-col items-center text-gray-700 dark:text-gray-300 max-w-full">
                  {mediaType === "episode" && <div>Listening to a Podcast</div>}
                  {mediaType === "track" && (
                    <>
                      <div className="font-medium text-sm md:text-base px-2 wrap-break-word text-center">
                        "{trackName}" -{" "}
                        {artists?.map((artist: any, idx: number) => (
                          <span key={idx}>
                            {artist.name}
                            {idx < artists.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </div>
                      <div className="mt-1 w-full max-w-xs">
                        <ProgressBar
                          bg="#1DB954"
                          percent={songProgress?.toString()}
                        />
                      </div>
                      <span className="text-xs mt-1">{`${tsCurrent} / ${tsTotal}`}</span>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="text-gray-500 flex items-center gap-2 text-sm md:text-base">
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  className="h-6 opacity-50"
                  fill={`#${siSpotify.hex}`}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>{siSpotify.title}</title>
                  <path d={siSpotify.path} />
                </svg>
                <span>Not playing anything</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - grows to push footer down */}
      <main className="grow max-w-screen-sm px-6 mx-auto w-full">
        <div className="py-8 md:py-12">
          <p className="text-center text-gray-500 text-sm md:text-base">
            (Blog posts will go here)
          </p>
        </div>
      </main>

      {/* Footer - stays at bottom */}
      <footer className="w-full mt-auto border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-screen-sm px-6 mx-auto py-6 md:py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-xs md:text-sm">
            <span>© {new Date().getFullYear()} Dallas Carraher</span>
          </div>
          <div className="flex gap-3">
            <a
              href="https://github.com/DallasCarraher"
              rel="noreferrer"
              target="_blank"
              aria-label="GitHub"
              className="flex items-center justify-center h-9 w-9 bg-slate-200 dark:bg-slate-700 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              <svg
                role="img"
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-slate-700 dark:fill-slate-200"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>{siGithub.title}</title>
                <path d={siGithub.path} />
              </svg>
            </a>
            <a
              href="https://linkedin.com/in/dallascarraher"
              rel="noreferrer"
              target="_blank"
              aria-label="LinkedIn"
              className="flex items-center justify-center h-9 w-9 bg-slate-200 dark:bg-slate-700 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              <Linkedin className="h-4 w-4 text-slate-700 dark:text-slate-200" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
