import { Collapse, Flex, Typography } from 'antd';
import { useMemo } from 'react';
import { issueToElementStr } from '../utils/converter';

const { Text } = Typography;

const SeoIssueItemPrint = ({ item, color }) => {
  const hasMoreDetails = useMemo(
    () => Array.isArray(item?.data?.value) && item?.data?.value?.length > 0,
    [item?.data?.value]
  );

  const IssueItem = useMemo(
    () => (
      <Flex gap="small" align="center" wrap="wrap">
        <div style={{ width: 8, height: 8, borderRadius: 8, background: color }} />
        <Text style={{ fontWeight: 'bold' }}>{item?.label}:</Text>
        <Text>{item?.message}</Text>
      </Flex>
    ),
    [color, item?.label, item?.message]
  );

  const collapseItems = useMemo(
    () => [
      {
        key: '1',
        label: IssueItem,
        children: hasMoreDetails && (
          <ul style={{ listStyle: 'inside', marginLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {item?.hint && (
              <Text type="secondary" style={{ marginBottom: 8 }}>
                {item?.hint}
              </Text>
            )}
            {item?.data?.value?.map((value, index) => (
              <li key={index} style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                {issueToElementStr(item?.data?.tagType, value)}
              </li>
            ))}
          </ul>
        ),
        showArrow: false,
      },
    ],
    [IssueItem, hasMoreDetails, item?.data?.tagType, item?.data?.value, item?.hint]
  );

  if (hasMoreDetails)
    return (
      <div className="seo-issue-item">
        <Collapse ghost items={collapseItems} expandIconPosition="end" activeKey={['1']} expandIcon={() => null} />
      </div>
    );

  return (
    <span className="seo-issue-item" style={{ marginLeft: 16 }}>
      {IssueItem}
    </span>
  );
};

export default SeoIssueItemPrint;
