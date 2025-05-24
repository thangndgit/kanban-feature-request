import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { Divider, Flex, Popover, Tag, Typography } from "antd";
import constants from "../constants/constants";

const { Text } = Typography;

const PerformanceMetricItem = ({ metric, showDetails, print }) => {
  const colors = {
    good: constants.COLOR.GOOD,
    warning: constants.COLOR.WARNING,
    critical: constants.COLOR.CRITICAL,
    default: "#C9C9C9",
  };

  const tags = {
    good: (
      <Tag color="success" icon={!print && <CheckCircleOutlined />}>
        Good
      </Tag>
    ),
    warning: (
      <Tag color="warning" icon={!print && <ExclamationCircleOutlined />}>
        Moderate
      </Tag>
    ),
    critical: (
      <Tag color="error" icon={!print && <CloseCircleOutlined />}>
        Poor
      </Tag>
    ),
    default: (
      <Tag color="default" icon={!print && <MinusCircleOutlined />}>
        No Data
      </Tag>
    ),
  };

  return (
    <Flex gap="small" vertical>
      <Text style={{ fontWeight: 600 }}>
        {metric?.title} - {metric?.shorthand}
      </Text>

      <Flex gap="small" align="center" justify="space-between">
        <Popover
          trigger="hover"
          title={
            <Text style={{ fontWeight: 600 }}>
              {metric?.title} - {metric?.shorthand}
            </Text>
          }
          content={
            <Flex vertical gap="small" style={{ minWidth: 240 }}>
              <Flex justify="space-between" gap="small" style={{ paddingTop: 8 }}>
                {tags.good}
                <Text style={metric?.rank === "good" ? { fontWeight: 600 } : {}}>
                  0 - {metric?.breakpoint?.[0]?.toLocaleString()} {metric?.unit}
                </Text>
              </Flex>
              <Flex justify="space-between" gap="small">
                {tags.warning}
                <Text style={metric?.rank === "warning" ? { fontWeight: 600 } : {}}>
                  {metric?.breakpoint?.[0]?.toLocaleString()} - {metric?.breakpoint?.[1]?.toLocaleString()}{" "}
                  {metric?.unit}
                </Text>
              </Flex>
              <Flex justify="space-between" gap="small">
                {tags.critical}
                <Text style={metric?.rank === "critical" ? { fontWeight: 600 } : {}}>
                  &gt; {metric?.breakpoint?.[1]?.toLocaleString()} {metric?.unit}
                </Text>
              </Flex>
            </Flex>
          }
        >
          {tags[metric?.rank || "default"]}
        </Popover>

        <Text style={{ color: colors[metric?.rank || "default"], fontSize: 20, lineHeight: 1, fontWeight: 600 }}>
          {metric?.displayValue}
        </Text>
      </Flex>

      {showDetails && (
        <>
          <Divider style={{ margin: 0 }} />
          <Text type="secondary" style={{ textAlign: "justify" }}>
            {metric?.tooltip}
          </Text>
        </>
      )}
    </Flex>
  );
};

export default PerformanceMetricItem;
