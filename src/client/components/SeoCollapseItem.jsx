import { Flex, Typography, Button } from 'antd';
import SeoIssueItem from './SeoIssueItem';
import { UpCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

const SeoCollapseItem = ({ key, icon, title, issues, color, blur }) => {
  return {
    key,
    label: (
      <Text style={{ fontWeight: 600 }}>
        <Flex gap="small" style={{ fontSize: '1.1em' }}>
          {icon}
          {title} ({issues?.length || 0})
        </Flex>
      </Text>
    ),
    children: (
      <div style={{ position: 'relative' }}>
        <Flex
          gap="small"
          vertical
          style={
            blur ? { filter: 'blur(4px)', msUserSelect: 'none', WebkitUserSelect: 'none', userSelect: 'none' } : {}
          }
        >
          {issues?.map((item, index) => {
            let newItem = { ...item };
            if (!Array.isArray(newItem?.data?.value) && newItem?.data?.value) {
              newItem.data.value = [newItem.data.value];
            }
            return <SeoIssueItem key={index} item={newItem} color={color} dummy={blur} />;
          })}
        </Flex>
        {blur && (
          <Button
            type="link"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontWeight: 600,
            }}
            onClick={() => {
              if (typeof document !== 'undefined') {
                document.querySelector('#get-report-btn').scrollIntoView({ behavior: 'smooth', block: 'center' });
                document.querySelector('#get-report-btn').click();
              }
            }}
          >
            Get full report here&nbsp;&nbsp;
            <UpCircleOutlined />
          </Button>
        )}
      </div>
    ),
  };
};

export default SeoCollapseItem;

