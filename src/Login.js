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
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import serveSupabaseClient from "./client/client";
import { useNavigate } from "react-router-dom";

function LoginNIGGERTEST() {
  const yey = "what"
}

function LoginNIGGERTESX() {
  const yey = "what"
}

function LoginNIGGERTESTASASA() {
  const yey = "what";
}

function LoginNIGGERTESXXXX() {
  const yey = "what";
}

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [hasCurrentSession, setCurrentSessionState] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error: authSignInError } =
      await serveSupabaseClient.auth.signInWithPassword({
        email,
        password,
      });

    const { data: user, error: userError } =
      await serveSupabaseClient.auth.getUser();

    if (authSignInError) {
      setIsError(true);
      setErrorMessage(authSignInError.message);
    } else {
      if (user) {
        const { data: userProfile, error: userProfileError } =
          await serveSupabaseClient
            .from("Userlogin")
            .select("id")
            .eq("email", user.user.email)
            .single();

        const { data: staffProfile, error: staffProfileError } =
          await serveSupabaseClient
            .from("Staff")
            .select("Userlogin (id), userlogin_id")
            .eq("userlogin_id", userProfile.id);

        const { data: patientProfile, error: patientProfileError } =
          await serveSupabaseClient
            .from("Patient")
            .select(
              "FirstName, LastName, FullAddress, TelephoneNumber, Userlogin (id), Userlogin_ID"
            )
            .eq("Userlogin_ID", userProfile.id);

        if (staffProfileError) {
          console.error("Error fetching patient profile:", staffProfileError);
        } else {
          console.log(staffProfile);
          navigate("/staff_dashboard");
        }

        if (patientProfileError) {
          console.error("Error fetching patient profile:", patientProfileError);
        } else {
          console.log(patientProfile);
          navigate("/patient_dashboard");
        }
      }
    }
  };

  const handleRedirection = async () => {
    const {
      data: { session: currentSession },
      error: sessionError,
    } = await serveSupabaseClient.auth.getSession();

    const { data: user, error: userError } =
      await serveSupabaseClient.auth.getUser();

    if (currentSession) {
      console.log(currentSession);

      if (user) {
        const { data: userProfile, error: userProfileError } =
          await serveSupabaseClient
            .from("Userlogin")
            .select("id")
            .eq("email", user.user.email)
            .single();

        const { data: staffProfile, error: staffProfileError } =
          await serveSupabaseClient
            .from("Staff")
            .select("Userlogin (id), userlogin_id")
            .eq("userlogin_id", userProfile.id);

        const { data: patientProfile, error: patientProfileError } =
          await serveSupabaseClient
            .from("Patient")
            .select("Userlogin (id), Userlogin_ID")
            .eq("Userlogin_ID", userProfile.id);

        if (staffProfileError) {
          console.error("Error fetching patient profile:", staffProfileError);
        } else {
          console.log(staffProfile);
          navigate("/staff_dashboard");
        }

        if (patientProfileError) {
          console.error("Error fetching patient profile:", patientProfileError);
        } else {
          console.log(patientProfile);
          navigate("/patient_dashboard");
        }
      }
    } else {
      console.log("No session found.");
      setCurrentSessionState(false);
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
      {hasCurrentSession == null ? (
        <CircularProgress size={128} />
      ) : (
        <Paper
          elevation={3}
          style={{
            padding: "2rem",
            borderRadius: "1rem",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
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
      )}
    </Container>
  );
}

export default LoginPage;
