import { Card, Container } from "react-bootstrap";

function WelcomeCard() {
  return (
    <Container className="mt-5">
      <Card text="light" className="text-center" style={{backgroundColor: "transparent", border: "none"}}>
        <Card.Body className="py-5">
          <Card.Title className="display-6 fw-bold text-warning mb-3">
            Welcome to Eclipse Bar
          </Card.Title>
          <Card.Text className="text-white fs-5 fw-semibold">
            Connect with your loved ones, share the flavor and live the experience where day and night meet.
          </Card.Text>
          <img src="/brindis.png" alt="brindis" width={180} className="align-middle" />
        </Card.Body>
      </Card>
    </Container>
  );
}

export default WelcomeCard;