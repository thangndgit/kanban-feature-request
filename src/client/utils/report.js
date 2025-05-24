import { reportsApi } from '../apis';
import { callApi } from './api';

export const getSeoReport = async (url, callback = () => {}) => {
  const result = await callApi(reportsApi.getSeoReport(url));
  const report = result?.data?.result;
  callback(report);
  return report;
};

export const getPerformanceReport = async (url, strategy = 'mobile', callback, errCallback) => {
  const result = await callApi(reportsApi.getPerformanceReport(url, strategy), (_data) => {}, errCallback);

  const lighthouseAudits = result?.data?.lighthouseResult?.audits;

  const lighthouseMetrics = {
    fcp: lighthouseAudits?.['first-contentful-paint']?.numericValue,
    lcp: lighthouseAudits?.['largest-contentful-paint']?.numericValue,
    tbt: lighthouseAudits?.['total-blocking-time']?.numericValue,
    cls: lighthouseAudits?.['cumulative-layout-shift']?.numericValue,
    si: lighthouseAudits?.['speed-index']?.numericValue,
  };

  const lighthouseScore = result?.data?.lighthouseResult?.categories?.performance?.score;

  const categoryToRank = {
    FAST: 'good',
    AVERAGE: 'warning',
    SLOW: 'critical',
  };

  const report = {
    url,
    strategy,
    score: lighthouseScore,
    lighthouseResult: {
      rank: lighthouseScore >= 0.9 ? 'good' : lighthouseScore >= 0.5 ? 'warning' : 'critical',
      metrics: {
        fcp: {
          unit: 'ms',
          weight: 0.1,
          shorthand: 'FCP',
          value: lighthouseMetrics.fcp,
          breakpoint: [1800, 3000],
          title: 'First Contentful Paint',
          rank: lighthouseMetrics.fcp > 3000 ? 'critical' : lighthouseMetrics.fcp > 1800 ? 'warning' : 'good',
          score: result?.data?.lighthouseResult?.audits?.['first-contentful-paint']?.score,
          tooltip:
            'First Contentful Paint denotes the precise moment when the initial text or image is rendered on the screen.',
          displayValue: result?.data?.lighthouseResult?.audits?.['first-contentful-paint']?.displayValue,
        },
        lcp: {
          unit: 'ms',
          weight: 0.25,
          shorthand: 'LCP',
          value: lighthouseMetrics.lcp,
          breakpoint: [2500, 4000],
          title: 'Largest Contentful Paint',
          rank: lighthouseMetrics.lcp > 4000 ? 'critical' : lighthouseMetrics.lcp > 2500 ? 'warning' : 'good',
          score: result?.data?.lighthouseResult?.audits?.['largest-contentful-paint']?.score,
          tooltip:
            'Largest Contentful Paint signifies the moment when the largest text or image is fully displayed on the screen.',
          displayValue: result?.data?.lighthouseResult?.audits?.['largest-contentful-paint']?.displayValue,
        },
        tbt: {
          unit: 'ms',
          weight: 0.3,
          shorthand: 'TBT',
          value: lighthouseMetrics.tbt,
          breakpoint: [200, 600],
          title: 'Total Blocking Time',
          rank: lighthouseMetrics.tbt > 600 ? 'critical' : lighthouseMetrics.tbt > 200 ? 'warning' : 'good',
          score: result?.data?.lighthouseResult?.audits?.['total-blocking-time']?.score,
          displayValue: result?.data?.lighthouseResult?.audits?.['total-blocking-time']?.displayValue,
          tooltip:
            'Sum of all time periods between FCP and TTI, when task length exceeded 50ms, expressed in milliseconds.',
        },
        cls: {
          unit: '',
          weight: 0.25,
          shorthand: 'CLS',
          value: lighthouseMetrics.cls,
          breakpoint: [0.1, 0.25],
          title: 'Cumulative Layout Shift',
          rank: lighthouseMetrics.cls > 0.25 ? 'critical' : lighthouseMetrics.cls > 0.1 ? 'warning' : 'good',
          score: result?.data?.lighthouseResult?.audits?.['cumulative-layout-shift']?.score,
          displayValue: result?.data?.lighthouseResult?.audits?.['cumulative-layout-shift']?.displayValue,
          tooltip:
            'Cumulative Layout Shift quantifies the displacement of visible elements within the viewport over time.',
        },
        si: {
          unit: 'ms',
          weight: 0.1,
          shorthand: 'SI',
          value: lighthouseMetrics.si,
          title: 'Speed Index',
          breakpoint: [3400, 5800],
          score: result?.data?.lighthouseResult?.audits?.['speed-index']?.score,
          rank: lighthouseMetrics.si > 5800 ? 'critical' : lighthouseMetrics.si > 3400 ? 'warning' : 'good',
          displayValue: result?.data?.lighthouseResult?.audits?.['speed-index']?.displayValue,
          tooltip:
            "Speed Index reflects the rapidity with which a webpage's content becomes visually accessible to users.",
        },
      },
    },
    loadingExperience: {
      rank: categoryToRank[result?.data?.loadingExperience?.overall_category],
      metrics: {
        lcp: {
          breakpoint: [2500, 4000],
          unit: 'ms',
          shorthand: 'LCP',
          value: result?.data?.loadingExperience?.metrics?.LARGEST_CONTENTFUL_PAINT_MS?.percentile,
          title: 'Largest Contentful Paint',
          rank: categoryToRank[result?.data?.loadingExperience?.metrics?.LARGEST_CONTENTFUL_PAINT_MS?.category],
          distributions: result?.data?.loadingExperience?.metrics?.LARGEST_CONTENTFUL_PAINT_MS?.distributions,
        },
        cls: {
          breakpoint: [0.1, 0.25],
          unit: '',
          shorthand: 'CLS',
          value: result?.data?.loadingExperience?.metrics?.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile / 100,
          title: 'Cumulative Layout Shift',
          rank: categoryToRank[result?.data?.loadingExperience?.metrics?.CUMULATIVE_LAYOUT_SHIFT_SCORE?.category],
          distributions: result?.data?.loadingExperience?.metrics?.CUMULATIVE_LAYOUT_SHIFT_SCORE?.distributions,
        },
        fid: {
          breakpoint: [100, 300],
          unit: 'ms',
          shorthand: 'FID',
          value: result?.data?.loadingExperience?.metrics?.FIRST_INPUT_DELAY_MS?.percentile,
          title: 'First Input Delay',
          rank: categoryToRank[result?.data?.loadingExperience?.metrics?.FIRST_INPUT_DELAY_MS?.category],
          distributions: result?.data?.loadingExperience?.metrics?.FIRST_INPUT_DELAY_MS?.distributions,
        },
        fcp: {
          breakpoint: [1800, 3000],
          unit: 'ms',
          shorthand: 'FCP',
          value: result?.data?.loadingExperience?.metrics?.FIRST_CONTENTFUL_PAINT_MS?.percentile,
          title: 'First Contentful Paint',
          rank: categoryToRank[result?.data?.loadingExperience?.metrics?.FIRST_CONTENTFUL_PAINT_MS?.category],
          distributions: result?.data?.loadingExperience?.metrics?.FIRST_CONTENTFUL_PAINT_MS?.distributions,
        },
        inp: {
          breakpoint: [200, 500],
          unit: 'ms',
          shorthand: 'INP',
          value: result?.data?.loadingExperience?.metrics?.INTERACTION_TO_NEXT_PAINT?.percentile,
          title: 'Interaction To Next Paint',
          rank: categoryToRank[result?.data?.loadingExperience?.metrics?.INTERACTION_TO_NEXT_PAINT?.category],
          distributions: result?.data?.loadingExperience?.metrics?.INTERACTION_TO_NEXT_PAINT?.distributions,
        },
        ttfb: {
          breakpoint: [800, 1800],
          unit: 'ms',
          shorthand: 'TTFB',
          value: result?.data?.loadingExperience?.metrics?.EXPERIMENTAL_TIME_TO_FIRST_BYTE?.percentile,
          title: 'Time To First Byte',
          rank: categoryToRank[result?.data?.loadingExperience?.metrics?.EXPERIMENTAL_TIME_TO_FIRST_BYTE?.category],
          distributions: result?.data?.loadingExperience?.metrics?.EXPERIMENTAL_TIME_TO_FIRST_BYTE?.distributions,
        },
      },
    },
    originLoadingExperience: {
      rank: categoryToRank[result?.data?.originLoadingExperience?.overall_category],
      metrics: {
        lcp: {
          breakpoint: [2500, 4000],
          unit: 'ms',
          shorthand: 'LCP',
          value: result?.data?.originLoadingExperience?.metrics?.LARGEST_CONTENTFUL_PAINT_MS?.percentile,
          title: 'Largest Contentful Paint',
          rank: categoryToRank[result?.data?.originLoadingExperience?.metrics?.LARGEST_CONTENTFUL_PAINT_MS?.category],
          distributions: result?.data?.originLoadingExperience?.metrics?.LARGEST_CONTENTFUL_PAINT_MS?.distributions,
        },
        cls: {
          breakpoint: [0.1, 0.25],
          unit: '',
          shorthand: 'CLS',
          value: result?.data?.originLoadingExperience?.metrics?.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile / 100,
          title: 'Cumulative Layout Shift',
          rank: categoryToRank[result?.data?.originLoadingExperience?.metrics?.CUMULATIVE_LAYOUT_SHIFT_SCORE?.category],
          distributions: result?.data?.originLoadingExperience?.metrics?.CUMULATIVE_LAYOUT_SHIFT_SCORE?.distributions,
        },
        fid: {
          breakpoint: [100, 300],
          unit: 'ms',
          shorthand: 'FID',
          value: result?.data?.originLoadingExperience?.metrics?.FIRST_INPUT_DELAY_MS?.percentile,
          title: 'First Input Delay',
          rank: categoryToRank[result?.data?.originLoadingExperience?.metrics?.FIRST_INPUT_DELAY_MS?.category],
          distributions: result?.data?.originLoadingExperience?.metrics?.FIRST_INPUT_DELAY_MS?.distributions,
        },
        inp: {
          breakpoint: [200, 500],
          unit: 'ms',
          shorthand: 'INP',
          value: result?.data?.originLoadingExperience?.metrics?.INTERACTION_TO_NEXT_PAINT?.percentile,
          title: 'Interaction To Next Paint',
          rank: categoryToRank[result?.data?.originLoadingExperience?.metrics?.INTERACTION_TO_NEXT_PAINT?.category],
          distributions: result?.data?.originLoadingExperience?.metrics?.INTERACTION_TO_NEXT_PAINT?.distributions,
        },
        fcp: {
          breakpoint: [1800, 3000],
          unit: 'ms',
          shorthand: 'FCP',
          value: result?.data?.originLoadingExperience?.metrics?.FIRST_CONTENTFUL_PAINT_MS?.percentile,
          title: 'First Contentful Paint',
          rank: categoryToRank[result?.data?.originLoadingExperience?.metrics?.FIRST_CONTENTFUL_PAINT_MS?.category],
          distributions: result?.data?.originLoadingExperience?.metrics?.FIRST_CONTENTFUL_PAINT_MS?.distributions,
        },
        ttfb: {
          breakpoint: [800, 1800],
          unit: 'ms',
          shorthand: 'TTFB',
          value: result?.data?.originLoadingExperience?.metrics?.EXPERIMENTAL_TIME_TO_FIRST_BYTE?.percentile,
          title: 'Time To First Byte',
          rank: categoryToRank[
            result?.data?.originLoadingExperience?.metrics?.EXPERIMENTAL_TIME_TO_FIRST_BYTE?.category
          ],
          distributions: result?.data?.originLoadingExperience?.metrics?.EXPERIMENTAL_TIME_TO_FIRST_BYTE?.distributions,
        },
      },
    },
  };

  callback(report);
  return report;
};

export const getPageSummaryReport = async (url, callback) => {
  const result = await callApi(reportsApi.getPageSummaryReport(url));
  const report = result?.data;
  callback(report);
  return report;
};
