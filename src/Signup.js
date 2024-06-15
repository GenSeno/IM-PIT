import { KeyRounded } from "@mui/icons-material";
import {
  Container,
  Typography,
  TextField,
  Stack,
  Button,
  Link,
  FormControlLabel,
  Checkbox,
  Alert,
  RadioGroup,
  Radio,
  FormLabel,
} from "@mui/material";
import { useState, useEffect } from "react";
import serveSupabaseClient from "./client/client";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

function SignupPage() {
  const navigate = useNavigate();

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: dayjs(),
    sex: "",
    terms: false,
    position: "",
    organizationName: "",
    workExperienceStartDate: dayjs(),
    workExperienceEndDate: dayjs(),
    workExperiencePosition: "",
    workExperienceOrganization: "",
    qualificationDate: dayjs(),
    qualificationType: "",
    qualificationInstitution: "",
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsError(false);

    try {
      // Sign up on Supabase (RETURNS -> AUTH)
      const { data: signUpData, error: signUpError } =
        await serveSupabaseClient.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

      if (signUpError) {
        setIsError(true);
        setErrorMessage(signUpError.message);
        console.log(signUpError.message);
        return;
      }
      // Sign up on Supabase (RETURNS -> AUTH)

      // Fetch user's auth data on Supabase (GET -> AUTH)
      const { user } = signUpData;
      // Fetch user's auth data on Supabase (GET -> AUTH)

      // Insert & fetches data in Userlogin TABLE on Supabase (POST+GET -> Userlogin)
      const { data: insertUserLoginData, error: insertUserLoginError } =
        await serveSupabaseClient.from("Userlogin").insert([
          {
            email: formData.email,
            phone: formData.phoneNumber,
            terms: formData.terms,
          },
        ]);

      if (insertUserLoginError) {
        setIsError(true);
        setErrorMessage(insertUserLoginError.message);
        return;
      }

      const { data: authUser } = await serveSupabaseClient.auth.getUser();
      const { data: userData, error: userDataError } = await serveSupabaseClient
        .from("Userlogin")
        .select("id")
        .eq("email", authUser.user.email)
        .single();

      const userlogin_id = userData.id;
      console.log(userData);
      // Insert & fetches data in Userlogin TABLE on Supabase (POST+GET -> Userlogin)

      // Insert & fetches data in Work Experience table on Supabase (POST+GET -> WorkExperience)
      const {
        data: insertWorkExperienceData,
        error: insertWorkExperienceError,
      } = await serveSupabaseClient
        .from("WorkExperience")
        .insert([
          {
            StartDate: formData.workExperienceStartDate,
            EndDate: formData.workExperienceEndDate,
            Position: formData.workExperiencePosition,
            OrganizationName: formData.workExperienceOrganization,
          },
        ])
        .select("ExperienceID");

      if (insertWorkExperienceError) {
        setIsError(true);
        setErrorMessage(insertWorkExperienceError.message);
        console.log(insertWorkExperienceError.message);
        return;
      }

      // Insert & fetches data in Work Experience table on Supabase (POST+GET -> WorkExperience)

      const { data: insertQualificationData, error: insertQualificationError } =
        await serveSupabaseClient
          .from("Qualification")
          .insert([
            {
              QualificationDate: formData.qualificationDate,
              QualificationType: formData.qualificationType,
              InstitutionName: formData.qualificationInstitution,
            },
          ])
          .select("QualificationID");

      if (insertQualificationError) {
        setIsError(true);
        setErrorMessage(insertQualificationError.message);
        console.log(insertQualificationError.message);
        return;
      }

      // Insert data in Staff table on Supabase (POST -> Staff)
      const { data: insertStaffData, error: insertStaffError } =
        await serveSupabaseClient.from("Staff").insert([
          {
            FirstName: formData.firstName,
            LastName: formData.lastName,
            FullAddress: formData.address,
            TelephoneNumber: formData.phoneNumber,
            DateOfBirth: formData.dateOfBirth,
            Sex: formData.sex,
            userlogin_id: userlogin_id,
            ExperienceID: insertWorkExperienceData[0].ExperienceID,
            QualificationID: insertQualificationData[0].QualificationID,
          },
        ]);

      if (insertStaffError) {
        setIsError(true);
        setErrorMessage(insertStaffError.message);
        console.log(insertStaffError.message);
        return;
      }
      // Insert data in Staff table on Supabase (POST -> Staff)

      navigate("/");
    } catch (error) {
      console.error("Error during signup and staff insertion:", error.message);
      setIsError(true);
      setErrorMessage(error.message);
    }
  };

  const handleRedirection = async () => {
    const {
      data: { session: currentSession },
      error,
    } = await serveSupabaseClient.auth.getSession();

    if (error) {
      console.error("Error fetching session:", error.message);
      return;
    }

    if (currentSession) {
      navigate("/dashboard/");
    } else {
      console.log("No session found.");
    }
  };

  useEffect(() => {
    handleRedirection();
  }, []);

  return (
    <Container
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
      }}
      fixed
    >
      <Stack direction="column" gap={1}>
        <Stack
          direction="row"
          gap={2}
          component="form"
          onSubmit={handleSubmit}
          justifyItems="center"
        >
          {/* STAFF DETAILS CONTAINER  */}
          <Stack direction="column" gap={1}>
            <Typography variant="h5" fontWeight={700}>
              Staff Details
            </Typography>
            <Stack direction="row" gap={1}>
              <TextField
                label="Email"
                variant="outlined"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Stack>
            <Stack direction="row" gap={1}>
              <TextField
                label="First Name"
                variant="outlined"
                value={formData.firstName}
                name="firstName"
                onChange={handleChange}
                required
              />
              <TextField
                label="Last Name"
                variant="outlined"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </Stack>
            <Stack direction="row" gap={1}>
              <TextField
                label="Address"
                variant="outlined"
                value={formData.address}
                name="address"
                onChange={handleChange}
                required
              />
              <DatePicker
                defaultValue={dayjs()}
                value={formData.dateOfBirth}
                onChange={(newValue) => {
                  setFormData((prev) => ({ ...prev, dateOfBirth: newValue }));
                }}
                label="Date of birth"
                disableFuture
              />
            </Stack>
            <TextField
              label="Phone Number"
              variant="outlined"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
            <FormLabel>Gender</FormLabel>
            <Stack direction="row" gap={1}>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="male"
                name="sex"
                style={{ display: "flex", flexDirection: "row" }}
                onChange={handleChange}
                value={formData.sex}
              >
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="other"
                  control={<Radio />}
                  label="Other"
                />
              </RadioGroup>
            </Stack>
            <FormControlLabel
              control={
                <Checkbox
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  sx={{ color: "rgba(0, 0, 0, 0.5)" }}
                />
              }
              label="I have agreed to the terms and conditions."
              required
            />
            <Button variant="outlined" startIcon={<KeyRounded />} type="submit">
              Sign-up
            </Button>
          </Stack>
          {/* STAFF DETAILS CONTAINER  */}

          {/* WORK EXPERIENCE DETAILS CONTAINER  */}
          <Stack direction="column" gap={1}>
            <Typography variant="h5" fontWeight={700}>
              Work Experience Details
            </Typography>
            <Stack direction="column" gap={1}>
              <Stack direction="row" gap={1}>
                <DatePicker
                  defaultValue={dayjs()}
                  value={formData.workExperienceStartDate}
                  onChange={(newValue) => {
                    setFormData((prev) => ({
                      ...prev,
                      workExperienceStartDate: newValue,
                    }));
                  }}
                  label="Starting date"
                  disableFuture
                />

                <DatePicker
                  defaultValue={dayjs()}
                  value={formData.workExperienceEndDate}
                  onChange={(newValue) => {
                    setFormData((prev) => ({
                      ...prev,
                      workExperienceEndDate: newValue,
                    }));
                  }}
                  label="End date"
                  disableFuture
                />
              </Stack>
              <Stack direction="row" gap={1}>
                <TextField
                  label="Position"
                  variant="outlined"
                  value={formData.workExperiencePosition}
                  name="workExperiencePosition"
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="Organization Name"
                  variant="outlined"
                  value={formData.workExperienceOrganization}
                  name="workExperienceOrganization"
                  onChange={handleChange}
                  required
                />
              </Stack>
            </Stack>
          </Stack>
          {/* WORK EXPERIENCE DETAILS CONTAINER  */}

          {/* QUALIFICATION DETAILS CONTAINER  */}
          <Stack direction="column" gap={1}>
            <Typography variant="h5" fontWeight={700}>
              Qualification Details
            </Typography>
            <Stack direction="column" gap={1}>
              <Stack direction="row" gap={1}>
                <DatePicker
                  defaultValue={dayjs()}
                  value={formData.qualificationDate}
                  onChange={(newValue) => {
                    setFormData((prev) => ({
                      ...prev,
                      qualificationDate: newValue,
                    }));
                  }}
                  label="Qualification date"
                  disableFuture
                />
                <TextField
                  label="Qualification Type"
                  variant="outlined"
                  value={formData.qualificationType}
                  name="qualificationType"
                  onChange={handleChange}
                  required
                />
              </Stack>
              <TextField
                label="Institution Name"
                variant="outlined"
                value={formData.qualificationInstitution}
                name="qualificationInstitution"
                onChange={handleChange}
                required
              />
            </Stack>
          </Stack>
          {/* QUALIFICATION DETAILS CONTAINER  */}
        </Stack>

        {isError && <Alert severity="warning">{errorMessage}</Alert>}
        <Link href="/" underline="none">
          Already have an account?
        </Link>
      </Stack>
    </Container>
  );
}

export default SignupPage;
