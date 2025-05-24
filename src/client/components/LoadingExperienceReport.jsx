import { Button, Card, Divider, Flex, Segmented, Select, Tooltip, Typography } from 'antd';
import { Fragment, useState } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import LoadingExperienceMetricItem from './LoadingExperienceMetricItem';
import SkeletonLoadingExperienceReport from './SkeletonLoadingExperienceReport';
import constants from '../constants/constants';

const { Text } = Typography;

const LoadingExperienceReport = ({ report, loading, print, strategy, origin }) => {
  const cwvReport = {
    default: report?.loadingExperience,
    origin: report?.originLoadingExperience,
  };

  const metricsOptions = [
    ['lcp', 'inp', 'cls'],
    ['fcp', 'fid', 'ttfb'],
  ];

  const [selectedReport, setSelectedReport] = useState('default');
  const [selectedMetrics, setSelectedMetrics] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const rankToText = {
    good: 'Fast',
    warning: 'Moderate',
    critical: 'Slow',
  };

  const rankToColor = {
    good: constants.COLOR.GOOD,
    warning: constants.COLOR.WARNING,
    critical: constants.COLOR.CRITICAL,
  };

  if (!report || loading) return <SkeletonLoadingExperienceReport />;

  return (
    <Card
      title={
        print ? null : (
          <Text style={{ fontWeight: 600 }}>
            Loading Experience&nbsp;&nbsp;
            <Tooltip title="Explore real user experiences from diverse devices and network connections. Based on extensive sampling over the latest 28-day period, including full visit durations and all Chrome versions.">
              <ExclamationCircleOutlined />
            </Tooltip>
          </Text>
        )
      }
      style={{ position: 'sticky', top: 24 }}
      extra={
        print ? null : (
          <Select
            style={{ width: 100 }}
            options={[
              { label: 'This URL', value: 'default' },
              { label: 'Origin', value: 'origin' },
            ]}
            value={selectedReport}
            onChange={setSelectedReport}
          />
        )
      }
    >
      <Flex vertical gap="large">
        {!print && (
          <Segmented
            value={selectedMetrics}
            onChange={(value) => setSelectedMetrics(value)}
            options={[
              { label: 'Core Web Vitals', value: 0 },
              { label: 'Other Notable Metrics', value: 1 },
            ]}
            block
          />
        )}

        <Text type="secondary" style={{ textAlign: 'justify' }}>
          {cwvReport?.default?.metrics?.lcp?.value ? (
            <span>
              Over the past 28 days, the field data indicates that this page exhibits{' '}
              <Text
                style={{ color: rankToColor?.[cwvReport?.[origin ? 'origin' : selectedReport]?.rank], fontWeight: 600 }}
              >
                {rankToText?.[cwvReport?.[origin ? 'origin' : selectedReport]?.rank]}
              </Text>{' '}
              speed when accessed from a <Text style={{ fontWeight: 500 }}>{strategy}</Text> compared to other pages in
              the Chrome User Experience Report. We are displaying the 75th percentile of{' '}
              {print ? 'LCP, INP and CLS' : 'LCP, INP, CLS, FCP, FID, and TTFB.'}
            </span>
          ) : (
            'The Chrome User Experience Report does not have sufficient real-world speed data for this page.'
          )}
        </Text>

        {metricsOptions?.[selectedMetrics]?.map((m) => (
          <Fragment key={m}>
            <Divider style={{ margin: 0 }} />
            <LoadingExperienceMetricItem
              metric={cwvReport?.[origin ? 'origin' : selectedReport]?.metrics?.[m]}
              showDetails={showDetails || print}
              print={print}
            />
          </Fragment>
        ))}
      </Flex>

      {!print && (
        <Button
          type="link"
          style={{ display: 'block', margin: 'auto', marginTop: '1.5rem', color: '#f24a6f' }}
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide details' : 'Show details'}
        </Button>
      )}
    </Card>
  );
};

export default LoadingExperienceReport;
