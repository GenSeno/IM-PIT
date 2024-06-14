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
    dateOfBirth: "",
    sex: "",
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
    console.log(value)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsError(false);

    try {
      const { data: signUpData, error: signUpError } = await serveSupabaseClient.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signUpError) {
        setIsError(true);
        setErrorMessage(signUpError.message);
        console.log(signUpError.message)
        return;
      }

      const { user } = signUpData;

      const { data: insertUserLoginData, error: insertUserLoginError } = await serveSupabaseClient
        .from("Userlogin")
        .insert([
          {
            email: formData.email,
            phone: formData.phoneNumber,
            terms: formData.terms,
          },
        ]);

      if (insertUserLoginError) {
        setIsError(true);
        setErrorMessage(insertUserLoginError.message);
        console.log(insertUserLoginError.message)
        return;
      }

      const { data: authUser } = await serveSupabaseClient.auth.getUser();
      const { data: userData, error: userDataError } = await serveSupabaseClient
        .from("Userlogin")
        .select("id")
        .eq("email", authUser.user.email)
        .single();

      const userlogin_id = userData.id;
      console.log(userData)

      const { data: insertStaffData, error: insertStaffError } = await serveSupabaseClient
        .from("Staff")
        .insert([
          {
            FirstName: formData.firstName,
            LastName: formData.lastName,
            FullAddress: formData.address,
            TelephoneNumber: formData.phoneNumber,
            DateOfBirth: formData.dateOfBirth,
            Sex: formData.sex,
            userlogin_id: userlogin_id,
          },
        ]);

      if (insertStaffError) {
        setIsError(true);
        setErrorMessage(insertStaffError.message);
        console.log(insertStaffError.message)
        return;
      }

      navigate("/");
    } catch (error) {
      console.error('Error during signup and staff insertion:', error.message);
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
        <Typography variant="h4" fontWeight="700" component="h4">
          Wellmeadows Hospital
        </Typography>
        <Stack
          direction="column"
          gap={1}
          component="form"
          onSubmit={handleSubmit}
        >
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
            <input
              type="date"
              style={{ borderColor: 'gray', paddingLeft: 8, paddingRight: 8, borderRadius: 8, width: "45%" }}
              value={formData.dateOfBirth}
              name="dateOfBirth"
              onChange={handleChange} // Handle date input changes
              required
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
              style={{ display: 'flex', flexDirection: 'row' }}
              onChange={handleChange}
              value={formData.sex}
            >
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="female" control={<Radio />} label="Female" />
              <FormControlLabel value="other" control={<Radio />} label="Other" />
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
        {isError && <Alert severity="warning">{errorMessage}</Alert>}
        <Link href="/" underline="none">
          Already have an account?
        </Link>
      </Stack>
    </Container>
  );
}

export default SignupPage;
