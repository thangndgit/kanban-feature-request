import { Card, Divider, Flex, Skeleton, Tooltip, Typography } from "antd";
import { ExclamationCircleOutlined, CaretDownOutlined } from "@ant-design/icons";

const { Text } = Typography;

const SkeletonLoadingExperienceReport = () => {
  return (
    <Card
      title={
        <Text style={{ fontWeight: 600 }}>
          Loading Experience&nbsp;&nbsp;
          <Tooltip title="Explore real user experiences from diverse devices and network connections. Based on extensive sampling over the latest 28-day period, including full visit durations and all Chrome versions.">
            <ExclamationCircleOutlined />
          </Tooltip>
        </Text>
      }
      style={{ position: "sticky", top: 24 }}
      extra={<Skeleton.Button active style={{ width: 100 }} />}
    >
      <Flex gap="small" vertical>
        <Skeleton.Input active style={{ width: "100%", marginBottom: 22 }} />

        <Skeleton.Input active style={{ width: "100%", height: 12 }} />
        <Skeleton.Input active style={{ width: "100%", height: 12 }} />
        <Skeleton.Input active style={{ width: "100%", height: 12 }} />
        <Skeleton.Input active style={{ width: "80%", height: 12 }} />

        <Divider style={{ margin: "8px 0 22px" }} />
        <Flex vertical gap="small" style={{ position: "relative" }}>
          <Skeleton.Input active style={{ width: "50%", height: 12 }} />
          <Skeleton.Button active style={{ width: 60, height: 22, margin: "-8px 0 12px" }} />
          <Skeleton.Input active style={{ width: "100%", height: 6 }} />
          <Flex
            vertical
            gap="small"
            align="center"
            style={{ position: "absolute", left: "75%", bottom: 18, transform: "translateX(-50%)" }}
          >
            <Skeleton.Button active style={{ width: 80 }} />
            <CaretDownOutlined style={{ color: "#DEDEDE", fontSize: 20 }} />
          </Flex>
        </Flex>

        <Divider style={{ margin: "8px 0 22px" }} />
        <Flex vertical gap="small" style={{ position: "relative" }}>
          <Skeleton.Input active style={{ width: "50%", height: 12 }} />
          <Skeleton.Button active style={{ width: 60, height: 22, margin: "-8px 0 12px" }} />
          <Skeleton.Input active style={{ width: "100%", height: 6 }} />
          <Flex
            vertical
            gap="small"
            align="center"
            style={{ position: "absolute", left: "75%", bottom: 18, transform: "translateX(-50%)" }}
          >
            <Skeleton.Button active style={{ width: 80 }} />
            <CaretDownOutlined style={{ color: "#DEDEDE", fontSize: 20 }} />
          </Flex>
        </Flex>

        <Divider style={{ margin: "8px 0 22px" }} />
        <Flex vertical gap="small" style={{ position: "relative" }}>
          <Skeleton.Input active style={{ width: "50%", height: 12 }} />
          <Skeleton.Button active style={{ width: 60, height: 22, margin: "-8px 0 12px" }} />
          <Skeleton.Input active style={{ width: "100%", height: 6 }} />
          <Flex
            vertical
            gap="small"
            align="center"
            style={{ position: "absolute", left: "75%", bottom: 18, transform: "translateX(-50%)" }}
          >
            <Skeleton.Button active style={{ width: 80 }} />
            <CaretDownOutlined style={{ color: "#DEDEDE", fontSize: 20 }} />
          </Flex>
        </Flex>

        <Skeleton.Button active style={{ width: 80, height: 20, margin: "auto", marginTop: 15, display: "block" }} />
      </Flex>
    </Card>
  );
};

export default SkeletonLoadingExperienceReport;
