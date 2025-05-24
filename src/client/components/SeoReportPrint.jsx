import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Col, Divider, Flex, List, Progress, Row, Typography } from 'antd';
import constants from '../constants/constants';
import { Fragment, useMemo } from 'react';
import SeoIssueItemPrint from './SeoIssueItemPrint';
import PerformanceReport from './PerformanceReport';
import LoadingExperienceReport from './LoadingExperienceReport';

const { Title, Text, Link } = Typography;

const SeoReportPrint = ({ reportSeo, reportPerformances }) => {
  const dataByRank = {
    good: {
      icon: <CheckCircleOutlined style={{ color: constants.COLOR.GOOD }} />,
      color: constants.COLOR.GOOD,
      title: 'Good',
      status: 'good',
      description:
        "Your page boasts excellent SEO optimization, laying a strong foundation for search engine ranking. However, there's room for enhancement. Refine highlighted On and Off-Page factors, and apply advanced SEO strategies like targeted content creation and strategic link building to further amplify online presence and attract even more organic traffic.",
    },
    need_improvement: {
      icon: <ExclamationCircleOutlined style={{ color: constants.COLOR.WARNING }} />,
      color: constants.COLOR.WARNING,
      title: 'Need improvement ',
      status: 'moderate',
      description:
        'Your page is reasonably optimized for SEO, indicating the potential for enhanced ranking and increased traffic from search engines. By refining both On and Off-Page factors highlighted here, as well as implementing effective SEO tactics such as content creation and strategic link building, you can further amplify your visibility and draw in a larger audience of organic visitors.',
    },
    critical: {
      icon: <CloseCircleOutlined style={{ color: constants.COLOR.CRITICAL }} />,
      color: constants.COLOR.CRITICAL,
      title: 'Critical',
      status: 'poor',
      description:
        "Your page is deficient in SEO optimization, hampering its ability to rank effectively on search engines. Vital to enhancing visibility and attracting organic traffic is the refinement of both On and Off-Page factors. Consider revising content strategy, optimizing meta tags, and acquiring high-quality backlinks to fortify your website's SEO performance and elevate its potential for discovery by prospective visitors.",
    },
  };

  const seoRank = useMemo(
    () => (reportSeo?.score >= 90 ? 'good' : reportSeo?.score >= 50 ? 'need_improvement' : 'critical'),
    [reportSeo?.score]
  );

  if (!reportSeo || !reportPerformances) return null;

  return (
    <Flex
      className="seo-report-print__inner"
      gap="small"
      vertical
      style={{ width: '100%', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}
      align="stretch"
    >
      <Flex gap="small" align="center" justify="space-between" style={{ padding: 16, background: '#2A3F54' }}>
        <Title level={4} style={{ marginBottom: 0, color: 'white' }}>
          Tapita SEO & Performance Report
        </Title>
        <Flex gap="small" align="center">
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Sites:</Text>
          <Link style={{ color: 'white', textDecoration: 'underline' }}>
            {reportSeo?.pageSummary?.find((item) => item.key === 'page_url')?.value || 'https://tapita.io/'}
          </Link>
        </Flex>
      </Flex>

      <Divider>
        <Title level={3} style={{ margin: 0, fontWeight: 'bold' }}>
          Search Engine Optimization (SEO)
        </Title>
      </Divider>

      <Flex vertical gap="small" style={{ padding: '16px 36px' }}>
        <Flex gap="large" align="center" justify="space-between">
          <Progress
            type="circle"
            percent={reportSeo?.score}
            strokeWidth={8}
            size={160}
            format={(p) => p}
            style={{ margin: '0 24px' }}
            strokeColor={dataByRank?.[seoRank]?.color}
            trailColor="#F0F0F0"
          />
          <Flex gap="small" vertical style={{ marginRight: 16 }}>
            <Title level={3} style={{ marginBottom: 0 }}>
              Your SEO score is{' '}
              <span style={{ color: dataByRank?.[seoRank]?.color, fontWeight: 'bold' }}>
                {dataByRank?.[seoRank]?.status}
              </span>
            </Title>
            <Text style={{ textAlign: 'justify' }}>{dataByRank?.[seoRank]?.description}</Text>
          </Flex>
        </Flex>

        <Divider>
          <Title level={4} style={{ margin: 0, fontWeight: 'bold' }}>
            Page summary
          </Title>
        </Divider>

        <List
          bordered
          dataSource={reportSeo?.pageSummary}
          renderItem={(item) => (
            <List.Item>
              <Flex gap="small" style={{ width: '100%' }}>
                <Text>
                  <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>{item.label}:</span>
                  <span> {item.value || 'N/A'}</span>
                </Text>
              </Flex>
            </List.Item>
          )}
          style={{ marginBottom: 16 }}
        />

        {['critical', 'need_improvement', 'good'].map((key) => {
          if (reportSeo?.checklist?.[key]?.length > 0) {
            return (
              <Fragment key={key}>
                <Divider>
                  <Title level={4} style={{ margin: 0, color: dataByRank?.[key]?.color, fontWeight: 'bold' }}>
                    SEO: {dataByRank?.[key]?.title} ({reportSeo?.checklist?.[key]?.length})
                  </Title>
                </Divider>
                <List
                  bordered
                  dataSource={reportSeo?.checklist?.[key]}
                  renderItem={(item) => (
                    <List.Item>
                      <SeoIssueItemPrint item={item} color={dataByRank?.[key]?.color} />
                    </List.Item>
                  )}
                  style={{ marginBottom: 16 }}
                />
              </Fragment>
            );
          }
        })}

        <Divider className="mtm-break">
          <Title level={3} style={{ margin: 0, fontWeight: 'bold' }}>
            Performance (Lighthouse)
          </Title>
        </Divider>

        <Row>
          <Col span={12}>
            <Divider>
              <Title level={4} style={{ margin: 0, fontWeight: 'bold' }}>
                Desktop
              </Title>
            </Divider>
            <PerformanceReport report={reportPerformances?.desktop} print={true} strategy="desktop" />
          </Col>
          <Col span={12}>
            <Divider>
              <Title level={4} style={{ margin: 0, fontWeight: 'bold' }}>
                Mobile
              </Title>
            </Divider>
            <PerformanceReport report={reportPerformances?.mobile} print={true} strategy="mobile" />
          </Col>
        </Row>

        <Divider className="mtm-break">
          <Title level={3} style={{ margin: 0, fontWeight: 'bold' }}>
            Core Web Vitals (This URL)
          </Title>
        </Divider>

        <Flex vertical gap="middle" style={{ padding: '0 24px', textAlign: 'justify' }}>
          <Text>
            Core Web Vitals are a set of crucial performance metrics that assess the overall user experience on
            websites. These metrics focus on three key aspects: loading performance, interactivity, and visual
            stability.
          </Text>

          <Text>
            The following data presents the outcomes of core web vitals metrics, which gauge the actual user experience
            over the most recent 28-day period on this URL.
          </Text>
        </Flex>

        <Row gutter={24}>
          <Col span={12}>
            <Divider>
              <Title level={4} style={{ margin: 0, fontWeight: 'bold' }}>
                Desktop
              </Title>
            </Divider>
            <LoadingExperienceReport report={reportPerformances?.desktop} print={true} strategy="desktop" />
          </Col>
          <Col span={12}>
            <Divider>
              <Title level={4} style={{ margin: 0, fontWeight: 'bold' }}>
                Mobile
              </Title>
            </Divider>
            <LoadingExperienceReport report={reportPerformances?.mobile} print={true} strategy="mobile" />
          </Col>
        </Row>

        <Divider>
          <Title level={3} style={{ margin: 0, fontWeight: 'bold' }}>
            Core Web Vitals (Origin)
          </Title>
        </Divider>

        <Flex vertical gap="middle" style={{ padding: '0 24px', textAlign: 'justify' }}>
          <Text>
            Core Web Vitals are a set of crucial performance metrics that assess the overall user experience on
            websites. These metrics focus on three key aspects: loading performance, interactivity, and visual
            stability.
          </Text>

          <Text>
            The following data represents the results of core web vitals metrics, measured from the real user experience
            over the past 28 days, calculated as the average across all pages of this site.
          </Text>
        </Flex>

        <Row gutter={24}>
          <Col span={12}>
            <Divider>
              <Title level={4} style={{ margin: 0, fontWeight: 'bold' }}>
                Desktop
              </Title>
            </Divider>
            <LoadingExperienceReport
              report={reportPerformances?.desktop}
              print={true}
              strategy="desktop"
              origin={true}
            />
          </Col>
          <Col span={12}>
            <Divider>
              <Title level={4} style={{ margin: 0, fontWeight: 'bold' }}>
                Mobile
              </Title>
            </Divider>
            <LoadingExperienceReport report={reportPerformances?.mobile} print={true} strategy="mobile" origin={true} />
          </Col>
        </Row>
      </Flex>
    </Flex>
  );
};

export default SeoReportPrint;
