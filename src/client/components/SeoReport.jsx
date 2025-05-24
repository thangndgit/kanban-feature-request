import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Collapse, Divider, Flex, Progress } from 'antd';
import { useMemo } from 'react';
import { useAdmin } from '../hooks';
import SeoCollapseItem from './SeoCollapseItem';
import SkeletonSeoReport from './SkeletonSeoReport';
import constants from '../constants/constants';

const SeoReport = ({ report, loading }) => {
  const { isAdmin } = useAdmin();

  const criticalColor = constants.COLOR.CRITICAL;
  const warningColor = constants.COLOR.WARNING;
  const goodColor = constants.COLOR.GOOD;

  const seoScore = useMemo(() => report?.score || 0, [report]);
  const scoreColor = useMemo(
    () => (seoScore >= 90 ? goodColor : seoScore >= 50 ? warningColor : criticalColor),
    [criticalColor, goodColor, seoScore, warningColor]
  );

  const collapseItems = [
    SeoCollapseItem({
      key: '1',
      title: 'Critical',
      issues: report?.checklist?.critical,
      color: criticalColor,
      icon: <CloseCircleOutlined style={{ color: criticalColor, fontSize: '1.4em' }} />,
      blur: !isAdmin,
    }),
    SeoCollapseItem({
      key: '2',
      title: 'Need improvement',
      issues: report?.checklist?.need_improvement,
      color: warningColor,
      icon: <ExclamationCircleOutlined style={{ color: warningColor, fontSize: '1.4em' }} />,
      blur: !isAdmin,
    }),
    SeoCollapseItem({
      key: '3',
      title: 'Good',
      issues: report?.checklist?.good,
      color: goodColor,
      icon: <CheckCircleOutlined style={{ color: goodColor, fontSize: '1.4em' }} />,
      blur: !isAdmin,
    }),
  ];

  const activeKeys = useMemo(() => {
    let keys = [];
    if (report?.checklist?.critical?.length > 0) keys.push('1');
    if (report?.checklist?.need_improvement?.length > 0) keys.push('2');
    if (report?.checklist?.critical?.length + report?.checklist?.need_improvement?.length === 0) keys.push('3');
    return keys;
  }, [report?.checklist?.critical?.length, report?.checklist?.need_improvement?.length]);

  if (!report || loading) return <SkeletonSeoReport />;

  return (
    <Flex gap="small" vertical>
      <Progress
        type="circle"
        percent={seoScore}
        strokeWidth={8}
        size={160}
        format={(p) => p}
        strokeColor={scoreColor}
        trailColor="#F0F0F0"
        style={{ margin: 'auto' }}
      />
      <Divider />
      <Collapse items={collapseItems} defaultActiveKey={activeKeys} ghost expandIconPosition="end" />
    </Flex>
  );
};

export default SeoReport;
