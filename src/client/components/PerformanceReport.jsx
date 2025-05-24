import { Divider, Flex, Progress, Row, Col, Select, Typography, Button } from 'antd';
import { useMemo, useState } from 'react';
import constants from '../constants/constants';
import PerformanceMetricItem from './PerformanceMetricItem';
import SkeletonPerformanceReport from './SkeletonPerformanceReport';

const { Text } = Typography;

const PerformanceReport = ({ report = {}, loading, strategy, setStrategy, print }) => {
  const colors = useMemo(
    () => ({ critical: constants.COLOR.CRITICAL, warning: constants.COLOR.WARNING, good: constants.COLOR.GOOD }),
    []
  );

  const performanceScore = useMemo(() => report?.score * 100 || 0, [report?.score]);

  const scoreColor = useMemo(
    () => (performanceScore >= 90 ? colors.good : performanceScore >= 50 ? colors.warning : colors.critical),
    [performanceScore, colors]
  );

  const [showDetails, setShowDetails] = useState(false);

  if (!report || loading) return <SkeletonPerformanceReport />;

  return (
    <Flex gap="small" vertical>
      <Progress
        type="circle"
        percent={Math.round(performanceScore)}
        strokeWidth={8}
        size={160}
        format={(p) => p}
        style={{ margin: 'auto' }}
        strokeColor={scoreColor}
        trailColor="#F0F0F0"
      />

      {!print && (
        <Flex align="center" justify="center" gap="small" style={{ marginTop: 20 }}>
          <Text style={{ textAlign: 'center', display: 'block', fontWeight: 600 }}>Device:</Text>
          <Select
            value={strategy}
            style={{ width: 100 }}
            options={[
              { value: 'mobile', label: 'Mobile' },
              { value: 'desktop', label: 'Desktop' },
            ]}
            disabled={loading}
            loading={loading}
            onChange={(value) => setStrategy(value)}
          />
        </Flex>
      )}

      <Divider />

      <Row gutter={30} style={{ padding: '0 15px' }}>
        {['fcp', 'lcp', 'tbt', 'cls', 'si'].map((key) => (
          <Col span={24} lg={print ? 24 : 12} key={key}>
            <PerformanceMetricItem
              metric={report?.lighthouseResult?.metrics[key]}
              showDetails={showDetails || print}
              print={print}
            />
            <Divider />
          </Col>
        ))}
      </Row>

      {!print && (
        <Button
          type="link"
          style={{ display: 'block', margin: 'auto', color: '#f24a6f' }}
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide details' : 'Show details'}
        </Button>
      )}
    </Flex>
  );
};

export default PerformanceReport;
