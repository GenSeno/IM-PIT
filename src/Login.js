import { KeyRounded } from "@mui/icons-material";
import {
  Container,
  Typography,
  TextField,
  Stack,
  Button,
  Link,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import serveSupabaseClient from "./client/client";
import { redirect, useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
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
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
      }}
      fixed
    >
      <Stack direction="column" gap={1}>
        <Typography variant="h4" fontWeight="700" component="h4">
          Wellmeadows Hospital
        </Typography>
        <Stack
          direction="column"
          gap={1}
          component="form"
          onSubmit={handleSubmit}
        >
          <Stack direction="row" gap={1}>
            <TextField
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Stack>
          <Button variant="outlined" startIcon={<KeyRounded />} type="submit">
            Login
          </Button>
        </Stack>
        {isError && <Alert severity="error">{errorMessage}</Alert>}
        <Link href="/sign-up" underline="none">
          Don't have an account?
        </Link>
      </Stack>
    </Container>
  );
}

export default LoginPage;
