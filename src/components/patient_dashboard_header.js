import {
  ArrowBack,
  AccountCircle,
  ArrowDownwardRounded,
} from "@mui/icons-material";
import {
  Stack,
  Typography,
  Button,
  Skeleton,
  Box,
  Avatar,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Grid,
  MenuItem,
  FormControl,
  FormHelperText,
  Select,
  TextField,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import serveSupabaseClient from "../client/client";

function PatientDashboardHeader(props) {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    const { error } = await serveSupabaseClient.auth.signOut();
    if (error) {
      console.error("Error during logout:", error.message);
    } else {
      navigate("/");
    }
  };

  return (
    <>
      {props.patient != null ? (
        <Box
          sx={{
            width: "97%",
            backgroundColor: "#f5f5f5",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            marginBottom: "20px",
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <Link
            to={`/user/${props.patient.id}`}
            style={{ textDecoration: "none" }}
          >
            <Avatar
              sx={{
                width: 48,
                height: 48,
                marginRight: 2,
                backgroundColor: props.patient.FirstName
                  ? "#a7bed3"
                  : "#bdbdbd",
                cursor: "pointer",
              }}
            >
              {props.patient.FirstName ? (
                `${props.patient.FirstName[0].toUpperCase()}${props.patient.LastName[0].toUpperCase()}`
              ) : (
                <AccountCircle sx={{ fontSize: 36 }} />
              )}
            </Avatar>
          </Link>
          <Stack direction="column" spacing={1} sx={{ flex: 1, marginLeft: 2 }}>
            <Typography
              variant="h5"
              fontWeight={600}
              sx={{ textTransform: "capitalize" }}
            >
              {props.patient.FirstName
                ? `${props.patient.FirstName} ${props.patient.LastName}`
                : "No Profile"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#00695c", textTransform: "capitalize" }}
            >
              {props.patient.PatientType != null ? (
                props.patient.PatientType
              ) : (
                <Skeleton />
              )}
            </Typography>
          </Stack>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleLogout}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "999px",
              borderColor: "#757575",
              "&:hover": {
                borderColor: "#000",
                backgroundColor: "#e0e0e0",
              },
            }}
          >
            Logout
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            width: "100%",
            backgroundColor: "#f5f5f5",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <Stack sx={{ py: 2, px: 3 }}>
            <Skeleton animation="wave" variant="text" />
            <Skeleton animation="wave" variant="text" />
          </Stack>
        </Box>
      )}
    </>
  );
}

function RegistrationForm() {
  return (
    <Stack direction="column" spacing={2}>
      <TextField label="First Name" variant="outlined" fullWidth />
      <TextField label="Last Name" variant="outlined" fullWidth />
      <TextField label="Email" type="email" variant="outlined" fullWidth />
      <TextField label="Address" variant="outlined" fullWidth />
      <TextField label="Phone Number" variant="outlined" fullWidth />
      <Button variant="contained" color="primary">
        Register
      </Button>
    </Stack>
  );
}

function MedicationForm() {
  return (
    <Stack direction="column" spacing={2}>
      <TextField label="Medication Name" variant="outlined" fullWidth />
      <TextField label="Dosage" variant="outlined" fullWidth />
      <TextField label="Frequency" variant="outlined" fullWidth />
      <TextField label="Start Date" type="date" variant="outlined" fullWidth />
      <TextField label="End Date" type="date" variant="outlined" fullWidth />
      <Button variant="contained" color="primary">
        Prescribe
      </Button>
    </Stack>
  );
}

function PatientDashboardPage(props) {
  const navigate = useNavigate();

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container fixed>
      <PatientDashboardHeader patient={props.patient} />

      <Stack
        sx={{ borderBottom: 1, borderColor: "divider" }}
        direction="row"
        marginTop={2}
        marginBottom={2}
      >
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Registration Form" />
          <Tab label="Medication Form" />
        </Tabs>
      </Stack>

      {/* Registration Form */}
      <Box hidden={tabValue !== 0}>
        <RegistrationForm />
      </Box>

      {/* Medication Form */}
      <Box hidden={tabValue !== 1}>
        <MedicationForm />
      </Box>
    </Container>
  );
}

export default PatientDashboardPage;
