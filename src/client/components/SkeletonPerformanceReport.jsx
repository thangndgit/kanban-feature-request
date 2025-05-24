import { Col, Divider, Flex, Row, Skeleton } from "antd";

const SkeletonPerformanceReport = () => {
  return (
    <Flex gap="small" vertical justify="center">
      <Skeleton.Avatar active size={160} shape="circle" style={{ margin: "auto", display: "block" }} />
      <Flex align="center" justify="center" gap="small" style={{ marginTop: 20 }}>
        <Skeleton.Button active style={{ width: 45, height: 20 }} />
        <Skeleton.Button active style={{ width: 100 }} />
      </Flex>
      <Divider />
      <Row gutter={30} style={{ padding: "0 15px" }}>
        {[1, 2, 3, 4, 5].map((key) => (
          <Col span={24} lg={12} key={key}>
            <Flex gap="small" vertical>
              <Skeleton.Button active style={{ width: 180, height: 20 }} />
              <Flex gap="small" align="center" justify="space-between">
                <Skeleton.Button active style={{ width: 50, height: 25 }} />
                <Skeleton.Button active style={{ width: 70, height: 20 }} />
              </Flex>
            </Flex>
            <Divider />
          </Col>
        ))}
      </Row>
    </Flex>
  );
};

export default SkeletonPerformanceReport;
