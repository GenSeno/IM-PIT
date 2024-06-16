import { KeyRounded } from "@mui/icons-material";
import {
  Container,
  Typography,
  TextField,
  Stack,
  Button,
  Link,
  Alert,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import serveSupabaseClient from "./client/client";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await serveSupabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setIsError(true);
      setErrorMessage(error.message);
    } else {
      navigate("/dashboard");
    }
  };

  const handleRedirection = async () => {
    const {
      data: { session: currentSession },
      error,
    } = await serveSupabaseClient.auth.getSession();

    if (error) {
      console.error("Error fetching session:", error.message);
      return;
    }

    if (currentSession) {
      navigate("/dashboard/");
    } else {
      console.log("No session found.");
    }
  };

  useEffect(() => {
    handleRedirection();
  }, []);

  return (
    <Container
      disableGutters
      maxWidth={false}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e0f7fa 25%, #80deea 100%)",
        backgroundSize: "cover, 100px 100px",
        backgroundRepeat: "no-repeat, repeat",
      }}
    >
      <Paper
        elevation={3}
        style={{
          padding: "2rem",
          borderRadius: "1rem",
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <Stack direction="column" gap={2} alignItems="center">
          <Typography
            variant="h4"
            fontWeight="700"
            component="h4"
            style={{ color: "#00695c" }}
          >
            Wellmeadows Hospital
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Sign in to your account
          </Typography>
          <Stack
            direction="column"
            gap={2}
            component="form"
            onSubmit={handleSubmit}
            width="100%"
          >
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<KeyRounded />}
              type="submit"
              fullWidth
              size="large"
            >
              Login
            </Button>
          </Stack>
          {isError && (
            <Alert severity="error" style={{ width: "100%" }}>
              {errorMessage}
            </Alert>
          )}
          <Link href="/sign-up" underline="none">
            Don't have an account? Sign up
          </Link>
        </Stack>
      </Paper>
    </Container>
  );
}

export default LoginPage;
