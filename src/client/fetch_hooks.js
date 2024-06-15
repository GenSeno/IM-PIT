import serveSupabaseClient from "./client";
import { useState, useEffect } from "react";

export const useFetchUserData = () => {
  const [userData, setUserData] = useState(null);

  const fetchUserData = async () => {
    const { data: user } = await serveSupabaseClient.auth.getUser();
    if (user) {
      const { data: userProfile } = await serveSupabaseClient
        .from("Userlogin")
        .select("id")
        .eq("email", user.user.email)
        .single();

      const { data: staffProfile } = await serveSupabaseClient
        .from("Staff")
        .select(
          "FirstName, LastName, FullAddress, PositionHeld, Userlogin (id), userlogin_id"
        )
        .eq("userlogin_id", userProfile.id);

      setUserData(staffProfile);
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
    const { data: wardData } = await serveSupabaseClient
      .from("Ward")
      .select("*");
    setWards(wardData);
  };

  useEffect(() => {
    fetchWards();
  }, []);

  return wards;
};

export const useFetchSupplies = () => {
  const [supplies, setSupplies] = useState(null);

  const fetchSupplies = async () => {
    const { data: suppliesData } = await serveSupabaseClient
      .from("Supply")
      .select("*");
    setSupplies(suppliesData);
  };

  useEffect(() => {
    fetchSupplies();
  }, []);

  return supplies;
};

export const useFetchStaffs = () => {
  const [staffs, setStaffs] = useState(null);

  const fetchStaffs = async () => {
    const { data: staffsData } = await serveSupabaseClient
      .from("Staff")
      .select("*");
    setStaffs(staffsData);
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  return staffs;
};

export const useFetchPatients = () => {
  const [patients, setPatients] = useState(null);

  const fetchPatients = async () => {
    const { data: patientData } = await serveSupabaseClient
      .from("Patient")
      .select("*");
    setPatients(patientData);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return patients;
};
