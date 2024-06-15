import serveSupabaseClient from "./client";
import { useState, useEffect } from "react";
export const useFetchUserData = () => {
  const [userData, setUserData] = useState(null);

  const fetchUserData = async () => {
    const { data: user, error: userError } =
      await serveSupabaseClient.auth.getUser();
    if (userError) {
      console.error("Error fetching user:", userError);
      return;
    }

    if (user) {
      const { data: userProfile, error: userProfileError } =
        await serveSupabaseClient
          .from("Userlogin")
          .select("id")
          .eq("email", user.user.email)
          .single();

      if (userProfileError) {
        console.error("Error fetching user profile:", userProfileError);
        return;
      }

      const { data: staffProfile, error: staffProfileError } =
        await serveSupabaseClient
          .from("Staff")
          .select(
            "FirstName, LastName, FullAddress, PositionHeld, Userlogin (id), userlogin_id"
          )
          .eq("userlogin_id", userProfile.id);

      if (staffProfileError) {
        console.error("Error fetching staff profile:", staffProfileError);
      } else {
        setUserData(staffProfile);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return userData;
};

export const useFetchWards = () => {
  const [wards, setWards] = useState(null);

  const fetchWards = async () => {
    const { data: wardData, error: wardDataError } = await serveSupabaseClient
      .from("Ward")
      .select("*");

    if (wardDataError) {
      console.error("Error fetching ward data:", wardDataError);
    } else {
      setWards(wardData);
    }
  };

  useEffect(() => {
    fetchWards();
  }, []);

  return wards;
};

export const useFetchSupplies = () => {
  const [supplies, setSupplies] = useState(null);

  const fetchSupplies = async () => {
    const { data: suppliesData, error: suppliesDataError } =
      await serveSupabaseClient.from("Supply").select("*");

    if (suppliesDataError) {
      console.error("Error fetching supplies data:", suppliesDataError);
    } else {
      setSupplies(suppliesData);
    }
  };

  useEffect(() => {
    fetchSupplies();
  }, []);

  return supplies;
};

export const useFetchStaffs = () => {
  const [staffs, setStaffs] = useState(null);

  const fetchStaffs = async () => {
    const { data: staffsData, error: staffsError } =
      await serveSupabaseClient.from("Staff").select(`
        StaffID,
    FirstName,
    LastName,
    FullAddress,
    TelephoneNumber,
    DateOfBirth,
    Sex,
    NiN,
    PositionHeld,
    WorkExperience (
      StartDate,
      EndDate,
      Position,
      OrganizationName
    ),
    Qualification (
      QualificationDate,
      QualificationType,
      InstitutionName
    )
  `);

    if (staffsError) {
      console.error("Error fetching staff data:", staffsError);
    } else {
      setStaffs(staffsData);
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  return staffs;
};

export const useFetchPatients = () => {
  const [patients, setPatients] = useState(null);

  const fetchPatients = async () => {
    const { data: patientData, error: patientDataError } =
      await serveSupabaseClient.from("Patient").select("*");

    if (patientDataError) {
      console.error("Error fetching patient data:", patientDataError);
    } else {
      setPatients(patientData);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return patients;
};
