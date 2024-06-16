import { ArrowBack, AccountCircle } from "@mui/icons-material";
import {
  Stack,
  Typography,
  Button,
  Skeleton,
  Box,
  Avatar,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import serveSupabaseClient from "../client/client";

function StaffDashboardHeader(props) {
  const { userData } = props;
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
      {userData != null ? (
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
            to={`/user/${userData[0].id}`}
            style={{ textDecoration: "none" }}
          >
            <Avatar
              sx={{
                width: 48,
                height: 48,
                marginRight: 2,
                backgroundColor: userData[0].FirstName ? "#a7bed3" : "#bdbdbd",
                cursor: "pointer",
              }}
            >
              {userData[0].FirstName ? (
                `${userData[0].FirstName[0].toUpperCase()}${userData[0].LastName[0].toUpperCase()}`
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
              {userData[0].FirstName
                ? `${userData[0].FirstName} ${userData[0].LastName}`
                : "No Profile"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#00695c", textTransform: "capitalize" }}
            >
              {userData[0].PositionHeld != null
                ? userData[0].PositionHeld
                : "Waiting for activation"}
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

export default StaffDashboardHeader;
