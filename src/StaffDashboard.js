import {
  Container,
  Stack,
  Typography,
  Skeleton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Box,
  Grid,
} from "@mui/material";
import { useState, useEffect } from "react";
import serveSupabaseClient from "./client/client";
import { ArrowDownwardRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import TabPanel from "./components/tab_panel";
import StaffDashboardHeader from "./components/staff_dashboard_header";
import {
  useFetchPatients,
  useFetchStaffs,
  useFetchSupplies,
  useFetchUserData,
  useFetchWards,
} from "./client/fetch_hooks";
import WardComponent from "./components/ward_component";
import SuppliesComponent from "./components/supplies_component";
import {
  StaffsWithNoPositionsComponent,
  StaffsWithPositionsComponent,
} from "./components/staff_component";

function StaffDashboardPage() {
  const navigate = useNavigate();

  const userData = useFetchUserData();
  const wards = useFetchWards();
  const supplies = useFetchSupplies();
  const staffs = useFetchStaffs();
  const patients = useFetchPatients();

  const [selectedWard, setSelectedWard] = useState("Oncology");
  const [selectedSupply, setSelectedSupply] = useState("Gloves");

  const [selectedWardData, setSelectedWardData] = useState(null);
  const [selectedSupplyData, setSelectedSupplyData] = useState(null);

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSelectWardChange = (event) => {
    setSelectedWard(event.target.value);
  };

  const handleSelectSupplyChange = (event) => {
    setSelectedSupply(event.target.value);
  };

  useEffect(() => {
    const handleRedirection = async () => {
      const {
        data: { session: currentSession },
        error,
      } = await serveSupabaseClient.auth.getSession();

      if (error) {
        console.error("Error fetching session:", error.message);
      }

      if (!currentSession) {
        navigate("/");
      } else {
      }
    };

    const renderSelectedWard = async () => {
      const { data: selectedData, error } = await serveSupabaseClient
        .from("Ward")
        .select("*")
        .eq("WardName", selectedWard);

      if (error) {
        console.error("Error fetching selected ward data:", error);
      } else {
        setSelectedWardData(selectedData);
      }
    };

    const renderSelectedSupply = async () => {
      const { data: selectedData, error } = await serveSupabaseClient
        .from("Supply")
        .select("*")
        .eq("ItemName", selectedSupply);

      if (error) {
        console.error("Error fetching selected supply data:", error);
      } else {
        setSelectedSupplyData(selectedData);
      }
    };

    renderSelectedWard();
    renderSelectedSupply();
    handleRedirection();
  }, [selectedWard, selectedSupply, navigate]);

  return (
    <Container fixed>
      <StaffDashboardHeader userData={userData} />

      {userData != null ? (
        userData[0].PositionHeld != null ? (
          <>
            <Stack
              sx={{ borderBottom: 1, borderColor: "divider" }}
              direction="row"
            >
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Wards" />
                <Tab label="Supplies" />
                <Tab label="Staffs" />
                <Tab label="Patients" />
              </Tabs>
            </Stack>

            {/* WARDS */}
            <TabPanel value={tabValue} index={0}>
              <WardComponent
                selectedWard={selectedWard}
                handleSelectWardChange={handleSelectWardChange}
                wards={wards}
                selectedWardData={selectedWardData}
              />
            </TabPanel>
            {/* WARDS */}

            {/* SUPPLIES */}
            <TabPanel value={tabValue} index={1}>
              <SuppliesComponent
                value={selectedSupply}
                handleSelectSupplyChange={handleSelectSupplyChange}
                supplies={supplies}
                selectedSupplyData={selectedSupplyData}
              />
            </TabPanel>
            {/* SUPPLIES */}

            {/* STAFFS */}
            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography sx={{ textTransform: "capitalize" }}>
                    <StaffsWithPositionsComponent staffs={staffs} />
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ textTransform: "capitalize" }}>
                    <StaffsWithNoPositionsComponent staffs={staffs} />
                  </Typography>
                </Grid>
              </Grid>
            </TabPanel>
            {/* STAFFS */}

            <TabPanel value={tabValue} index={3}>
              <Stack direction="column" gap={2} flexWrap="wrap">
                {patients != null ? (
                  patients.map((e) => (
                    <Stack component="div" key={e.SupplyID}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ArrowDownwardRounded />}>
                          <Typography
                            variant="body1"
                            fontWeight={500}
                            style={{ textTransform: "capitalize" }}
                          >
                            {e.FirstName} {e.LastName}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography variant="body1" color="text.secondary">
                            <b>Patient Number:</b> {e.PatientID}
                          </Typography>
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            style={{ textTransform: "capitalize" }}
                          >
                            <b>Patient Type:</b> {e.PatientType}
                          </Typography>
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            style={{ textTransform: "capitalize" }}
                          >
                            <b>Marital Status:</b> {e.MaritalStatus}
                          </Typography>
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            style={{ textTransform: "capitalize" }}
                          >
                            <b>Address:</b> {e.FullAddress}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            <b>Registration Date:</b> {e.RegistrationDate}
                          </Typography>
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            style={{ textTransform: "capitalize" }}
                          >
                            <b> Sex:</b> {e.Sex}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            <b>Telephone Number:</b> {e.TelephoneNumber}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    </Stack>
                  ))
                ) : (
                  <Box sx={{ p: 2, width: "100%" }}>
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                  </Box>
                )}
              </Stack>
            </TabPanel>
          </>
        ) : (
          <Typography variant="body1">
            Please contact your system administrator.
          </Typography>
        )
      ) : (
        <>
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
        </>
      )}
    </Container>
  );
}

export default StaffDashboardPage;