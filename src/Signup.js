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
        return;
      }

      // Fetch user's auth data on Supabase (GET -> AUTH)
      const { user } = signUpData;

      // Insert & fetch data in Userlogin TABLE on Supabase (POST+GET -> Userlogin)
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

      // Insert & fetch data in Work Experience table on Supabase (POST+GET -> WorkExperience)
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
        return;
      }

      // Insert data in Qualification table on Supabase (POST -> Qualification)
      const {
        data: insertQualificationData,
        error: insertQualificationError,
      } = await serveSupabaseClient
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
        return;
      }

      // Redirect to dashboard on successful signup
      navigate("/dashboard");
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
      navigate("/dashboard");
    } else {
      console.log("No session found.");
    }
  };

  useEffect(() => {
    handleRedirection();
  }, []);

  return (
    <Container
      disableGutters
      maxWidth={false}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e0f7fa 25%, #80deea 100%)",
        backgroundSize: "cover, 100px 100px",
        backgroundRepeat: "no-repeat, repeat",
      }}
    >
      <Stack
        component="form"
        spacing={4}
        onSubmit={handleSubmit}
        width="100%"
        alignItems="stretch"
        sx={{
          maxWidth: "600px",
          px: 10,
          py: 4,
          borderRadius: 10,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          marginTop: "20px",
          marginBottom: "20px"
        }}
      >
        <Typography variant="h4" fontWeight="bold" textAlign="center" style={{ marginTop: '20px', color: "#00695c" }}>  
          Sign Up
        </Typography> 

        {/* Personal Information */}
        <Stack width="100%" spacing={2}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <TextField
            label="Address"
            variant="outlined"
            fullWidth
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <DatePicker
            label="Date of Birth"
            value={formData.dateOfBirth}
            onChange={(newValue) =>
              setFormData((prev) => ({ ...prev, dateOfBirth: newValue }))
            }
            disableFuture
            fullWidth
            inputVariant="outlined"
          />
          <TextField
            label="Phone Number"
            variant="outlined"
            fullWidth
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          <FormLabel component="legend">Gender</FormLabel>
          <RadioGroup
            aria-label="gender"
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            row
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

        {/* Work Experience */}
        <Stack width="100%" spacing={2}>
          <Typography variant="h5" fontWeight="bold" style= {{color: "#00695c" }}>
            Work Experience
          </Typography>
          <DatePicker
            label="Start Date"
            value={formData.workExperienceStartDate}
            onChange={(newValue) =>
              setFormData((prev) => ({
                ...prev,
                workExperienceStartDate: newValue,
              }))
            }
            disableFuture
            fullWidth
            inputVariant="outlined"
          />
          <DatePicker
            label="End Date"
            value={formData.workExperienceEndDate}
            onChange={(newValue) =>
              setFormData((prev) => ({
                ...prev,
                workExperienceEndDate: newValue,
              }))
            }
            disableFuture
            fullWidth
            inputVariant="outlined"
          />
          <TextField
            label="Position"
            variant="outlined"
            fullWidth
            name="workExperiencePosition"
            value={formData.workExperiencePosition}
            onChange={handleChange}
            required
          />
          <TextField
            label="Organization Name"
            variant="outlined"
            fullWidth
            name="workExperienceOrganization"
            value={formData.workExperienceOrganization}
            onChange={handleChange}
            required
            />
          </Stack>
  
          {/* Qualification Details */}
          <Stack width="100%" spacing={2}>
          <Typography variant="h5" fontWeight="bold" style= {{color: "#00695c" }}>
              Qualification
            </Typography>
            <DatePicker
              label="Qualification Date"
              value={formData.qualificationDate}
              onChange={(newValue) =>
                setFormData((prev) => ({
                  ...prev,
                  qualificationDate: newValue,
                }))
              }
              disableFuture
              fullWidth
              inputVariant="outlined"
            />
            <TextField
              label="Qualification Type"
              variant="outlined"
              fullWidth
              name="qualificationType"
              value={formData.qualificationType}
              onChange={handleChange}
              required
            />
            <TextField
              label="Institution Name"
              variant="outlined"
              fullWidth
              name="qualificationInstitution"
              value={formData.qualificationInstitution}
              onChange={handleChange}
              required
            />
          </Stack>

          <FormControlLabel
            control={
              <Checkbox
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                color="primary"
              />
            }
            label="I have agreed to the terms and conditions."
          />
          
          {/* Submit Button */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<KeyRounded />}
            type="submit"
            fullWidth
            size="large"
          >
            Sign Up
          </Button>
  
          {/* Error Message */}
          {isError && (
            <Alert severity="error" fullWidth>
              {errorMessage}
            </Alert>
          )}
          
          {/* Link to Login */}
          <Typography variant="body2" textAlign="center">
            Already have an account?{" "}
            <Link href="/" underline="hover">
              Log In
            </Link>
          </Typography>
        </Stack>
      </Container>
    );
  }
  
  export default SignupPage;
  