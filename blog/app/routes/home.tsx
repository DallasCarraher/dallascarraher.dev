import type { Route } from "./+types/home";
import * as stylex from "@stylexjs/stylex";
import { Equalizer, LoadingSpinner, ProgressBar, msToMinsAndSecs } from "@dallascarraher/ui";
import { useSpotify } from "../hooks/useSpotify";
import { siGithub, siSpotify } from "simple-icons";
import { linkedIn } from "../icons/linkedin";
import { styles } from "./home.stylex";

export function meta(_args: Route.MetaArgs) {
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
    <div {...stylex.props(styles.page)}>
      {/* Header Section */}
      <header {...stylex.props(styles.header)}>
        <div {...stylex.props(styles.headerInner)}>
          <div {...stylex.props(styles.avatarWrap)}>
            <img
              src="https://github.com/DallasCarraher.png"
              alt="A picture of me"
              {...stylex.props(styles.avatarImg)}
            />
          </div>
          <h1 {...stylex.props(styles.heading)}>Dallas Carraher</h1>

          {/* Spotify Section */}
          <div {...stylex.props(styles.spotifySection)}>
            {isLoading ? (
              <LoadingSpinner />
            ) : currentlyPlaying ? (
              <>
                <div {...stylex.props(styles.trackRow)}>
                  {albumImg ? (
                    <a href={trackLink} target="_blank" rel="noreferrer">
                      <img src={albumImg} alt="album art" {...stylex.props(styles.albumArt)} />
                    </a>
                  ) : (
                    <svg
                      role="img"
                      viewBox="0 0 24 24"
                      {...stylex.props(styles.spotifyIcon)}
                      fill={`#${siSpotify.hex}`}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <title>{siSpotify.title}</title>
                      <path d={siSpotify.path} />
                    </svg>
                  )}
                  <Equalizer />
                </div>
                <div {...stylex.props(styles.trackInfo)}>
                  {mediaType === "episode" && <div>Listening to a Podcast</div>}
                  {mediaType === "track" && (
                    <>
                      <div {...stylex.props(styles.trackName)}>
                        "{trackName}" -{" "}
                        {artists?.map((artist: any, idx: number) => (
                          <span key={idx}>
                            {artist.name}
                            {idx < artists.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </div>
                      <div {...stylex.props(styles.progressBarWrap)}>
                        <ProgressBar bg="#1DB954" percent={songProgress?.toString()} />
                      </div>
                      <span {...stylex.props(styles.timestamp)}>{`${tsCurrent} / ${tsTotal}`}</span>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div {...stylex.props(styles.notPlaying)}>
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  {...stylex.props(styles.notPlayingIcon)}
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
      <main {...stylex.props(styles.main)}>
        <div {...stylex.props(styles.mainInner)}>
          <p {...stylex.props(styles.mainPlaceholder)}>(Blog posts will go here)</p>
        </div>
      </main>

      {/* Footer - stays at bottom */}
      <footer {...stylex.props(styles.footer)}>
        <div {...stylex.props(styles.footerInner)}>
          <div {...stylex.props(styles.copyright)}>
            <span>© {new Date().getFullYear()} Dallas Carraher</span>
          </div>
          <div {...stylex.props(styles.socialRow)}>
            <a
              href="https://github.com/DallasCarraher"
              rel="noreferrer"
              target="_blank"
              aria-label="GitHub"
              {...stylex.props(styles.socialLink)}
            >
              <svg
                role="img"
                viewBox="0 0 24 24"
                {...stylex.props(styles.socialIcon)}
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
              {...stylex.props(styles.socialLink)}
            >
              <svg
                role="img"
                viewBox={linkedIn.viewBox}
                {...stylex.props(styles.socialIcon)}
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>{linkedIn.title}</title>
                <path d={linkedIn.path} />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
