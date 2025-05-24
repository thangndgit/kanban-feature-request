import { useEffect, useMemo, useRef, useState } from 'react';
import { InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Typography, Button, Divider, Flex, Row, Col, Tabs, Card, Popover, Tooltip } from 'antd';
import { PDFExport } from '@progress/kendo-react-pdf';
import { drawDOM, exportPDF } from '@progress/kendo-drawing';
import {
  SeoReport,
  SeoPreview,
  FormSubmitUrl,
  SeoReportPrint,
  FormExportReport,
  PerformanceReport,
  PageSummaryReport,
  LoadingExperienceReport,
} from '../components';
import notify from '../utils/notify';
import { callApi } from '../utils/api';
import { getPerformanceReport } from '../utils/report';
import { pageConfigApi, reportsApi, verifyApi, visitorsApi } from '../apis';
import { useAdmin } from '../hooks';
import './Home.scss';

const { Text } = Typography;

const Home = ({ isDev = false }) => {
  const { isAdmin } = useAdmin();

  const [loadingSeo, setLoadingSeo] = useState(false);
  const [loadingPerformanceDesktop, setLoadingPerformanceDesktop] = useState(false);
  const [loadingPerformanceMobile, setLoadingPerformanceMobile] = useState(false);

  const [reportSeo, setReportSeo] = useState(null);
  const [reportPerformanceDesktop, setReportPerformanceDesktop] = useState(null);
  const [reportPerformanceMobile, setReportPerformanceMobile] = useState(null);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedTab, setSelectedTab] = useState('1');
  const [pageSpeedStrategy, setPageSpeedStrategy] = useState('mobile');
  const [pageConfig, setPageConfig] = useState({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isDev) setPageConfig(JSON.parse(window.localStorage.getItem('mtm_page_config') || '{}'));
    else setPageConfig(JSON.parse(window.localStorage.getItem('mtm_page_config_dev') || '{}'));
  }, [isDev]);

  useEffect(() => {
    callApi(
      pageConfigApi.get(isDev),
      (data) => {
        setPageConfig(data?.data);
        if (typeof window === 'undefined') return;
        if (!isDev) window.localStorage.setItem('mtm_page_config', JSON.stringify(data?.data || {}));
        else window.localStorage.setItem('mtm_page_config_dev', JSON.stringify(data?.data || {}));
      },
      (error) => {
        notify.error(error);
        console.error(error);
      }
    );
  }, [isDev]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!pageConfig?.pageJS) return;

    const script = document.createElement('script');
    script.textContent = pageConfig.pageJS;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [pageConfig?.pageJS]);

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof pageConfig.showHeader === 'undefined' ||
      typeof pageConfig.showContent === 'undefined' ||
      typeof pageConfig.showFooter === 'undefined'
    )
      return;

    const headerEl = document.querySelector('.mtm-header');
    const contentEl = document.querySelector('.mtm-custom-content');
    const footerEl = document.querySelector('.mtm-footer');

    if (!pageConfig.showHeader && headerEl) headerEl.style.display = 'none';
    if (!pageConfig.showContent && contentEl) contentEl.style.display = 'none';
    if (!pageConfig.showFooter && footerEl) footerEl.style.display = 'none';
    //
  }, [pageConfig.showContent, pageConfig.showFooter, pageConfig.showHeader]);

  const handleUrlSubmit = async (url) => {
    setFormSubmitted(true);
    setLoadingSeo(true);
    setLoadingPerformanceDesktop(true);
    setLoadingPerformanceMobile(true);

    const urlToAudit = url.startsWith('http') ? url : `https://${url}`;

    callApi(
      reportsApi.getSeoReport(urlToAudit),
      (data) => {
        setLoadingSeo(false);
        setReportSeo(data?.data?.result);
      },
      (error) => {
        notify.error(error.message);
        setLoadingSeo(false);
        setReportSeo({});
      }
    );

    getPerformanceReport(
      urlToAudit,
      'mobile',
      (report) => {
        setReportPerformanceMobile(report);
        setLoadingPerformanceMobile(false);
      },
      (error) => {
        notify.error('Fail to get mobile performance report. Please try again.');
        console.error(error.message);
        setLoadingPerformanceMobile(false);
        setReportPerformanceMobile({});
      }
    );

    getPerformanceReport(
      urlToAudit,
      'desktop',
      (report) => {
        setReportPerformanceDesktop(report);
        setLoadingPerformanceDesktop(false);
      },
      (error) => {
        notify.error('Fail to get desktop performance report. Please try again.');
        console.error(error.message);
        setLoadingPerformanceDesktop(false);
        setReportPerformanceDesktop({});
      }
    );
  };

  const handleUrlSubmitWithVerify = async (url, token) => {
    const verifyData = await callApi(
      verifyApi.verifyCaptcha(token),
      () => {},
      () => notify.error('Captcha validation failed. Please try again.')
    );

    const captchaValid = verifyData?.data?.success;

    if (!captchaValid) {
      return;
    } else {
      handleUrlSubmit(url);
    }
  };

  const tabItems = useMemo(
    () => [
      {
        key: '1',
        label: (
          <Flex gap="small" align="center">
            <Text style={{ fontWeight: 600 }}>SEO</Text>
            {loadingSeo && <LoadingOutlined style={{ color: '#f3935f' }} />}
          </Flex>
        ),
        children: <SeoReport report={reportSeo} loading={loadingSeo} />,
      },
      {
        key: '2',
        label: (
          <Flex gap="small" align="center">
            <Text style={{ fontWeight: 600 }}>Speed</Text>
            {(loadingPerformanceDesktop || loadingPerformanceMobile) && (
              <LoadingOutlined style={{ color: '#f3935f' }} />
            )}
          </Flex>
        ),
        children: (
          <PerformanceReport
            report={pageSpeedStrategy === 'desktop' ? reportPerformanceDesktop : reportPerformanceMobile}
            loading={loadingPerformanceDesktop || loadingPerformanceMobile}
            strategy={pageSpeedStrategy}
            setStrategy={setPageSpeedStrategy}
          />
        ),
      },
    ],
    [
      loadingSeo,
      loadingPerformanceDesktop,
      loadingPerformanceMobile,
      reportSeo,
      reportPerformanceDesktop,
      reportPerformanceMobile,
      pageSpeedStrategy,
    ]
  );

  const pdfReportRef = useRef(null);

  const exportReport = () => {
    if (pdfReportRef.current) {
      pdfReportRef.current.save();
    }
  };

  const exportReportToBase64 = async (visitorData) => {
    try {
      let gridElement = document.querySelector('.seo-report-print__inner');

      const group = await drawDOM(gridElement, {
        paperSize: 'A3',
        forcePageBreak: '.mtm-break',
      });

      const dataUri = await exportPDF(group);

      const pageUrl =
        reportSeo?.pageSummary
          ?.find((e) => e.key === 'page_url')
          ?.value?.replace(/^https?:\/\//, '')
          ?.replace(/\/+$/, '') || 'seo';

      const currentDate = new Date().toISOString().split('T')[0];

      await callApi(
        visitorsApi.create({
          visitor: visitorData,
          report: {
            filename: `report-${pageUrl}-${currentDate}.pdf`,
            content: dataUri.split(';base64,')[1],
            encoding: 'base64',
          },
          url: pageUrl,
        }),
        () => notify.success('Report has been successfully generated and sent to your email.')
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="mtm-home-page mtm-primal">
        <div className="mtm-main">
          <h1 className="mtm-heading">SEO & Speed Checker by Tapita</h1>

          <p className="mtm-sub-heading">
            This tool assesses your website&apos;s SEO & speed performance by analyzing factors such as keyword usage,
            meta tags, headings, Google speed metrics, and more. It offers actionable insights to enhance search engine
            rankings and drive organic traffic to your website.
          </p>

          <div className="mtm-form-audit">
            <FormSubmitUrl
              loading={loadingSeo || loadingPerformanceDesktop || loadingPerformanceMobile}
              onFinish={isAdmin ? handleUrlSubmit : handleUrlSubmitWithVerify}
            />
          </div>

          {formSubmitted && (
            <>
              <Divider />
              <Row gutter={24}>
                <Col span={24} md={12} lg={14}>
                  <Card className="mtm-card" style={{ marginBottom: 24, position: 'sticky', top: 24 }}>
                    <Tabs
                      defaultActiveKey="1"
                      items={tabItems}
                      onChange={(key) => setSelectedTab(key)}
                      tabBarExtraContent={
                        isAdmin ? (
                          <Button
                            type="link"
                            style={{ padding: 0 }}
                            id="get-report-btn"
                            loading={loadingSeo || loadingPerformanceMobile || loadingPerformanceDesktop}
                            onClick={exportReport}
                          >
                            Get full report
                          </Button>
                        ) : (
                          <Popover
                            title={
                              <Tooltip title="Please provide your email address to receive the report. We will send the report to your email address.">
                                <Flex align="center" gap="small">
                                  Get detailed report <InfoCircleOutlined />
                                </Flex>
                              </Tooltip>
                            }
                            trigger="click"
                            content={<FormExportReport report={reportSeo} onExport={exportReportToBase64} />}
                          >
                            <Button
                              type="link"
                              style={{ padding: 0 }}
                              id="get-report-btn"
                              loading={loadingSeo || loadingPerformanceMobile || loadingPerformanceDesktop}
                            >
                              Get full report
                            </Button>
                          </Popover>
                        )
                      }
                    />
                  </Card>
                </Col>
                {selectedTab === '1' && (
                  <Col span={24} md={12} lg={10}>
                    <SeoPreview report={reportSeo} loading={loadingSeo} />
                    <PageSummaryReport report={reportSeo} loading={loadingSeo} />
                  </Col>
                )}
                {selectedTab === '2' && (
                  <Col span={24} md={12} lg={10}>
                    <LoadingExperienceReport
                      report={pageSpeedStrategy === 'desktop' ? reportPerformanceDesktop : reportPerformanceMobile}
                      loading={loadingPerformanceDesktop || loadingPerformanceMobile}
                      strategy={pageSpeedStrategy}
                    />
                  </Col>
                )}
              </Row>
            </>
          )}

          <div className="seo-report-print" style={{ position: 'absolute', top: -9999, left: -9999 }}>
            <PDFExport
              paperSize="A3"
              title="SEO Report"
              subject="SEO Report"
              keywords=""
              ref={pdfReportRef}
              margin={0}
              fileName={`report-${reportSeo?.url || 'seo'}.pdf`}
              author="Tapita"
              forcePageBreak=".mtm-break"
            >
              <SeoReportPrint
                reportSeo={reportSeo}
                reportPerformances={{
                  desktop: reportPerformanceDesktop,
                  mobile: reportPerformanceMobile,
                }}
              />
            </PDFExport>
          </div>
        </div>
      </div>

      <div
        className="mtm-custom-content"
        style={{ maxWidth: '100dvw' }}
        dangerouslySetInnerHTML={{
          __html: `
            <style>${pageConfig?.pageCSS}</style>
            <section style="width: 100%">${pageConfig?.pageHTML}</section>
          `,
        }}
      />
    </>
  );
};

export default Home;
