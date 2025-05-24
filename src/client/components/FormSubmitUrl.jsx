import { LoadingOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Flex, Form, Input, Space } from 'antd';
import { useState } from 'react';
import Reaptcha from 'reaptcha';
import { useAdmin } from '../hooks';
import './FormSubmitUrl.scss';

const FormSubmitUrl = ({ loading, onFinish }) => {
  const { isAdmin } = useAdmin();
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [urlOptions, setUrlOptions] = useState(
    typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('audit_url_history') || '[]') : []
  );

  const checkUrl = (url) => {
    if (!url) {
      setError('URL is required');
      return false;
    }

    const urlToCheck = url.startsWith('http') ? url : 'https://' + url;

    const urlRegex =
      /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

    if (!urlRegex.test(urlToCheck)) {
      setError('Invalid URL format');
      return false;
    }

    setError('');
    return true;
  };

  const fixLayout = () => {
    if (typeof window === 'undefined') return;

    const homeEl = document.querySelector('.mtm-home-page.mtm-primal');
    if (!homeEl) return;

    const mainEl = homeEl.querySelector('.mtm-main');
    if (!mainEl) return;

    const roofEl = mainEl.querySelector('.mtm-heading');
    if (!roofEl) return;

    const mainPaddingTop = roofEl.getBoundingClientRect().top - 64;
    mainEl.style.paddingTop = mainPaddingTop + 'px';
    homeEl.classList.remove('mtm-primal');
  };

  const onChange = (url) => {
    fixLayout();
    // const urlToSave = url.replace(/(^\w+:|^)\/\//, "");
    const urlToSave = url;
    checkUrl(urlToSave);
    setUrl(urlToSave);
  };

  return (
    <Form
      className="mtm-form-audit"
      onFinish={() => {
        if (isAdmin) {
          onFinish(url);
          return;
        }

        if (showCaptcha) {
          setShowCaptcha(false);
          return;
        }

        if (checkUrl(url)) {
          if (typeof window !== 'undefined') {
            const urlOption = { label: url, value: url };
            const optionIndex = urlOptions.findIndex((option) => option.value === urlOption.value);
            if (optionIndex !== -1) urlOptions.splice(optionIndex, 1);
            setUrlOptions([urlOption, ...urlOptions]);
            localStorage.setItem('audit_url_history', JSON.stringify([...new Set([urlOption, ...urlOptions])]));
          }

          setShowCaptcha(true);
        }
      }}
    >
      <Space.Compact style={{ width: '100%' }}>
        <AutoComplete
          style={{ width: '100%' }}
          options={urlOptions}
          onSelect={(value) => onChange(value)}
          filterOption={(inputValue, option) => option?.value?.toUpperCase()?.indexOf(inputValue.toUpperCase()) !== -1}
          value={url}
          disabled={loading || showCaptcha}
        >
          <Input
            // addonBefore="https://"
            placeholder="Your website URL"
            value={url}
            onChange={(e) => onChange(e.target.value)}
            onPaste={(e) => onChange(e.clipboardData.getData('text'))}
            size="large"
            disabled={loading || showCaptcha}
            id="hello"
          />
        </AutoComplete>
        <Button
          size="large"
          type="primary"
          danger={showCaptcha}
          htmlType="submit"
          icon={loading ? <LoadingOutlined /> : showCaptcha ? <CloseCircleOutlined /> : null}
          loading={loading}
          disabled={error || !url}
        >
          {loading ? 'Checking' : showCaptcha ? 'Cancel' : 'Check website'}
        </Button>
      </Space.Compact>

      {error && <p style={{ color: '#F24A6F', marginTop: '8px', marginLeft: '16px' }}>{error}</p>}

      {showCaptcha && (
        <Flex justify="center" style={{ marginTop: 16 }}>
          <Reaptcha
            sitekey={import.meta.env.VITE_SITE_KEY}
            onVerify={(token) => {
              if (token) {
                setError('');
                setShowCaptcha(false);
                onFinish(url, token);
              } else setError('Captcha verification failed');
            }}
          />
        </Flex>
      )}
    </Form>
  );
};

export default FormSubmitUrl;
