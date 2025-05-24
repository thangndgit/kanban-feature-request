import { Button } from "antd";
import arrowIcon from "../assets/arrow.svg";
import "./PageFooter.scss";

const PageFooter = () => {
  return (
    <footer className="mtm-footer">
      <div className="mtm-footer__main">
        <div className="mtm-footer__content">
          <h2 className="mtm-heading">Get Started With SEO & Speed Optimizer Now!</h2>
          <p className="mtm-sub-heading">Go to Shopify app store to install Tapita SEO & Speed Optimizer App</p>
          <Button
            type="primary"
            className="mtm-button"
            icon={<img src={arrowIcon} alt="arrow" />}
            href="https://apps.shopify.com/google-seo-schema-meta-data"
            target="_blank"
          >
            Start for free
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default PageFooter;
