import { Link } from "react-router-dom";
import Container from "../components/common/Container";
import Button from "../components/common/Button";
import { ar } from "../locales/ar";

export default function NotFoundPage() {
  return (
    <Container>
      <section
        style={{
          padding: "5rem 0",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: "4rem", color: "var(--color-primary)" }}>404</h1>
        <h2 style={{ fontSize: "1.5rem" }}>{ar.misc.notFoundTitle}</h2>
        <p style={{ color: "var(--color-text-muted)" }}>
          {ar.misc.notFoundMessage}
        </p>
        <Link to="/" style={{ marginTop: "1rem" }}>
          <Button>{ar.misc.backHome}</Button>
        </Link>
      </section>
    </Container>
  );
}
