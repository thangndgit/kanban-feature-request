import { Button, Divider, Flex, Progress, Tag, Typography } from "antd";
import {
  CloseCircleOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined,
  CaretDownOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import constants from "../constants/constants";

const { Text } = Typography;

const LoadingExperienceMetricItem = ({ metric, showDetails, print }) => {
  const colors = {
    critical: constants.COLOR.CRITICAL,
    warning: constants.COLOR.WARNING,
    good: constants.COLOR.GOOD,
    default: "#C9C9C9",
  };

  const tags = {
    critical: (
      <Tag color="error" style={{ width: "fit-content" }} icon={!print && <CloseCircleOutlined />}>
        Poor
      </Tag>
    ),
    warning: (
      <Tag color="warning" style={{ width: "fit-content" }} icon={!print && <InfoCircleOutlined />}>
        Moderate
      </Tag>
    ),
    good: (
      <Tag color="success" style={{ width: "fit-content" }} icon={!print && <ExclamationCircleOutlined />}>
        Fast
      </Tag>
    ),
    default: (
      <Tag color="default" style={{ width: "fit-content" }} icon={!print && <MinusCircleOutlined />}>
        No Data
      </Tag>
    ),
  };

  const color = colors?.[metric?.rank || "default"];
  const hasValue = metric?.value || metric?.value === 0;

  return (
    <Flex vertical gap="small" style={{ width: "100%" }}>
      <Text style={{ fontWeight: 600 }}>
        {metric?.title} - {metric?.shorthand}
      </Text>

      {tags?.[metric?.rank || "default"]}

      <div style={{ position: "relative" }}>
        <Flex
          gap={0}
          vertical
          align="center"
          style={{ zIndex: 1, position: "absolute", bottom: 7, left: "75%", transform: "translateX(-50%)" }}
        >
          <Text style={{ color, fontSize: "20px", whiteSpace: "nowrap", fontWeight: 600 }}>
            {hasValue ? metric?.value?.toLocaleString() + " " + metric?.unit : "N/A"}
          </Text>
          <CaretDownOutlined style={{ color, fontSize: "20px" }} />
        </Flex>

        <Progress
          className="mtm-progress"
          strokeLinecap="square"
          success={{ percent: metric?.distributions?.[0]?.proportion * 100, strokeColor: "#0CCE6A" }}
          percent={metric?.distributions?.[1]?.proportion * 100 + metric?.distributions?.[0]?.proportion * 100}
          strokeColor="#FFA400"
          trailColor={hasValue ? "#FF4E43" : "#C9C9C9"}
          showInfo={false}
          size="small"
        />
      </div>

      {showDetails && (
        <>
          <Divider style={{ margin: 0 }} />

          <Flex justify="space-between">
            <Text type="secondary" style={{ color: colors.good }}>
              Good (0 - {metric?.breakpoint?.[0]?.toLocaleString()} {metric?.unit})
            </Text>
            <Text type="secondary" style={{ color: colors.good }}>
              {parseFloat((metric?.distributions?.[0]?.proportion * 100)?.toFixed(2))}%
            </Text>
          </Flex>

          <Flex justify="space-between">
            <Text type="secondary" style={{ color: colors.warning }}>
              Moderate ({metric?.breakpoint?.[0]?.toLocaleString()} {metric?.unit} -{" "}
              {metric?.breakpoint?.[1]?.toLocaleString()} {metric?.unit})
            </Text>
            <Text type="secondary" style={{ color: colors.warning }}>
              {parseFloat((metric?.distributions?.[1]?.proportion * 100)?.toFixed(2))}%
            </Text>
          </Flex>

          <Flex justify="space-between">
            <Text type="secondary" style={{ color: colors.critical }}>
              Poor (&gt; {metric?.breakpoint?.[1]?.toLocaleString()} {metric?.unit})
            </Text>
            <Text type="secondary" style={{ color: colors.critical }}>
              {parseFloat((metric?.distributions?.[2]?.proportion * 100)?.toFixed(2))}%
            </Text>
          </Flex>
        </>
      )}
    </Flex>
  );
};

export default LoadingExperienceMetricItem;
