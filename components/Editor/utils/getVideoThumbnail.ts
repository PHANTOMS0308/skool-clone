export default function getVideoThumbnail(
  id: string,
  resolution: string = "hq"
) {
  return `https://i.ytimg.com/vi/${id}/${resolution}default.jpg`;
}
