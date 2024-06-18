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
  MenuItem, FormControl, FormHelperText, Select,
  TextField,
  Button,
  Alert
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

  const [isUpdateFormVisible, setUpdateDisplayState] = useState(true);
  const [isSupplyUpdatedState, setIsSupplyUpdated] = useState(null)

  const [isOrderFormVisible, setOrderDisplayState] = useState(false)
  const [isOrderProcessed, setIsOrderProcessed] = useState(null);

  const [tabValue, setTabValue] = useState(0);

  const [updateFormData, setUpdateFormData] = useState({
    ItemName: '',
    QuantityInStock: '',
    ReorderLevel: '',
    CostPerUnit: ''
  })

  const [orders, setOrders] = useState([
    { ItemName: '', QuantityInStock: '', ReorderLevel: '', CostPerUnit: '' },
  ]);

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
        [name]: type === 'checkbox' ? checked : value,
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
    e.preventDefault()
    console.log(updateFormData)

    const { data: updateSupplyData, error } = await serveSupabaseClient.from("Supply")
      .update({
        ItemName: updateFormData.ItemName,
        QuantityInStock: updateFormData.QuantityInStock,
        ReorderLevel: updateFormData.ReorderLevel,
        CostPerUnit: updateFormData.CostPerUnit
      }).eq("ItemName", updateFormData.ItemName).select("*")

    if (error) {
      setIsSupplyUpdated(false)
      console.error(error.message)
    } else {
      setIsSupplyUpdated(true)
    }

    console.log(updateSupplyData)

  }

  const handleAddOrder = () => {
    setOrders((prevOrders) => [
      ...prevOrders,
      { ItemName: '', QuantityInStock: '', ReorderLevel: '', CostPerUnit: '' },
    ]);
  };

  const handleRemoveOrder = (index) => {
    const updatedOrders = orders.filter((order, i) => i !== index);
    setOrders(updatedOrders);
  };

  const handleSubmitOrders = async (e) => {
    e.preventDefault();

    orders.forEach(async (order) => {

      const { data: fetchedSupplyData, error } = await serveSupabaseClient.from("Supply")
        .select("ItemName, ItemDescription, Category").eq("ItemName", order.ItemName).single()

      const { data: insertSupplyData, error: insertSupplyError } = await serveSupabaseClient.from("Supply")
        .insert({
          ItemName: fetchedSupplyData.ItemName,
          ItemDescription: fetchedSupplyData.ItemDescription,
          Category: fetchedSupplyData.Category,
          QuantityInStock: order.QuantityInStock,
          ReorderLevel: order.ReorderLevel,
          CostPerUnit: order.CostPerUnit
        })

      if (insertSupplyError) {
        console.error(insertSupplyError)
        setIsOrderProcessed(false)
      } else {
        setIsOrderProcessed(true)
      }

    });

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

    renderSelectedWard();
    renderSelectedSupply();
    handleRedirection();

  }, [selectedWard, selectedSupply, navigate, isSupplyUpdatedState]);
  

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
              <Stack direction="row" gap={1}>
                <Button variant="outlined" onClick={() => setUpdateDisplayState(prevState => !prevState)}>
                  Update supply
                </Button>
                <Button variant="outlined" onClick={() => setOrderDisplayState(prevState => !prevState)}>
                  Order supply
                </Button>
              </Stack>

              <SuppliesComponent
                value={selectedSupply}
                handleSelectSupplyChange={handleSelectSupplyChange}
                supplies={supplies}
                selectedSupplyData={selectedSupplyData}
              />

              {isUpdateFormVisible ?
                <Stack direction="row" component="form" onSubmit={handleSubmitUpdateSupply} spacing={2} sx={{ padding: 2 }}>
                  <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
                    <FormHelperText>Select a supply to update</FormHelperText>
                    <Select value={updateFormData.ItemName} onChange={handleUpdateChange} name="ItemName" displayEmpty required>
                      {supplies !== supplies.length ? (
                        supplies.map((e) => (
                          <MenuItem key={e.ItemName} value={e.ItemName}>
                            {e.ItemName}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>
                          <Skeleton animation="wave" width={100} />
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                  <Stack direction="row" gap={1}>
                    <TextField type="number" required label="Cost per unit" variant="outlined" onChange={handleUpdateChange} value={updateFormData.CostPerUnit} name="CostPerUnit" />
                    <TextField type="number" required label="Quantity in stock" variant="outlined" onChange={handleUpdateChange} value={updateFormData.QuantityInStock} name="QuantityInStock" />
                    <TextField type="number" required label="Reorder level" variant="outlined" onChange={handleUpdateChange} value={updateFormData.ReorderLevel} name="ReorderLevel" />
                    <Button variant="outlined" type="submit">Update</Button>
                  </Stack>
                  {isSupplyUpdatedState !== null && (
                    <Alert severity={isSupplyUpdatedState ? "success" : "error"}>
                      {isSupplyUpdatedState ? "Supply updated" : "Supply error"}
                    </Alert>
                  )}
                </Stack> :
                <></>}

              {isOrderFormVisible && (
                <Stack
                  direction="column"
                  component="form"
                  onSubmit={handleSubmitOrders}
                  spacing={2}
                  sx={{ padding: 2, flexWrap: 'wrap' }}
                >
                  <Box maxWidth={640} sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                    <Button variant="contained" onClick={handleAddOrder}>
                      Add order
                    </Button>
                    <Button variant="outlined" type="submit">
                      Order the supplies
                    </Button>
                    {isOrderProcessed !== null && (
                      <Alert severity={isOrderProcessed ? "success" : "error"}>
                        {isOrderProcessed ? "Supply ordered" : "Supply error"}
                      </Alert>
                    )}
                  </Box>
                  {orders.map((order, index) => (
                    <Stack
                      key={index}
                      direction="row"
                      spacing={2}
                      sx={{ padding: 2, flexWrap: 'wrap' }}
                    >
                      <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
                        <FormHelperText>Select a supply to order</FormHelperText>
                        <Select
                          value={order.ItemName}
                          onChange={(e) => handleOrderChange(index, e)}
                          name="ItemName"
                          displayEmpty
                          required
                        >
                          {supplies.length > 0 ? (
                            supplies.map((supply) => (
                              <MenuItem key={supply.ItemName} value={supply.ItemName}>
                                {supply.ItemName}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>
                              <Skeleton animation="wave" width={100} />
                            </MenuItem>
                          )}
                        </Select>
                      </FormControl>
                      <Stack direction="row" gap={1}>
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

                        <Button variant="contained" color="error" onClick={() => handleRemoveOrder(index)}>
                          Drop
                        </Button>
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              )}

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
          <TabPanel value={tabValue} index={3}>
            <Stack direction="column" gap={2} flexWrap="wrap">
              {patients ? (
                patients.map((patient) => (
                  <Stack component="div" key={patient.PatientID}>
                    <Accordion>
                      <AccordionSummary expandIcon={<ArrowDownwardRounded />}>
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          style={{ textTransform: "capitalize" }}
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
                          style={{ textTransform: "capitalize" }}
                        >
                          <b>Patient Type:</b> {patient.PatientType}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          style={{ textTransform: "capitalize" }}
                        >
                          <b>Marital Status:</b> {patient.MaritalStatus}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          style={{ textTransform: "capitalize" }}
                        >
                          <b>Address:</b> {patient.FullAddress}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          <b>Registration Date:</b> {patient.RegistrationDate}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          style={{ textTransform: "capitalize" }}
                        >
                          <b>Sex:</b> {patient.Sex}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          <b>Telephone Number:</b> {patient.TelephoneNumber}
                        </Typography>
                        {/* Form for adding medication */}
                        <Box
                          component="form"
                          sx={{
                            '& .MuiTextField-root': { m: 1, width: '25ch' },
                            mt: 2,
                          }}
                          noValidate
                          autoComplete="off"
                        >
                          <Typography variant="h6">Add Medication</Typography>
                          <TextField
                            required
                            label="Item Name"
                            name="ItemName"
                          />
                          <TextField
                            required
                            label="Units Per Day"
                            name="UnitsPerDay"
                          />
                          <TextField
                            required
                            label="Administration Method"
                            name="AdministrationMethod"
                          />
                          <TextField
                            required
                            type="date"
                            label="Start Date"
                            name="StartDate"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                          <TextField
                            required
                            type="date"
                            label="End Date"
                            name="EndDate"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                          <Button variant="contained" type="submit">
                            Add Medication
                          </Button>
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
      )
      }
    </Container >
  );
}

export default StaffDashboardPage;
