import { Card, Row, Col, Typography } from 'antd';
const { Meta } = Card;
const { Text } = Typography;

const AppsGrid = ({ apps, onCardClick }) => (
  <Row gutter={[16, 16]}>
    {apps.map((app) => (
      <Col xs={24} sm={12} md={8} lg={6} key={app._id}>
        <Card
          hoverable
          style={{
            width: '100%',
            border: '2px solid',
            borderImage: 'linear-gradient(135deg, #f24a6f, #f3935f) 1',
            boxShadow: '0 2px 12px rgba(242, 74, 111, 0.08)',
          }}
          cover={
            <div style={{ height: 160, overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
              <img
                alt={app.name}
                src={app.imageUrl || 'https://placehold.co/500x500?text=NO+IMAGE'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://placehold.co/500x500?text=NO+IMAGE';
                }}
              />
            </div>
          }
          onClick={() => onCardClick(app._id)}
        >
          <Meta
            title={app.name}
            description={
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {app.description || 'No description'}
                </Text>
              </div>
            }
          />
        </Card>
      </Col>
    ))}
  </Row>
);

export default AppsGrid;

