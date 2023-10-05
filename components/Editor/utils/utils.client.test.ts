import { validateURL, validateVideoLink } from ".";

// Link validation is not enough, should be more extensive
describe("URL Validation", () => {
  it("should validate standard http URLs", () => {
    expect(validateURL("http://www.example.com")).toBeTruthy();
    expect(validateURL("http://example.com")).toBeTruthy();
  });

  it("should validate standard https URLs", () => {
    expect(validateURL("https://www.example.com")).toBeTruthy();
    expect(validateURL("https://example.com")).toBeTruthy();
  });

  it("should not validate malformed URLs", () => {
    expect(validateURL("htttp://example.com")).toBeFalsy();
    expect(validateURL("http:/example.com")).toBeFalsy();
    expect(validateURL("example.com")).toBeFalsy();
    expect(validateURL("www.example.com")).toBeFalsy();
  });

  it("should validate URLs with path", () => {
    expect(validateURL("http://www.example.com/path")).toBeTruthy();
    expect(validateURL("https://example.com/path")).toBeTruthy();
  });

  it("should validate URLs with subdomains and TLDs", () => {
    expect(validateURL("http://subdomain.example.co.uk")).toBeTruthy();
  });
});

describe("YouTube Link Validation", () => {
  it("should validate standard YouTube URLs", () => {
    expect(
      validateVideoLink("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    ).toBeTruthy();
    expect(
      validateVideoLink("http://youtube.com/watch?v=dQw4w9WgXcQ")
    ).toBeTruthy();
    expect(validateVideoLink("https://youtu.be/dQw4w9WgXcQ")).toBeTruthy();
  });

  it("should validate YouTube URLs with different prefixes", () => {
    expect(
      validateVideoLink("www.youtube.com/watch?v=dQw4w9WgXcQ")
    ).toBeTruthy();
    expect(validateVideoLink("m.youtube.com/watch?v=dQw4w9WgXcQ")).toBeTruthy();
    expect(validateVideoLink("youtube.com/watch?v=dQw4w9WgXcQ")).toBeTruthy();
  });

  it("should not validate malformed YouTube URLs", () => {
    expect(
      validateVideoLink("htttp://youtube.com/watch?v=dQw4w9WgXcQ")
    ).toBeFalsy();
    expect(
      validateVideoLink("http:/youtube.com/watch?v=dQw4w9WgXcQ")
    ).toBeFalsy();
    expect(validateVideoLink("youtube.comwatch?v=dQw4w9WgXcQ")).toBeFalsy();
  });

  it("should validate YouTube embed and live URLs", () => {
    expect(
      validateVideoLink("https://www.youtube.com/embed/dQw4w9WgXcQ")
    ).toBeTruthy();
    expect(
      validateVideoLink("https://www.youtube.com/live?v=dQw4w9WgXcQ")
    ).toBeTruthy();
  });

  it("should validate YouTube URLs with additional parameters", () => {
    expect(
      validateVideoLink(
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=ChrisUlrich"
      )
    ).toBeTruthy();
  });

  it("should not validate non-YouTube URLs", () => {
    expect(validateVideoLink("https://www.example.com")).toBeFalsy();
    expect(validateVideoLink("https://vimeo.com/123456789")).toBeFalsy();
  });
});
