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
  Card,
  CardContent,
} from "@mui/material";
import { useState, useEffect } from "react";
import serveSupabaseClient from "./client/client";
import { ArrowDownwardRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import TabPanel from "./components/tab_panel";
import {
  WardSelectComponent,
  SuppliesSelectComponent,
} from "./components/select_component";
import DashboardHeader from "./components/dashboard_header";
import {
  useFetchPatients,
  useFetchStaffs,
  useFetchSupplies,
  useFetchUserData,
  useFetchWards,
} from "./client/fetch_hooks";

function DashboardPage() {
  const navigate = useNavigate();

  const userData = useFetchUserData();
  const wards = useFetchWards();
  const supplies = useFetchSupplies();
  const staffs = useFetchStaffs();
  const patients = useFetchPatients();

  const [selectedWard, setSelectedWard] = useState("Oncology");
  const [selectedSupply, setSelectedSupply] = useState("Gauze Pads");

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
      console.log(selectedData);

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
      <DashboardHeader userData={userData} />

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
            <TabPanel value={tabValue} index={0}>
              <Stack direction="row" gap={2}>
                <WardSelectComponent
                  helper_text="Select a ward to display"
                  value={selectedWard}
                  onChange={handleSelectWardChange}
                  data={wards}
                />
                {selectedSupplyData != null ? (
                  <Card sx={{ p: 1, my: 2, ml: 2, width: "80%" }}>
                    <CardContent>
                      <Typography>
                        <b>Location</b>: {selectedWardData[0].Location} (
                        {selectedWardData[0].TelephoneExtension})
                      </Typography>
                      <Typography>
                        <b>Total beds</b>: {selectedWardData[0].TotalBeds}
                      </Typography>
                    </CardContent>
                  </Card>
                ) : (
                  <Skeleton />
                )}
              </Stack>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <Stack direction="row" gap={2}>
                <SuppliesSelectComponent
                  helper_text="Select a supply to display"
                  value={selectedSupply}
                  onChange={handleSelectSupplyChange}
                  data={supplies}
                />
                {selectedSupplyData && selectedSupplyData.length > 0 ? (
                  <Card sx={{ p: 1, my: 2, ml: 2, width: "80%" }}>
                    <CardContent>
                      <Typography gutterBottom>
                        {selectedSupplyData[0].ItemDescription}
                      </Typography>
                      <Typography>
                        <b>Category</b>: {selectedSupplyData[0].Category}
                      </Typography>
                      <Typography>
                        <b>Cost per unit</b>:{" "}
                        {selectedSupplyData[0].CostPerUnit}
                      </Typography>
                      <Typography>
                        <b>Quantity in stock</b>:{" "}
                        {selectedSupplyData[0].QuantityInStock}
                      </Typography>
                      <Typography>
                        <b>Reorder level</b>:{" "}
                        {selectedSupplyData[0].ReorderLevel}
                      </Typography>
                    </CardContent>
                  </Card>
                ) : (
                  <Skeleton />
                )}
              </Stack>
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <Stack direction="row" gap={2} flexWrap="wrap">
                {staffs != null ? (
                  staffs.map((e) => (
                    <Stack component="div" key={e.StaffID}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ArrowDownwardRounded />}>
                          <Typography variant="body1" fontWeight={500}>
                            {e.FirstName} (S{e.StaffID})
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography variant="body1" color="text.secondary">
                            <b>Address:</b> {e.FullAddress}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            <b>NiN:</b> {e.NiN}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            <b>Position:</b> {e.PositionHeld}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            <b>Sex:</b>{" "}
                            {e.Sex === "M" || e.Sex === "m" ? "Male" : "Female"}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            <b>Telephone Number:</b> {e.TelephoneNumber}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            <b>Date of Birth:</b> {e.DateOfBirth}
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
            <TabPanel value={tabValue} index={3}>
              <Stack direction="row" gap={2} flexWrap="wrap">
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
        <Skeleton animation="wave" />
      )}
    </Container>
  );
}

export default DashboardPage;
