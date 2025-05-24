import { Card, Flex, Skeleton } from "antd";

const SkeletonSeoPreview = () => {
  return (
    <Card title="SEO Preview" style={{ marginBottom: 24 }}>
      <div style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", borderRadius: 10, padding: 10 }}>
        <Flex vertical>
          <Skeleton.Input active style={{ width: "100%", height: 24, marginBottom: 16 }} />
          <Skeleton.Input active style={{ width: "60%", height: 12 }} />
          <Skeleton.Input active style={{ width: "100%", height: 12 }} />
          <Skeleton.Input active style={{ width: "100%", height: 12 }} />
          <Skeleton.Input active style={{ width: "80%", height: 12 }} />
        </Flex>
      </div>
    </Card>
  );
};

export default SkeletonSeoPreview;
