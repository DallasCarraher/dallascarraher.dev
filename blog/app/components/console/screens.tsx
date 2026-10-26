import type { ReactNode } from "react";
import { posts, projects, socialLinks } from "../../content/site";
import { useSpotify } from "../../hooks/useSpotify";

export function ScreenHeading({ title }: { title: string }) {
  return <h1 tabIndex={-1}>{title}</h1>;
}
function EmptyState({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon" aria-hidden="true">
        {icon}
      </span>
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}
export function About() {
  return (
    <section className="content-page">
      <ScreenHeading title="About me" />
      <div className="profile-card">
        <div className="portrait-frame">
          <img
            src="https://github.com/DallasCarraher.png"
            alt="Dallas Carraher"
            width="112"
            height="112"
          />
        </div>
        <div>
          <h2>Dallas Carraher</h2>
          <span className="profile-status">
            <i /> Online, somewhere.
          </span>
        </div>
      </div>
      <p className="intro-copy">Welcome to my little corner of the internet.</p>
      <p className="body-copy">
        A place for things I make, notes along the way, and whatever’s on repeat.
      </p>
    </section>
  );
}
export function Projects() {
  return (
    <section className="content-page">
      <ScreenHeading title="Projects" />
      {projects.length ? (
        <div className="entry-list">
          {projects.map((project) =>
            project.href ? (
              <a key={project.title} className="entry-card" href={project.href} target="_blank" rel="noreferrer">
                <h2>{project.title}</h2>
                <p>{project.description}</p>
                <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <article key={project.title} className="entry-card">
                <h2>{project.title}</h2>
                <p>{project.description}</p>
                <div className="coming-soon" aria-label="Coming soon">
                  <span aria-hidden="true" />
                </div>
              </article>
            ),
          )}
        </div>
      ) : (
        <EmptyState icon="▤" title="No saved projects yet">
          This memory card is waiting for its first save.
        </EmptyState>
      )}
      <a className="text-link" href={socialLinks[0].href} target="_blank" rel="noreferrer">
        Explore my GitHub <span aria-hidden="true">↗</span>
      </a>
    </section>
  );
}
export function Blog() {
  return (
    <section className="content-page">
      <ScreenHeading title="Blog" />
      {posts.length ? (
        <div className="entry-list">
          {posts.map((post) => (
            <a className="entry-card" href={post.href} key={post.href}>
              <time dateTime={post.date}>{post.date}</time>
              <h2>{post.title}</h2>
              <span aria-hidden="true">→</span>
            </a>
          ))}
        </div>
      ) : (
        <EmptyState icon="≡" title="No posts yet">
          Notes, ideas, and things worth saving. Coming when they’re ready.
        </EmptyState>
      )}
    </section>
  );
}
function timestamp(ms: number) {
  const seconds = Math.floor(Math.max(0, ms) / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
export function NowPlaying() {
  const { data, isLoading, error } = useSpotify();
  const item = data?.item;
  const playing = data?.is_playing;
  const podcast = data?.currently_playing_type === "episode";
  const progress = Math.min(data?.progress_ms ?? 0, item?.duration_ms ?? 0);
  return (
    <section className="content-page">
      <ScreenHeading title="Now playing" />
      <div className="player-status" role="status">
        {isLoading
          ? "CONNECTING TO SPOTIFY…"
          : error
            ? "SIGNAL UNAVAILABLE"
            : item
              ? playing
                ? "● PLAYING"
                : "Ⅱ PAUSED"
              : "○ STANDBY"}
      </div>
      {isLoading ? (
        <div className="player-placeholder">
          <div className="disc" aria-hidden="true" />
          <p>Finding the frequency…</p>
        </div>
      ) : error ? (
        <EmptyState icon="∿" title="A little quiet right now">
          Spotify couldn’t be reached. The player will try again shortly.
        </EmptyState>
      ) : item ? (
        <div className="player">
          <div className="album-wrap">
            {(item.album?.images?.[0]?.url ?? item.images?.[0]?.url) ? (
              <img
                src={item.album?.images?.[0]?.url ?? item.images?.[0]?.url}
                alt={`${item.name} artwork`}
                width="160"
                height="160"
              />
            ) : (
              <div className="disc" aria-hidden="true" />
            )}
            <div className={`equalizer ${playing ? "is-playing" : ""}`} aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <i key={i} />
              ))}
            </div>
          </div>
          <div className="track-info">
            <p className="small-label">{podcast ? "PODCAST" : "ON REPEAT"}</p>
            <h2>{item.name}</h2>
            <p>
              {podcast
                ? (item.show?.name ?? "Podcast episode")
                : item.artists?.map((artist) => artist.name).join(", ")}
            </p>
          </div>
          <div className="track-progress">
            <progress
              aria-label="Track progress"
              max={Math.max(item.duration_ms, 1)}
              value={progress}
            />
            <div>
              <span>{timestamp(progress)}</span>
              <span>{timestamp(item.duration_ms)}</span>
            </div>
          </div>
          {item.external_urls?.spotify && (
            <a
              className="text-link"
              href={item.external_urls.spotify}
              target="_blank"
              rel="noreferrer"
            >
              Open in Spotify <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      ) : (
        <EmptyState icon="♫" title="Nothing playing">
          The next track will appear here when I press play.
        </EmptyState>
      )}
    </section>
  );
}
export function Contact() {
  return (
    <section className="content-page">
      <ScreenHeading title="Stay connected" />
      <p className="body-copy">Find me on the other side.</p>
      <div className="contact-links">
        {socialLinks.map((link, index) => (
          <a href={link.href} key={link.href} target="_blank" rel="noreferrer">
            <span className="contact-index">0{index + 1}</span>
            <div>
              <h2>{link.label}</h2>
              <p>{link.handle}</p>
            </div>
            <span className="external-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
