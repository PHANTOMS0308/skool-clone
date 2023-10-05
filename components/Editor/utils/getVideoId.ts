const YouTubeRegex =
  /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/;

export default function getVideoId(videoLink: string) {
  const matched = videoLink.match(YouTubeRegex);

  return matched ? matched[6] : "";
}
