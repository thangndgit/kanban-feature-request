import axios from 'axios';
import cheerio from 'cheerio';
import httpStatus from '../constants/httpStatus.js';
import HttpError from '../utils/HttpError.js';
import { getPageSummaryFromHtml } from '../services/report.js';
import dotenv from 'dotenv';

dotenv.config();

export default {
  getSeoReport: async (req, res, next) => {
    try {
      const url = req.query.url;

      if (!url) {
        const err = new HttpError(400, 'Missing page url');
        return next(err, req, res, next);
      }

      const authToken = process.env.AUTH_TOKEN;
      const endpoint = `${process.env.API_BASE_URI}/api/app/audit/${process.env.API_VERSION}`;

      const response = await axios.post(endpoint, { url }, { headers: { Authorization: authToken } });

      const data = response?.data;

      const pageHtml = data?.result?.pageContentData;

      if (!pageHtml) {
        const err = new HttpError(400, 'Page content not found. Please re-scan the url.');
        return next(err, req, res, next);
      }

      const pageSummary = await getPageSummaryFromHtml(url, pageHtml);

      if (data?.result) data.result.pageSummary = pageSummary;

      if (data?.result?.pageContentData) delete data?.result?.pageContentData;

      res.status(response.status).json({
        status: httpStatus[response.status],
        data: data,
      });
    } catch (error) {
      next(error);
    }
  },

  getPerformanceReport: async (req, res, next) => {
    try {
      const query = { ...req.query, category: 'performance', key: process.env.PAGE_SPEED_KEY };
      const queryStr = new URLSearchParams(query).toString();
      const endPoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${queryStr}`;

      const response = await axios.get(endPoint, {
        headers: { 'Content-Type': 'application/json' },
      });

      res.status(response.status).json({
        status: httpStatus[response.status],
        data: response.data,
      });
    } catch (error) {
      next(error);
    }
  },

  getPageSummaryReport: async (req, res, next) => {
    try {
      const url = req.query.url;

      if (!url) {
        const err = new HttpError(400, 'Missing page url');
        return next(err, req, res, next);
      }

      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);

      const resData = [];

      // domain of url:
      const domain = new URL(url).hostname;
      const protocol = new URL(url).protocol;

      // http status
      const httpStatus = response.status;
      resData.push({ label: 'HTTP status', key: 'http_status', value: httpStatus || 200 });

      // meta title
      const metaTitle = $('head title').text();
      resData.push({ label: 'Meta title', key: 'meta_title', value: metaTitle || '' });

      // meta description
      const metaDescription = $("head meta[name='description']").attr('content');
      resData.push({ label: 'Meta description', key: 'meta_description', value: metaDescription || '' });

      // page url
      const pageUrl = url;
      resData.push({ label: 'Page URL', key: 'page_url', value: pageUrl || '' });

      // h1
      const h1 = $('h1').text();
      resData.push({ label: 'H1', key: 'h1', value: h1 || '' });

      // redirect url
      const redirectContent = $("head meta[http-equiv='refresh']").attr('content');
      const redirectUrl = redirectContent?.match(/URL=(.+)/)?.[1];
      resData.push({ label: 'Redirect URL', key: 'redirect_url', value: redirectUrl || '' });

      // images on pages
      const imageSources = $('img')
        .map((i, el) => $(el).attr('src'))
        .get()
        .filter((src) => src && src.trim() !== '');
      const imageCount = new Set(imageSources).size;
      resData.push({ label: 'Images on page', key: 'images_on_page', value: imageCount });

      // words count
      const wordCount = $('body').clone().find('script, style').remove().end().text().split(/\s+/).length;
      resData.push({ label: 'Word count', key: 'word_count', value: wordCount });

      // canonical url
      const canonicalUrl = $("head link[rel='canonical']").attr('href');
      resData.push({ label: 'Canonical link', key: 'canonical_link', value: canonicalUrl || '' });

      const isInternalLink = (href) =>
        href.startsWith('/') || href.startsWith('//' + domain) || href.startsWith(protocol + '//' + domain);

      // all links array
      const allLinks = $('a')
        .map((i, el) => $(el).attr('href'))
        .get()
        .filter(
          (href) =>
            href &&
            !href.startsWith('#') &&
            !href.startsWith('mailto:') &&
            !href.startsWith('tel:') &&
            !href.startsWith('javascript:')
        );

      // internal links (unique count)
      const internalLinkCount = new Set(allLinks.filter((href) => isInternalLink(href))).size;
      resData.push({ label: 'Internal links', key: 'internal_links', value: internalLinkCount });

      // external links
      const externalLinkCount = new Set(allLinks.filter((href) => !isInternalLink(href))).size;
      resData.push({ label: 'External links', key: 'external_links', value: externalLinkCount });

      res.status(response.status).json({
        status: 200,
        data: resData,
      });
    } catch (error) {
      next(error);
    }
  },
};

