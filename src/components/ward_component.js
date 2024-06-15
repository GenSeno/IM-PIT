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
} from "@mui/material";

function WardSelectComponent(props) {
  return (
    <FormControl
      direction="column"
      flexWrap="wrap"
      variant="outlined"
      size="small"
    >
      <FormHelperText>Select a ward to display</FormHelperText>
      <Select value={props.value} onChange={props.onChange}>
        {props.data != null ? (
          props.data.map((e) => (
            <MenuItem key={e.WardName} value={e.WardName}>
              {e.WardName}
            </MenuItem>
          ))
        ) : (
          <Skeleton animation="wave" />
        )}
      </Select>
    </FormControl>
  );
}

function WardComponent(props) {
  const { selectedWardData, selectedWard, handleSelectWardChange, wards } =
    props;

  return (
    <Stack direction="row" gap={2}>
      <WardSelectComponent
        helper_text="Select a ward to display"
        value={selectedWard}
        onChange={handleSelectWardChange}
        data={wards}
      />
      {selectedWardData != null ? (
        <Card sx={{ p: 1, my: 2, ml: 2, width: "80%" }}>
          <CardContent>
            <Typography>
              <b>Location</b>: {selectedWardData[0].Location} (
              {selectedWardData[0].TelephoneExtension})
            </Typography>
            <Typography>
              <b>Total beds</b>: {selectedWardData[0].TotalBeds}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Skeleton />
      )}
    </Stack>
  );
}

export default WardComponent;
