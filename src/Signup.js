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
    userType: "",
    patientType: "",
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
    console.log(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsError(false);

    try {
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

      const { user } = signUpData;

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

      if (formData.userType == "staff") {
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

        navigate("/staff_dashboard");
      } else {
        const { data: insertPatientData, error: insertPatientError } =
          await serveSupabaseClient
            .from("Patient")
            .insert([
              {
                FirstName: formData.firstName,
                LastName: formData.lastName,
                FullAddress: formData.address,
                TelephoneNumber: formData.phoneNumber,
                DateOfBirth: formData.dateOfBirth,
                Sex: formData.sex,
                PatientType: formData.patientType,
                RegistrationDate: dayjs(),
                Userlogin_ID: userlogin_id,
              },
            ])
            .select("PatientID");

        if (formData.patientType == "inpatient") {
          const { data: insertInpatientData, error: insertInpatientError } =
            await serveSupabaseClient.from("InPatient").insert([
              {
                PatientID: insertPatientData[0].PatientID,
              },
            ]);
        } else {
          const { data: insertOutpatientData, error: insertOutpatientError } =
            await serveSupabaseClient.from("OutPatient").insert([
              {
                PatientID: insertPatientData[0].PatientID,
              },
            ]);
        }

        if (insertPatientError) {
          setIsError(true);
          setErrorMessage(insertPatientError.message);
          return;
        }

        navigate("/patient_dashboard");
      }
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
          marginBottom: "20px",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          style={{ marginTop: "20px", color: "#00695c" }}
        >
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
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel
              value="female"
              control={<Radio />}
              label="Female"
            />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
          </RadioGroup>
        </Stack>

        <FormLabel component="legend">Select Type of User</FormLabel>
        <RadioGroup
          name="userType"
          value={formData.userType}
          onChange={handleChange}
          row
        >
          <FormControlLabel
            value="patient"
            control={<Radio />}
            label="Patient"
          />
          <FormControlLabel value="staff" control={<Radio />} label="Staff" />
        </RadioGroup>

        {formData.userType === "patient" && (
          <>
            <FormLabel component="legend">Select Type of Patient</FormLabel>
            <RadioGroup
              name="patientType"
              value={formData.patientType}
              onChange={handleChange}
              row
            >
              <FormControlLabel
                value="inpatient"
                control={<Radio />}
                label="Inpatient"
              />
              <FormControlLabel
                value="outpatient"
                control={<Radio />}
                label="Outpatient"
              />
            </RadioGroup>
          </>
        )}

        {formData.userType === "staff" && (
          <>
            {/* Work Experience */}
            <Typography variant="h6" fontWeight="bold">
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

            {/* Qualification */}
            <Typography variant="h6" fontWeight="bold">
              Qualification
            </Typography>
            <DatePicker
              label="Date"
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
              label="Type"
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
          </>
        )}

        {/* Terms and Submit */}
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.terms}
              onChange={handleChange}
              name="terms"
            />
          }
          label="I accept the Terms and Conditions"
        />

        {isError && (
          <Alert severity="error" style={{ marginBottom: "10px" }}>
            {errorMessage}
          </Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          sx={{ mt: 2, mb: 2 }}
        >
          Sign Up
        </Button>

        <Typography variant="body2" align="center">
          Already have an account?{" "}
          <Link href="/login" color="secondary">
            Log In
          </Link>
        </Typography>
      </Stack>
    </Container>
  );
}

export default SignupPage;
