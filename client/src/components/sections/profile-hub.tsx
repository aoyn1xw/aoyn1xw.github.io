import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  ExternalLink,
  Gamepad2,
  Github,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Music2,
  Send,
  Users,
} from "lucide-react";

interface GithubProfile {
  login: string;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  location: string | null;
  followers: number;
  public_repos: number;
}

interface GithubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  pushed_at: string;
}

interface LanyardResponse {
  success: boolean;
  data: {
    discord_status: "online" | "idle" | "dnd" | "offline";
    activities: Array<{
      type: number;
      name: string;
      details?: string;
      state?: string;
    }>;
    spotify: {
      song: string;
      artist: string;
      track_id: string;
      album_art_url: string;
    } | null;
  };
}

const GITHUB_USERNAME = "aoyn1xw";
const DISCORD_USER_ID =
  (import.meta.env.VITE_DISCORD_USER_ID as string | undefined) ?? "1212875920948592653";
const LOCAL_ASSETS = {
  backgroundVideo: "/assets/snaptik_7629726366056959265_hd.mp4",
  backgroundVideoFallback: "/assets/background.mp4",
  backgroundImage: "/assets/background.jpg",
  backgroundImageAlt: "/assets/background.webp",
  cursor: "/assets/Frame_2.webp",
  cursorFallback: "/assets/cursor.webp",
  avatar: "/assets/avatar.png",
};

const socialLinks = [
  { label: "Steam", href: "https://steamcommunity.com/id/ayonlxw", icon: Gamepad2 },
  { label: "Discord", href: "https://discord.com/users/1212875920948592653", icon: MessageCircle },
  { label: "PlayStation", href: "https://psnprofiles.com/ayonlxw", icon: Gamepad2 },
  { label: "GitHub", href: "https://github.com/aoyn1xw", icon: Github },
  { label: "Telegram", href: "https://t.me/ayonlxw", icon: Send },
  { label: "X", href: "https://x.com/@aoyn1xw", icon: Send },
  { label: "Instagram", href: "https://instagram.com/ayonlxw", icon: Instagram },
  { label: "TikTok", href: "https://tiktok.com/@ayonlxw", icon: Music2 },
  { label: "Mail", href: "mailto:ayon1xw@proton.me", icon: Mail },
];

export default function ProfileHub() {
  const { data: profile } = useQuery<GithubProfile>({
    queryKey: ["github-profile", GITHUB_USERNAME],
    queryFn: async () => {
      const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
      if (!response.ok) {
        throw new Error("Failed to fetch GitHub profile");
      }
      return response.json();
    },
  });

  const githubAvatar = profile?.avatar_url ?? "https://github.com/aoyn1xw.png";

  const { data: repos } = useQuery<GithubRepo[]>({
    queryKey: ["github-repos-hub", GITHUB_USERNAME],
    queryFn: async () => {
      const response = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=4`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch repositories");
      }
      return response.json();
    },
  });

  const { data: discordData } = useQuery<LanyardResponse>({
    queryKey: ["discord-presence", DISCORD_USER_ID],
    queryFn: async () => {
      const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
      if (!response.ok) {
        throw new Error("Failed to fetch Discord presence");
      }
      return response.json();
    },
    enabled: Boolean(DISCORD_USER_ID),
    refetchInterval: 30000,
  });

  const spotify = discordData?.data.spotify;

  return (
    <div
      className="min-h-screen bg-black text-white"
      style={{
        cursor: `url('${LOCAL_ASSETS.cursor}') 8 8, url('${LOCAL_ASSETS.cursorFallback}') 8 8, auto`,
      }}
    >
      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('${LOCAL_ASSETS.backgroundImage}'), url('${LOCAL_ASSETS.backgroundImageAlt}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          >
            <source src={LOCAL_ASSETS.backgroundVideo} type="video/mp4" />
            <source src={LOCAL_ASSETS.backgroundVideoFallback} type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-6 py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-xl rounded-3xl border border-white/25 bg-black/55 p-6 md:p-8 backdrop-blur-xl"
          >
            <div className="flex flex-col items-center text-center">
              <img
                src={LOCAL_ASSETS.avatar}
                alt="aoyn1xw avatar"
                className="h-28 w-28 rounded-full border-2 border-white/60 object-cover shadow-2xl"
                onError={(event) => {
                  event.currentTarget.src = githubAvatar;
                }}
              />

              <h1 className="mt-5 text-4xl font-bold tracking-tight">{profile?.login ?? "aoyn1xw"}</h1>

              <p className="mt-3 max-w-md text-base text-white/85">
                {profile?.bio ?? "student dev & open-source contributor"}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-white/85">
                {profile?.location ? (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {profile.location}
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {profile?.followers ?? 0} followers
                </span>
                <span>{profile?.public_repos ?? 0} repos</span>
              </div>

              {spotify ? (
                <div className="mt-6 w-full rounded-2xl border border-white/20 bg-white/10 p-4 text-left">
                  <div className="flex items-center gap-3">
                    <img
                      src={spotify.album_art_url}
                      alt="album art"
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <p className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-emerald-300">
                        <Music2 className="h-3.5 w-3.5" />
                        Listening on Spotify
                      </p>
                      <p className="truncate font-semibold">{spotify.song}</p>
                      <p className="truncate text-sm text-white/75">{spotify.artist}</p>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("mailto:") ? "_self" : "_blank"}
                    rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white/90 transition hover:-translate-y-0.5 hover:bg-white/20"
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>

              <a
                href={profile?.html_url ?? "https://github.com/aoyn1xw"}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-5 py-2.5 text-sm font-semibold transition hover:bg-white/20"
              >
                View Full GitHub <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="projects" className="relative z-10 border-t border-white/15 bg-black/85 py-16">
        <div className="mx-auto w-full max-w-5xl px-6">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Latest GitHub Work</h2>
          <p className="mt-2 text-sm text-white/70">
            Live repositories sorted by recent updates.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {repos?.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-white/15 bg-white/5 p-5 transition hover:-translate-y-0.5 hover:bg-white/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="line-clamp-1 text-lg font-semibold">{repo.name.replace(/-/g, " ")}</h3>
                  <span className="text-xs text-white/70">★ {repo.stargazers_count}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-white/75">
                  {repo.description ?? "No description provided."}
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.11em] text-white/55">
                  Updated {new Date(repo.pushed_at).toLocaleDateString()}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
