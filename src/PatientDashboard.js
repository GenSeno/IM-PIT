import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Skeleton,
  Stack,
  Tabs,
  Tab,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import { useFetchPatientData } from "./client/fetch_hooks";
import serveSupabaseClient from "./client/client";
import PatientDashboardHeader from "./components/patient_dashboard_header";

function MedicationForm({ medicationData }) {
  return (
    <Stack spacing={2}>
      <Typography variant="body1" fontWeight={400}>
        Item Name: {medicationData.ItemName}
      </Typography>
      <Typography variant="body1" fontWeight={400}>
        Units Per Day: {medicationData.UnitsPerDay}
      </Typography>
      <Typography variant="body1" fontWeight={400}>
        Administration Method: {medicationData.AdministrationMethod}
      </Typography>
      <Typography variant="body1" fontWeight={400}>
        Start Date: {medicationData.StartDate}
      </Typography>
      <Typography variant="body1" fontWeight={400}>
        End Date: {medicationData.EndDate}
      </Typography>
    </Stack>
  );
}

function PatientDashboardPage() {
  const patient = useFetchPatientData();
  const [medications, setMedicationData] = useState(null);

  const navigate = useNavigate();

  const [tabValue, setTabValue] = useState(0);
  const [fetchedData, setFetchedData] = useState(null);
  const [nextOfKinFormData, setNextOfKinFormData] = useState({
    PNKFullName: "",
    RelationshipToPatient: "",
    Address: "",
    TelephoneNumber: "",
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleNextOfKinFormDataChange = (e) => {
    const { name, value, checked, type } = e.target;
    setNextOfKinFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNextOfKinSubmit = async (e) => {
    e.preventDefault();
    const { data: nextOfKinData, error: insertError } =
      await serveSupabaseClient
        .from("NextOfKin")
        .insert({
          PNKFullName: nextOfKinFormData.PNKFullName,
          RelationshipToPatient: nextOfKinFormData.RelationshipToPatient,
          Address: nextOfKinFormData.Address,
          TelephoneNumber: nextOfKinFormData.TelephoneNumber,
        })
        .select("NextOfKinID")
        .single();

    const { data: patientData, error: updateError } = await serveSupabaseClient
      .from("Patient")
      .update({ NextOfKinID: nextOfKinData.NextOfKinID })
      .eq("PatientID", patient.PatientID);

    window.location.reload();
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchFunction =
        patient.PatientType === "inpatient" ? "InPatient" : "OutPatient";

      const { data: fetchedData, error: fetchedError } =
        await serveSupabaseClient
          .from(fetchFunction)
          .select("*")
          .eq("PatientID", patient.PatientID)
          .single();

      if (patient.PatientType === "inpatient") {
        const {
          data: fetchedMedicationsData,
          error: queryMedicationDataError,
        } = await serveSupabaseClient
          .from("Medication")
          .select("*, Supply (*)")
          .eq("PatientID", patient.PatientID);

        if (queryMedicationDataError) {
          console.error(queryMedicationDataError.message);
          return;
        }

        console.log(fetchedMedicationsData);
        setMedicationData(fetchedMedicationsData);
      }

      setFetchedData(fetchedData);
    };

    if (patient && !fetchedData) {
      fetchData();
    }
  }, [patient, fetchedData]);

  return (
    <Container
      fixed
      sx={{
        background: "linear-gradient(135deg, #e0f7fa 25%, #80deea 100%)",
        padding: 3,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      {fetchedData ? (
        <>
          <PatientDashboardHeader patient={patient} fetchedData={fetchedData} />
          <Stack
            sx={{ borderBottom: 1, borderColor: "divider" }}
            direction="row"
            marginTop={2}
            marginBottom={2}
          >
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Patient Details" />
              <Tab label="Medication Form" />
              {!patient.NextOfKin && <Tab label="Next of Kin Form" />}
            </Tabs>
          </Stack>

          {/* Patient Details */}
          <Box hidden={tabValue !== 0}>
            <Stack spacing={2}>
              <Box border={1} borderRadius={2} p={2} mb={2} sx={{ backgroundColor: "#ffffffcc" }}>
                <Typography variant="h5" fontWeight={700}>
                  Personal Details
                </Typography>
                <Divider />
                <Typography variant="body1" fontWeight={400}>
                  Date of Birth: {patient.DateOfBirth}
                </Typography>
                <Typography variant="body1" fontWeight={400}>
                  Address: {patient.FullAddress}
                </Typography>
                <Typography variant="body1" fontWeight={400}>
                  Registration Date: {patient.RegistrationDate}
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight={400}
                  sx={{ textTransform: "capitalize" }}
                >
                  Sex: {patient.Sex}
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight={400}
                  sx={{ textTransform: "capitalize" }}
                >
                  Marital Status: {patient.MaritalStatus}
                </Typography>
                {patient.Ward && (
                  <Typography variant="body1" fontWeight={700}>
                    Assigned to: {patient.Ward.WardName} (
                    {patient.Ward.Location})
                  </Typography>
                )}
              </Box>

              {patient.NextOfKin && (
                <Box border={1} borderRadius={2} p={2} mb={2} sx={{ backgroundColor: "#ffffffcc" }}>
                  <Typography variant="h5" fontWeight={700}>
                    Next of Kin Details
                  </Typography>
                  <Divider />
                  <Typography variant="body1" fontWeight={400}>
                    Full Name: {patient.NextOfKin.PNKFullName}
                  </Typography>
                  <Typography variant="body1" fontWeight={400}>
                    Address: {patient.NextOfKin.Address}
                  </Typography>
                  <Typography variant="body1" fontWeight={400}>
                    Relationship: {patient.NextOfKin.RelationshipToPatient}
                  </Typography>
                  <Typography variant="body1" fontWeight={400}>
                    Telephone: {patient.NextOfKin.TelephoneNumber}
                  </Typography>
                </Box>
              )}

              {patient.Doctor && (
                <Box border={1} borderRadius={2} p={2} mb={2} sx={{ backgroundColor: "#ffffffcc" }}>
                  <Typography variant="h5" fontWeight={700}>
                    Doctor Details
                  </Typography>
                  <Divider />
                  <Typography variant="body1" fontWeight={400}>
                    Name: {patient.Doctor.FullName}
                  </Typography>
                  <Typography variant="body1" fontWeight={400}>
                    Address: {patient.Doctor.Address}
                  </Typography>
                  <Typography variant="body1" fontWeight={400}>
                    Telephone: {patient.Doctor.TelephoneNumber}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>

          {/* Medication Form */}
          <Box hidden={tabValue !== 1}>
            <Box border={1} borderRadius={2} p={2} mb={2} sx={{ backgroundColor: "#ffffffcc" }}>
              <Typography variant="h5" fontWeight={700}>
                Medication Details
              </Typography> 
              <Divider />
              {(medications || []).map((data) => (
                <MedicationForm
                  medicationData={{
                    ItemName: data.Supply.ItemName,
                    UnitsPerDay: data.UnitsPerDay,
                    AdministrationMethod: data.AdministrationMethod,
                    StartDate: data.StartDate,
                    EndDate: data.EndDate,
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Next of Kin Form */}
          <Box hidden={tabValue !== 2}>
            <Box border={1} borderRadius={2} p={2} mb={2} sx={{ backgroundColor: "#ffffffcc" }}>
              <Typography variant="h5" fontWeight={700}>
                Next of Kin Form
              </Typography>
              <Divider />
              <Stack
                spacing={2}
                direction="column"
                component="form"
                onSubmit={handleNextOfKinSubmit}
              >
                <TextField
                  label="Full Name"
                  variant="outlined"
                  fullWidth
                  onChange={handleNextOfKinFormDataChange}
                  name="PNKFullName"
                />
                <TextField
                  label="Relationship to Patient"
                  variant="outlined"
                  fullWidth
                  onChange={handleNextOfKinFormDataChange}
                  name="RelationshipToPatient"
                />
                <TextField
                  label="Address"
                  variant="outlined"
                  fullWidth
                  onChange={handleNextOfKinFormDataChange}
                  name="Address"
                />
                <TextField
                  label="Telephone Number"
                  variant="outlined"
                  fullWidth
                  onChange={handleNextOfKinFormDataChange}
                  name="TelephoneNumber"
                />
                <Button variant="contained" color="primary" type="submit">
                  Update
                </Button>
              </Stack>
            </Box>
          </Box>
        </>
      ) : (
        <Skeleton animation="wave" />
      )}
    </Container>
  );
}

export default PatientDashboardPage;
