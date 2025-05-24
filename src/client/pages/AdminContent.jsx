import { Button, Flex, Form, Input, Switch, Typography } from 'antd';
import { AdminContainer, CustomCard } from '../components';
import { useCallback, useEffect, useState } from 'react';
import { debounce } from '../utils/debounce';
import { callApi } from '../utils/api';
import { pageConfigApi } from '../apis';
import { toast } from 'react-toastify';
import { EyeOutlined } from '@ant-design/icons';
import notify from '../utils/notify';

const { TextArea } = Input;
const { Title } = Typography;

const AdminContent = ({ isDev = false }) => {
  const [formData, setFormData] = useState({
    pageHTML: '',
    pageCSS: '',
    pageJS: '',
  });
  const [previewContent, setPreviewContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updatePreviewContent = useCallback(
    debounce((data = {}) => {
      const { pageHTML, pageCSS, pageJS } = data;
      const content = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <style>${pageCSS}</style>
        </head>
        <body class="mtm-custom-content" style="margin: 0">
          ${pageHTML}
          <script>${pageJS}</script>
        </body>
        </html>
      `;
      setPreviewContent(content);
    }, 300),
    []
  );

  useEffect(() => {
    setIsLoading(true);
    callApi(
      pageConfigApi.get(isDev),
      (data) => {
        setFormData(data?.data);
        updatePreviewContent(data?.data);
        setIsLoading(false);
      },
      (error) => {
        notify.error(error);
        console.error(error);
      }
    );
  }, [updatePreviewContent, isDev]);

  const handleFormChange = (event) => {
    const { id, value } = event.target;
    const newFormData = { ...formData, [id]: value };
    setFormData(newFormData);
    updatePreviewContent(newFormData);
  };

  const handleSave = async () => {
    setIsLoading(true);
    await callApi(pageConfigApi.upsert(formData));
    setIsLoading(false);
    toast.success('Page content updated');

    if (typeof window === 'undefined') return;
  };

  const handlePublish = async () => {
    setIsLoading(true);
    await Promise.all([
      callApi(pageConfigApi.upsert({ ...formData, isDev: true })),
      callApi(pageConfigApi.upsert({ ...formData, isDev: false })),
    ]);
    setIsLoading(false);
    toast.success('Page content published');
  };

  return (
    <AdminContainer
      title={`Page editor (${isDev ? 'DEV' : 'LIVE'})`}
      className="mtm-admin-dashboard-page"
      maxWidth="1080px"
      primaryAction={
        <Button type="primary" size="large" style={{ fontWeight: 500 }} onClick={handlePublish} loading={isLoading}>
          Publish
        </Button>
      }
      secondaryAction={
        isDev && (
          <>
            <Button size="large" href="/preview-dev" target="_blank" icon={<EyeOutlined />} loading={isLoading} />
            <Button size="large" style={{ fontWeight: 500 }} onClick={handleSave} loading={isLoading}>
              Save draft
            </Button>
          </>
        )
      }
    >
      <Form onChange={handleFormChange}>
        <Flex vertical gap="middle">
          <CustomCard title="Page config">
            <Flex gap="middle" justify="space-between">
              <Flex gap="small">
                <Title level={5} style={{ fontSize: 14 }}>
                  Show header
                </Title>
                <Switch
                  id="showHeader"
                  checked={formData.showHeader}
                  onChange={(checked) => setFormData({ ...formData, showHeader: checked })}
                />
              </Flex>

              <Flex gap="small">
                <Title level={5} style={{ fontSize: 14 }}>
                  Show content
                </Title>
                <Switch
                  id="showContent"
                  checked={formData.showContent}
                  onChange={(checked) => setFormData({ ...formData, showContent: checked })}
                />
              </Flex>

              <Flex gap="small">
                <Title level={5} style={{ fontSize: 14 }}>
                  Show footer
                </Title>
                <Switch
                  id="showFooter"
                  checked={formData.showFooter}
                  onChange={(checked) => setFormData({ ...formData, showFooter: checked })}
                />
              </Flex>
            </Flex>
          </CustomCard>

          <CustomCard title="Custom content">
            <Flex vertical gap="middle">
              <div>
                <Title level={5} style={{ fontSize: 14 }}>
                  Custom HTML
                </Title>
                <TextArea
                  required
                  id="pageHTML"
                  title="Custom HTML"
                  autoSize={{ minRows: 5, maxRows: 15 }}
                  placeholder="Enter custom HTML"
                  value={formData.pageHTML}
                />
              </div>

              <div>
                <Title level={5} style={{ fontSize: 14 }}>
                  Custom CSS
                </Title>
                <TextArea
                  required
                  id="pageCSS"
                  title="Custom CSS"
                  autoSize={{ minRows: 5, maxRows: 15 }}
                  placeholder="Enter custom CSS"
                  value={formData.pageCSS}
                />
              </div>

              <div>
                <Title level={5} style={{ fontSize: 14 }}>
                  Custom JS
                </Title>
                <TextArea
                  required
                  id="pageJS"
                  title="Custom JS"
                  autoSize={{ minRows: 5, maxRows: 15 }}
                  placeholder="Enter custom JS"
                  value={formData.pageJS}
                />
              </div>
            </Flex>
          </CustomCard>

          <CustomCard title="Preview (without header & footer)">
            <iframe
              title="Preview"
              srcDoc={previewContent}
              style={{
                width: '100%',
                height: 'calc(100dvh - 120px)',
                background: 'white',
                borderRadius: '8px',
              }}
            />
          </CustomCard>
        </Flex>
      </Form>
    </AdminContainer>
  );
};

export default AdminContent;
