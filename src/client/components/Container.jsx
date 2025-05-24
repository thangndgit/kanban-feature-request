import { Flex } from 'antd';

const Container = ({ children, gap = 'small', maxWidth = '100%', ...props }) => {
  return (
    <Flex vertical gap={gap} style={{ padding: '36px 24px', margin: 'auto', maxWidth }} {...props}>
      {children}
    </Flex>
  );
};

export default Container;
