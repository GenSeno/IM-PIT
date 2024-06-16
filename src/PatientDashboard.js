import { Container, Skeleton } from "@mui/material";
import { useFetchPatientData } from "./client/fetch_hooks";
import PatientDashboardHeader from "./components/patient_dashboard_header";
import { useEffect, useState } from "react";
import serveSupabaseClient from "./client/client";

function PatientDashboardPage(props) {
  const patient = useFetchPatientData();

  const [fetchedData, setFetchedData] = useState(null);

  useEffect(() => {
    const fetchInpatientData = async () => {
      const { data: fetchedInpatientData, error: fetchedError } =
        await serveSupabaseClient
          .from("InPatient")
          .select("*")
          .eq("PatientID", patient.PatientID)
          .single();

      setFetchedData(fetchInpatientData);
    };

    const fetchOutpatientData = async () => {};

    if (patient != null) {
      if (patient.PatientType == "inpatient") {
        fetchInpatientData();
      } else if (patient.PatientType == "outpatient") {
        fetchOutpatientData();
      }

      console.log(patient);
    }
  }, [patient]);

  return (
    <Container fixed>
      {fetchedData != null ? (
        <PatientDashboardHeader patient={patient} fetchedData={fetchedData} />
      ) : (
        <Skeleton />
      )}
    </Container>
  );
}

export default PatientDashboardPage;
