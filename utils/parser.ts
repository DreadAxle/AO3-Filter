export const parseAndValidateUrl = (input: string): { id: string | null; error: string | null } => {
  if (!input) {
    return { id: null, error: "Input is empty." };
  }

  let urlObj: URL;
  try {
    urlObj = new URL(input);
  } catch (e) {
    return { id: null, error: "Please enter a valid URL (starting with http:// or https://)." };
  }

  if (urlObj.protocol !== 'https:' && urlObj.protocol !== 'http:') {
    return { id: null, error: "Please enter a valid http(s) URL." };
  }

  // Domain check
  const hostname = urlObj.hostname.toLowerCase();
  const isAllowedHost =
    hostname === 'archiveofourown.org' || hostname.endsWith('.archiveofourown.org');
  if (!isAllowedHost) {
    return { id: null, error: "The URL must be from archiveofourown.org." };
  }

  // Regex looks for /tags/[NUMBERS]/
  // Captures the digits after /tags/
  const regex = /\/tags\/(\d+)/;
  const match = urlObj.pathname.match(regex);

  if (!match || !match[1]) {
    return { id: null, error: "Could not find a numeric tag ID in the URL path (e.g. .../tags/12345/...)." };
  }

  return { id: match[1], error: null };
};
