import { ArrowBack } from "@mui/icons-material";
<<<<<<< HEAD
import { Stack, Typography, Button, Skeleton, Box } from "@mui/material"; 
=======
import { Stack, Typography, Button, Skeleton } from "@mui/material";
>>>>>>> 545a93ef4fbf697aef044d31c131dc61bda1ca7c
import { useNavigate } from "react-router-dom";
import serveSupabaseClient from "../client/client";

function DashboardHeader(props) {
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
<<<<<<< HEAD
        <Box sx={{ width: "100%", backgroundColor: "#f5f5f5" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ py: 2, px: 2, borderRadius: 3 }}
          >
            <Stack direction="column">
              <Typography variant="h5" component="div" fontWeight={500}>
                {userData[0].FirstName} {userData[0].LastName}
              </Typography>
              <Typography variant="body1" component="div" color="text.secondary">
                {userData[0].PositionHeld != null
                  ? userData[0].PositionHeld
                  : "Waiting for activation"}
              </Typography>
            </Stack>
            <Stack>
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Stack>
          </Stack>
        </Box>
      ) : (
        <Box sx={{ width: "100%", backgroundColor: "#f5f5f5" }}>
          <Stack sx={{ p: 2 }}>
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
          </Stack>
        </Box>
=======
        <Stack direction="row" justifyContent="space-between" sx={{ py: 2 }}>
          <Stack direction="column">
            <Typography variant="h5" component="div" fontWeight={500}>
              {userData[0].FirstName} {userData[0].LastName}
            </Typography>
            <Typography variant="body1" component="div" color="text.secondary">
              {userData[0].PositionHeld != null
                ? userData[0].PositionHeld
                : "Waiting for activation"}
            </Typography>
          </Stack>
          <Stack>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Stack>
        </Stack>
      ) : (
        <Stack sx={{ p: 2 }}>
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
        </Stack>
>>>>>>> 545a93ef4fbf697aef044d31c131dc61bda1ca7c
      )}
    </>
  );
}

export default DashboardHeader;
