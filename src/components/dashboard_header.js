import { ArrowBack } from "@mui/icons-material";
import { Stack, Typography, Button, Skeleton, Box } from "@mui/material";
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
        <Box
          sx={{
            width: "100%",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ py: 2, px: 2, borderRadius: 3 }}
          >
            <Stack direction="column">
              <Typography variant="h5" component="div" fontWeight={500}>
                {userData[0].FirstName} {userData[0].LastName}
              </Typography>
              <Typography variant="body1" component="div">
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
      )}
    </>
  );
}

export default DashboardHeader;
