import { Card, Flex, Skeleton } from "antd";

const SkeletonPageSummaryReport = () => {
  return (
    <Card title="Page summary" style={{ position: "sticky", top: 24 }}>
      <Flex gap="small" vertical>
        <Skeleton.Input active style={{ width: "100%", height: 12 }} />
        <Skeleton.Input active style={{ width: "100%", height: 12 }} />
        <Skeleton.Input active style={{ width: "100%", height: 12 }} />
        <Skeleton.Input active style={{ width: "80%", height: 12, marginBottom: 24 }} />
        <Skeleton.Input active style={{ width: "100%", height: 12 }} />
        <Skeleton.Input active style={{ width: "100%", height: 12 }} />
        <Skeleton.Input active style={{ width: "100%", height: 12 }} />
        <Skeleton.Input active style={{ width: "80%", height: 12, marginBottom: 24 }} />
        <Skeleton.Input active style={{ width: "100%", height: 12 }} />
        <Skeleton.Input active style={{ width: "100%", height: 12 }} />
        <Skeleton.Input active style={{ width: "100%", height: 12 }} />
        <Skeleton.Input active style={{ width: "80%", height: 12 }} />
      </Flex>
    </Card>
  );
};

export default SkeletonPageSummaryReport;
