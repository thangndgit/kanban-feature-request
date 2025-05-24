import { Card } from 'antd';
import './CustomCard.scss';

const CustomCard = ({ children, ...props }) => {
  return (
    <Card className="mtm-custom-card" {...props}>
      {children}
    </Card>
  );
};

export default CustomCard;
