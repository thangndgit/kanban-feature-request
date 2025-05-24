import { AutoComplete, Button, Flex, Form, Input } from 'antd';
import { callApi } from '../utils/api';
import { verifyApi } from '../apis';
import { useState } from 'react';
import Reaptcha from 'reaptcha';
import notify from '../utils/notify';

const FormExportReport = ({ report, onExport }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [emailOptions, setEmailOptions] = useState(
    typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('email_history') || '[]') : []
  );

  const handleExportReport = async (token) => {
    if (!report || !email || error) return;

    try {
      const verifyData = await callApi(verifyApi.verifyCaptcha(token));

      const captchaValid = verifyData?.data?.success;

      if (!captchaValid) {
        notify.error('Captcha validation failed. Please try again.');
        return;
      } else {
        setSaving(true);

        const geoRes = await fetch('https://get.geojs.io/v1/ip/geo.json');
        const geoData = await geoRes.json();

        const visitorData = {
          email: email,
          ip: geoData?.ip,
          country: geoData?.country,
          city: geoData?.city,
          region: geoData?.region,
          timezone: geoData?.timezone,
          longitude: geoData?.longitude,
          latitude: geoData?.latitude,
        };

        await onExport(visitorData);

        setSaving(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onChange = (email) => {
    const isEmailValid = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(email);
    if (isEmailValid) setError('');
    else if (!email) setError('Email is required');
    else setError('Invalid email format');
    setEmail(email);
  };

  return (
    <Form
      onFinish={() => {
        if (showCaptcha) {
          setShowCaptcha(false);
          return;
        }

        if (typeof window !== 'undefined') {
          const emailOption = { label: email, value: email };
          const optionIndex = emailOptions.findIndex((option) => option.value === emailOption.value);
          if (optionIndex !== -1) emailOptions.splice(optionIndex, 1);
          setEmailOptions([emailOption, ...emailOptions]);
          localStorage.setItem('email_history', JSON.stringify([...new Set([emailOption, ...emailOptions])]));
        }

        setShowCaptcha(true);
      }}
    >
      <Flex gap="small">
        <AutoComplete
          style={{ width: '100%' }}
          options={emailOptions}
          onSelect={(value) => onChange(value)}
          filterOption={(inputValue, option) => option?.value?.toUpperCase()?.indexOf(inputValue.toUpperCase()) !== -1}
          value={email}
          disabled={saving || showCaptcha}
        >
          <Input
            placeholder="Enter your email . . ."
            style={{ width: '100%' }}
            value={email}
            onChange={(e) => onChange(e.target.value)}
            disabled={saving}
          />
        </AutoComplete>
        <Button htmlType="submit" type="primary" danger={showCaptcha} disabled={!email || error} loading={saving}>
          {saving ? 'Submitting...' : showCaptcha ? 'Cancel' : 'Submit'}
        </Button>
      </Flex>
      {showCaptcha && (
        <Flex justify="center" style={{ marginTop: 12 }}>
          <Reaptcha
            sitekey={import.meta.env.VITE_SITE_KEY}
            onVerify={(token) => {
              if (token) {
                setError('');
                setShowCaptcha(false);
                handleExportReport(token);
              } else setError('Captcha verification failed');
            }}
          />
        </Flex>
      )}
      {error && <p style={{ color: '#f24a6f', marginTop: '3px' }}>{error}</p>}
    </Form>
  );
};

export default FormExportReport;
