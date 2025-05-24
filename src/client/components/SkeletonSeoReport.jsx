import { Divider, Flex, Skeleton } from "antd";

const SkeletonSeoReport = () => {
  return (
    <Flex gap="small" vertical style={{ padding: "0 15px" }}>
      <Skeleton.Avatar active size={160} shape="circle" style={{ display: "block", margin: "auto" }} />
      <Divider />
      <Skeleton.Input active style={{ width: "100%", margin: "8px 0" }} />
      <Skeleton.Input active style={{ width: "100%", height: 12 }} />
      <Skeleton.Input active style={{ width: "100%", height: 12 }} />
      <Skeleton.Input active style={{ width: "80%", height: 12, marginBottom: 18 }} />

      <Skeleton.Input active style={{ width: "100%", margin: "8px 0" }} />
      <Skeleton.Input active style={{ width: "100%", height: 12 }} />
      <Skeleton.Input active style={{ width: "100%", height: 12 }} />
      <Skeleton.Input active style={{ width: "80%", height: 12, marginBottom: 18 }} />

      <Skeleton.Input active style={{ width: "100%", margin: "8px 0" }} />
    </Flex>
  );
};

export default SkeletonSeoReport;
