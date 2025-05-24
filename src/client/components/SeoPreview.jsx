import { Card, Flex, Typography } from "antd";
import SkeletonSeoPreview from "./SkeletonSeoPreview";

const { Text } = Typography;

const SeoPreview = ({ report, loading }) => {
  if (!report || loading) return <SkeletonSeoPreview />;

  const seo = {
    title: report?.pageSummary?.find((item) => item.key === "meta_title")?.value || "N/A",
    description: report?.pageSummary?.find((item) => item.key === "meta_description")?.value || "N/A",
    url: report?.pageSummary?.find((item) => item.key === "page_url")?.value || "N/A",
  };

  return (
    <Card title="SEO Preview" style={{ marginBottom: 24 }}>
      <div style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", borderRadius: 10, padding: 10 }}>
        <Flex gap="small" vertical>
          <Text style={{ fontSize: "18px", color: "#1a0dab", overflowWrap: "break-word", wordBreak: "break-word" }}>
            {seo.title?.length > 60 ? seo.title.slice(0, 60) + "..." : seo.title}
          </Text>
          <Text type="secondary" style={{ fontSize: 12, color: "#006621", wordBreak: "break-all" }}>
            {seo.url?.length > 60 ? seo.url.slice(0, 60) + "..." : seo.url}
          </Text>
          <Text style={{ fontSize: 13, color: "#545454", wordWrap: "break-word" }}>
            {seo.description?.length > 160 ? seo.description.slice(0, 160) + "..." : seo.description}
          </Text>
        </Flex>
      </div>
    </Card>
  );
};

export default SeoPreview;
