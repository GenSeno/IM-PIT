import { Container } from "@mui/material";
import { useFetchPatientData } from "./client/fetch_hooks";
import PatientDashboardHeader from "./components/patient_dashboard_header";

function PatientDashboardPage(props) {
  const patient = useFetchPatientData();

  return (
    <Container fixed>
      <PatientDashboardHeader patient={patient} />
    </Container>
  );
}

export default PatientDashboardPage;
