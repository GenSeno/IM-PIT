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
  MenuItem,
  FormControl,
  FormHelperText,
  Select,
  TextField,
  Button,
  Alert,
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
  const [selectedSupply, setSelectedSupply] = useState("Amoxicillin");

  const [selectedWardData, setSelectedWardData] = useState(null);
  const [selectedSupplyData, setSelectedSupplyData] = useState(null);

  const [isUpdateFormVisible, setUpdateDisplayState] = useState(true);
  const [isSupplyUpdatedState, setIsSupplyUpdated] = useState(null);

  const [isOrderFormVisible, setOrderDisplayState] = useState(false);
  const [isOrderProcessed, setIsOrderProcessed] = useState(null);

  const [tabValue, setTabValue] = useState(0);

  const [updateFormData, setUpdateFormData] = useState({
    ItemName: "",
    QuantityInStock: "",
    ReorderLevel: "",
    CostPerUnit: "",
  });

  const [medicationFormData, setMedicationFormData] = useState({
    PatientID: "",
    SupplyID: "",
    UnitsPerDay: "",
    AdministrationMethod: "",
    StartDate: "",
    EndDate: "",
  });
  const [isMedicationDataProcessed, setIsMedicationDataProcessed] =
    useState(null);

  const [orders, setOrders] = useState([
    { ItemName: "", QuantityInStock: "", ReorderLevel: "", CostPerUnit: "" },
  ]);

  const handleMedicationFormDataChange = (e) => {
    const { name, value, checked, type } = e.target;
    setMedicationFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdateChange = (e) => {
    const { name, value, checked, type } = e.target;
    setUpdateFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOrderChange = (index, e) => {
    const { name, value, checked, type } = e.target;
    setOrders((prevOrders) => {
      const updatedOrders = [...prevOrders];
      updatedOrders[index] = {
        ...updatedOrders[index],
        [name]: type === "checkbox" ? checked : value,
      };
      return updatedOrders;
    });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSelectWardChange = (event) => {
    setSelectedWard(event.target.value);
  };

  const handleSelectSupplyChange = (event) => {
    setSelectedSupply(event.target.value);
  };

  const handleSubmitUpdateSupply = async (e) => {
    e.preventDefault();

    const { data: updateSupplyData, error } = await serveSupabaseClient
      .from("Supply")
      .update({
        ItemName: updateFormData.ItemName,
        QuantityInStock: updateFormData.QuantityInStock,
        ReorderLevel: updateFormData.ReorderLevel,
        CostPerUnit: updateFormData.CostPerUnit,
      })
      .eq("ItemName", updateFormData.ItemName)
      .select("*");

    if (error) {
      setIsSupplyUpdated(false);
      console.error(error.message);
    } else {
      setIsSupplyUpdated(true);
    }
  };

  const handleAddOrder = () => {
    setOrders((prevOrders) => [
      ...prevOrders,
      { ItemName: "", QuantityInStock: "", ReorderLevel: "", CostPerUnit: "" },
    ]);
  };

  const handleRemoveOrder = (index) => {
    const updatedOrders = orders.filter((order, i) => i !== index);
    setOrders(updatedOrders);
  };

  const handleSubmitOrders = async (e) => {
    e.preventDefault();

    orders.forEach(async (order) => {
      if (order == null) {
        return;
      } else {
        const { data: fetchedSupplyData, error: selectSupplyDataError } =
          await serveSupabaseClient
            .from("Supply")
            .select("ItemName, ItemDescription, Category")
            .eq("ItemName", order.ItemName);

        if (selectSupplyDataError) {
          console.error(selectSupplyDataError);
          return;
        }

        const { data: insertSupplyData, error: insertSupplyError } =
          await serveSupabaseClient.from("Supply").insert({
            ItemName: fetchedSupplyData[0].ItemName,
            ItemDescription: fetchedSupplyData[0].ItemDescription,
            Category: fetchedSupplyData[0].Category,
            QuantityInStock: order.QuantityInStock,
            ReorderLevel: order.ReorderLevel,
            CostPerUnit: order.CostPerUnit,
          });

        if (insertSupplyError) {
          console.error(insertSupplyError);
          setIsOrderProcessed(false);
        } else {
          setIsOrderProcessed(true);
          setOrders([
            {
              ItemName: "",
              QuantityInStock: "",
              ReorderLevel: "",
              CostPerUnit: "",
            },
          ]);
        }
      }
    });
  };

  const handleSubmitMedication = async (e, patientID) => {
    e.preventDefault();
    // Add logic to handle form submission, e.g., sending data to the server
    console.log({ ...medicationFormData, PatientID: patientID });

    const { data, error } = await serveSupabaseClient
      .from("Medication")
      .insert({
        PatientID: patientID,
        UnitsPerDay: medicationFormData.UnitsPerDay,
        AdministrationMethod: medicationFormData.AdministrationMethod,
        StartDate: medicationFormData.StartDate,
        EndDate: medicationFormData.EndDate,
        SupplyID: medicationFormData.SupplyID,
      });

    if (error) {
      console.error(error.message);
      return;
    } else {
      setIsMedicationDataProcessed(true);
    }
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

    if (isSupplyUpdatedState !== null) {
      const timer = setTimeout(() => {
        setIsSupplyUpdated(null);
      }, 3000);

      return () => clearTimeout(timer);
    }

    if (isOrderProcessed !== null) {
      const timer = setTimeout(() => {
        setIsOrderProcessed(null);
      }, 3000);

      return () => clearTimeout(timer);
    }

    if (isMedicationDataProcessed !== null) {
      const timer = setTimeout(() => {
        setIsMedicationDataProcessed(null);
      }, 3000);

      return () => clearTimeout(timer);
    }

    renderSelectedWard();
    renderSelectedSupply();
    handleRedirection();
  }, [
    selectedWard,
    selectedSupply,
    navigate,
    isSupplyUpdatedState,
    isOrderProcessed,
    isMedicationDataProcessed,
  ]);

  return (
    <Container fixed>
      <StaffDashboardHeader userData={userData} />

      {userData != null ? (
        userData[0].PositionHeld != null ? (
          <>
            <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="center" 
            borderBottom={1}
            sx={{ borderColor: 'divider', marginBottom: '20px' }}
          >
            <Tabs value={tabValue} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
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
              <Stack direction="row" gap={1} sx={{ marginBottom: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setUpdateDisplayState((prevState) => !prevState)}
                >
                  Update supply
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setOrderDisplayState((prevState) => !prevState)}
                >
                  Order supply
                </Button>
              </Stack>

              <Box
                sx={{
                  background: "linear-gradient(135deg, #e0f7fa 25%, #80deea 100%)",
                  padding: 2,
                  borderRadius: 4,
                }} 
              >


          {tabValue === 1 && (
                <SuppliesComponent
                  value={selectedSupply}
                  handleSelectSupplyChange={handleSelectSupplyChange}
                  supplies={supplies}
                  selectedSupplyData={selectedSupplyData}
                />
              )}
  

                {/* UPDATE SUPPLY */}
                {isUpdateFormVisible && (
                  <Stack
                    direction="column"
                    component="form"
                    onSubmit={handleSubmitUpdateSupply}
                    spacing={2}
                    sx={{ padding: 2, backgroundColor: "white", borderRadius: 4 }}
                  >
                    <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
                      <FormHelperText>Select a supply to update</FormHelperText>
                      <Select
                        value={updateFormData.ItemName}
                        onChange={handleUpdateChange}
                        name="ItemName"
                        displayEmpty
                        required
                      >
                        {supplies.map((e) => (
                          <MenuItem key={e.ItemName} value={e.ItemName}>
                            {e.ItemName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Stack direction="column" spacing={2}>
                      <TextField
                        type="number"
                        required
                        label="Cost per unit"
                        variant="outlined"
                        onChange={handleUpdateChange}
                        value={updateFormData.CostPerUnit}
                        name="CostPerUnit"
                      />
                      <TextField
                        type="number"
                        required
                        label="Quantity in stock"
                        variant="outlined"
                        onChange={handleUpdateChange}
                        value={updateFormData.QuantityInStock}
                        name="QuantityInStock"
                      />
                      <TextField
                        type="number"
                        required
                        label="Reorder level"
                        variant="outlined"
                        onChange={handleUpdateChange}
                        value={updateFormData.ReorderLevel}
                        name="ReorderLevel"
                      />
                    </Stack>

                    <Button variant="contained" color="primary" type="submit">
                      Update
                    </Button>

                    {isSupplyUpdatedState !== null && (
                      <Alert severity={isSupplyUpdatedState ? "success" : "error"}>
                        {isSupplyUpdatedState ? "Supply updated" : "Supply error"}
                      </Alert>
                    )}
                  </Stack>
                )}

                {/* ORDER SUPPLY */}
                {isOrderFormVisible && (
                  <Stack
                    direction="column"
                    component="form"
                    onSubmit={handleSubmitOrders}
                    spacing={2}
                    sx={{ padding: 2, backgroundColor: "white", borderRadius: 4 }}
                  >
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                      <Button variant="contained" onClick={handleAddOrder}>
                        Add order
                      </Button>
                      <Button variant="outlined" type="submit">
                        Order the supplies
                      </Button>
                    </Box>

                    {isOrderProcessed !== null && (
                      <Alert severity={isOrderProcessed ? "success" : "error"}>
                        {isOrderProcessed ? "Supply ordered" : "Supply error"}
                      </Alert>
                    )}

                    {orders.map((order, index) => (
                      <Stack key={index} direction="column" spacing={2}>
                        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
                          <FormHelperText>Select a supply to order</FormHelperText>
                          <Select
                            value={order.ItemName}
                            onChange={(e) => handleOrderChange(index, e)}
                            name="ItemName"
                            displayEmpty
                            required
                          >
                            {supplies.map((supply) => (
                              <MenuItem key={supply.ItemName} value={supply.ItemName}>
                                {supply.ItemName}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <Stack direction="row" spacing={2}>
                          <TextField
                            type="number"
                            required
                            label="Cost per unit"
                            variant="outlined"
                            onChange={(e) => handleOrderChange(index, e)}
                            value={order.CostPerUnit}
                            name="CostPerUnit"
                          />
                          <TextField
                            type="number"
                            required
                            label="Quantity in stock"
                            variant="outlined"
                            onChange={(e) => handleOrderChange(index, e)}
                            value={order.QuantityInStock}
                            name="QuantityInStock"
                          />
                          <TextField
                            type="number"
                            required
                            label="Reorder level"
                            variant="outlined"
                            onChange={(e) => handleOrderChange(index, e)}
                            value={order.ReorderLevel}
                            name="ReorderLevel"
                          />
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleRemoveOrder(index)}
                          >
                            Drop
                          </Button>
                        </Stack>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Box>
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

            {/* PATIENTS */}
            <TabPanel value={tabValue} index={3} style={{ background: 'linear-gradient(135deg, #e0f7fa 25%, #80deea 100%)', padding: '16px', borderRadius: '8px' }}>
              <Stack direction="column" gap={2} flexWrap="wrap">
                {patients ? (
                  patients.map((patient) => (
                    <Stack component="div" key={patient.PatientID}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ArrowDownwardRounded />}>
                          <Typography
                            variant="body1"
                            fontWeight={500}
                            style={{ textTransform: 'capitalize' }}
                          >
                            {patient.FirstName} {patient.LastName}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography variant="body1" color="text.secondary">
                            <b>Patient Number:</b> {patient.PatientID}
                          </Typography>
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            style={{ textTransform: 'capitalize' }}
                          >
                            <b>Patient Type:</b> {patient.PatientType}
                          </Typography>
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            style={{ textTransform: 'capitalize' }}
                          >
                            <b>Marital Status:</b> {patient.MaritalStatus}
                          </Typography>
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            style={{ textTransform: 'capitalize' }}
                          >
                            <b>Address:</b> {patient.FullAddress}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            <b>Registration Date:</b> {patient.RegistrationDate}
                          </Typography>
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            style={{ textTransform: 'capitalize' }}
                          >
                            <b>Sex:</b> {patient.Sex}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            <b>Telephone Number:</b> {patient.TelephoneNumber}
                          </Typography>
                          <br />
                          
                          {/* Form for adding medication */}
                          <Box
                            component="form"
                            sx={{
                              background: 'linear-gradient(135deg, #e0f7fa 25%, #80deea 100%)',
                              padding: '16px',
                              borderRadius: '8px',
                              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                            }}
                            noValidate
                            autoComplete="off"
                            onSubmit={(e) => handleSubmitMedication(e, patient.PatientID)}
                          >
                            <Typography variant="h6" gutterBottom>
                              Add Medication
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <input type="hidden" name="PatientID" value={patient.PatientID} />
                                <Select
                                  fullWidth
                                  value={medicationFormData.SupplyID}
                                  onChange={handleMedicationFormDataChange}
                                  name="SupplyID"
                                  displayEmpty
                                  required
                                >
                                  {supplies && supplies.length > 0 ? (
                                    supplies.map((supply) => (
                                      <MenuItem key={supply.SupplyID} value={supply.SupplyID}>
                                        {supply.ItemName}
                                      </MenuItem>
                                    ))
                                  ) : (
                                    <MenuItem disabled>
                                      <Skeleton animation="wave" width={100} />
                                    </MenuItem>
                                  )}
                                </Select>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  required
                                  label="Units Per Day"
                                  name="UnitsPerDay"
                                  onChange={handleMedicationFormDataChange}
                                  value={medicationFormData.UnitsPerDay}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  required
                                  label="Administration Method"
                                  name="AdministrationMethod"
                                  onChange={handleMedicationFormDataChange}
                                  value={medicationFormData.AdministrationMethod}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  required
                                  type="date"
                                  label="Start Date"
                                  name="StartDate"
                                  onChange={handleMedicationFormDataChange}
                                  value={medicationFormData.StartDate}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  required
                                  type="date"
                                  label="End Date"
                                  name="EndDate"
                                  onChange={handleMedicationFormDataChange}
                                  value={medicationFormData.EndDate}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <Button
                                  variant="contained"
                                  type="submit"
                                  fullWidth
                                  sx={{ marginTop: '16px' }}
                                >
                                  Add Medication
                                </Button>
                                {isMedicationDataProcessed !== null && (
                                  <Alert
                                    severity={isMedicationDataProcessed ? 'success' : 'error'}
                                    sx={{ marginTop: '16px' }}
                                  >
                                    {isMedicationDataProcessed ? 'Medication added' : 'Medication error'}
                                  </Alert>
                                )}
                              </Grid>
                            </Grid>
                          </Box>
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
