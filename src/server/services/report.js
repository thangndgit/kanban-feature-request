import axios from "axios";
import cheerio from "cheerio";

export const getHttpStatus = async (url) => {
  try {
    const res = await axios.get(url);
    return res?.status || 200;
  } catch (err) {
    return err?.response?.status || 200;
  }
};

export const getPageSummaryFromHtml = async (url, html) => {
  if (!url || !html) return [];

  const $ = cheerio.load(html);

  const resData = [];

  // domain of url:
  const domain = new URL(url).hostname;
  const protocol = new URL(url).protocol;

  // http status
  const httpStatus = await getHttpStatus(url);
  resData.push({ label: "HTTP status", key: "http_status", value: httpStatus || 200 });

  // meta title
  const metaTitle = $("head title").text();
  resData.push({ label: "Meta title", key: "meta_title", value: metaTitle || "" });

  // meta description
  const metaDescription = $("head meta[name='description']").attr("content");
  resData.push({ label: "Meta description", key: "meta_description", value: metaDescription || "" });

  // page url
  const pageUrl = url;
  resData.push({ label: "Page URL", key: "page_url", value: pageUrl || "" });

  // h1
  const h1 = $("h1").text();
  resData.push({ label: "H1", key: "h1", value: h1 || "" });

  // redirect url
  const redirectContent = $("head meta[http-equiv='refresh']").attr("content");
  const redirectUrl = redirectContent?.match(/URL=(.+)/)?.[1];
  resData.push({ label: "Redirect URL", key: "redirect_url", value: redirectUrl || "" });

  // images on pages
  const imageSources = $("img")
    .map((i, el) => $(el).attr("src"))
    .get()
    .filter((src) => src && src.trim() !== "");
  const imageCount = new Set(imageSources).size;
  resData.push({ label: "Images on page", key: "images_on_page", value: imageCount });

  // words count
  const wordCount = $("body")
    ?.clone()
    ?.find("script, style")
    ?.remove()
    ?.end()
    ?.text()
    ?.split(/\s+/)
    ?.filter((w) => w)?.length;
  resData.push({ label: "Word count", key: "word_count", value: wordCount });

  // canonical url
  const canonicalUrl = $("head link[rel='canonical']").attr("href");
  resData.push({ label: "Canonical link", key: "canonical_link", value: canonicalUrl || "" });

  const isInternalLink = (href) =>
    href.startsWith("/") || href.startsWith("//" + domain) || href.startsWith(protocol + "//" + domain);

  // all links array
  const allLinks = $("a")
    .map((i, el) => $(el).attr("href"))
    .get()
    .filter(
      (href) =>
        href &&
        !href.startsWith("#") &&
        !href.startsWith("mailto:") &&
        !href.startsWith("tel:") &&
        !href.startsWith("javascript:")
    );

  // internal links (unique count)
  const internalLinkCount = new Set(allLinks.filter((href) => isInternalLink(href))).size;
  resData.push({ label: "Internal links", key: "internal_links", value: internalLinkCount });

  // external links
  const externalLinkCount = new Set(allLinks.filter((href) => !isInternalLink(href))).size;
  resData.push({ label: "External links", key: "external_links", value: externalLinkCount });

  return resData;
};
