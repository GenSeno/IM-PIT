import {
  Select,
  MenuItem,
  Skeleton,
  FormHelperText,
  FormControl,
  Card,
  Typography,
  CardContent,
  Stack,
  Box,
} from "@mui/material";

function WardSelectComponent(props) {
  return (
    <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
      <FormHelperText>Select a ward to display</FormHelperText>
      <Select
        value={props.value}
        onChange={props.onChange}
        displayEmpty
        sx={{ backgroundColor: "white", borderRadius: "4px" }} // Apply background color and borderRadius
      >
        {props.data != null ? (
          props.data.map((e) => (
            <MenuItem key={e.WardName} value={e.WardName}>
              {e.WardName}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>
            <Skeleton animation="wave" width={100} />
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
}

function WardComponent(props) {
  const {
    selectedWardData,
    selectedWard,
    handleSelectWardChange,
    wards,
  } = props;

  return (
    <Box
      sx={{
        padding: 2,
        background:
          "linear-gradient(135deg, #e0f7fa 25%, #80deea 100%)", // Apply the linear gradient background
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        marginBottom: "20px",
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <WardSelectComponent
          value={selectedWard}
          onChange={handleSelectWardChange}
          data={wards}
        />
        {selectedWardData != null ? (
          <Card sx={{ flexGrow: 1, backgroundColor: "#fff" }}>
            <CardContent>
              <Typography variant="body1">
                <b>Location:</b> {selectedWardData[0].Location} (
                {selectedWardData[0].TelephoneExtension})
              </Typography>
              <Typography variant="body1">
                <b>Total beds:</b> {selectedWardData[0].TotalBeds}
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Skeleton variant="rectangular" width="100%" height={118} />
          </Box>
        )}
      </Stack>
    </Box>
  );
}

export default WardComponent;
