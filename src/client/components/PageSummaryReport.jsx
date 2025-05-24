import { Card, Typography } from "antd";
import SkeletonPageSummaryReport from "./SkeletonPageSummaryReport";

const { Text } = Typography;

const PageSummaryReport = ({ report, loading }) => {
  if (!report || loading) return <SkeletonPageSummaryReport />;

  return (
    <Card title="Page Summary" style={{ position: "sticky", top: 24 }}>
      <ul style={{ listStyle: "inside", display: "flex", flexDirection: "column", gap: 6 }}>
        {report?.pageSummary?.map((item, index) => (
          <li key={index}>
            <Text style={{ fontWeight: 600 }}>{item.label}:</Text> {item.value || "N/A"}
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default PageSummaryReport;
