/**
 * YouTube URL → privacy-friendly embed URL, or null if it isn't YouTube. Supports:
 * - videos and live streams: watch?v=, youtu.be/, /live/, /shorts/, /embed/
 * - a channel's current live stream: youtube.com/channel/<channel id>/live
 */
export function toYouTubeEmbed(url: string, { autoplay = true }: { autoplay?: boolean } = {}) {
  const params = new URLSearchParams({ rel: "0", ...(autoplay && { autoplay: "1" }) });

  const channel = url.match(/youtube\.com\/channel\/(UC[\w-]{22})(?:\/live)?/);
  if (channel) return `https://www.youtube-nocookie.com/embed/live_stream?channel=${channel[1]}&${params}`;

  const video = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|live\/|shorts\/))([\w-]{11})/);
  return video ? `https://www.youtube-nocookie.com/embed/${video[1]}?${params}` : null;
}
