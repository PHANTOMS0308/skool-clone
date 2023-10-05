// Regex are not optimal, should be refactor if time allowed
const URLRegex =
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

export default function validateURL(url: string) {
  return !!url.match(URLRegex);
}
