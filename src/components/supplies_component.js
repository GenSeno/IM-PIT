import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

function SuppliesSelectComponent(props) {
  return (
    <FormControl
      direction="column"
      flexWrap="wrap"
      variant="outlined"
      size="small"
    >
      <FormHelperText>Select a supply to display</FormHelperText>
      <Select value={props.value} onChange={props.onChange}>
        {props.data != null ? (
          props.data.map((e) => (
            <MenuItem key={e.ItemName} value={e.ItemName}>
              {e.ItemName}
            </MenuItem>
          ))
        ) : (
          <Skeleton animation="wave" />
        )}
      </Select>
    </FormControl>
  );
}

function SuppliesComponent(props) {
  const {
    selectedSupply,
    handleSelectSupplyChange,
    supplies,
    selectedSupplyData,
  } = props;

  return (
    <Stack direction="row" gap={2}>
      <SuppliesSelectComponent
        helper_text="Select a supply to display"
        value={selectedSupply}
        onChange={handleSelectSupplyChange}
        data={supplies}
      />
      {selectedSupplyData && selectedSupplyData.length > 0 ? (
        <Card sx={{ p: 1, my: 2, ml: 2, width: "80%" }}>
          <CardContent>
            <Typography gutterBottom>
              {selectedSupplyData[0].ItemDescription}
            </Typography>
            <Typography>
              <b>Category</b>: {selectedSupplyData[0].Category}
            </Typography>
            <Typography>
              <b>Cost per unit</b>: {selectedSupplyData[0].CostPerUnit}
            </Typography>
            <Typography>
              <b>Quantity in stock</b>: {selectedSupplyData[0].QuantityInStock}
            </Typography>
            <Typography>
              <b>Reorder level</b>: {selectedSupplyData[0].ReorderLevel}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Skeleton />
      )}
    </Stack>
  );
}

export default SuppliesComponent;
