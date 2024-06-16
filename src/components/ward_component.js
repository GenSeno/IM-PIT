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
    <FormControl
      variant="outlined"
      size="small"
      sx={{ minWidth: 200 }}
    >
      <FormHelperText>Select a ward to display</FormHelperText>
      <Select value={props.value} onChange={props.onChange} displayEmpty>
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
  const { selectedWardData, selectedWard, handleSelectWardChange, wards } = props;

  return (
    <Box sx={{ padding: 2 }}>
      <Stack direction="row" spacing={2}>
        <WardSelectComponent
          value={selectedWard}
          onChange={handleSelectWardChange}
          data={wards}
        />
        {selectedWardData != null ? (
          <Card sx={{ flexGrow: 1 }}>
            <CardContent>
              <Typography>
                <b>Location:</b> {selectedWardData[0].Location} (
                {selectedWardData[0].TelephoneExtension})
              </Typography>
              <Typography>
                <b>Total beds:</b> {selectedWardData[0].TotalBeds}
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Skeleton variant="rectangular" width="100%" height={118} />
          </Box>
        )}
      </Stack>
    </Box>
  );
}

export default WardComponent;
