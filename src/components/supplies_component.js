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
  Box,
} from "@mui/material";

function SuppliesSelectComponent(props) {
  const { value, onChange, data } = props;

  return (
    <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
      <FormHelperText>Select a supply to display</FormHelperText>
      <Select  value={value}
        onChange={onChange}
        displayEmpty
        sx={{ backgroundColor: "white", borderRadius: "4px" }}>
        {data !== data.length ? (
          data.map((e) => <MenuItem value={e.ItemName}>{e.ItemName}</MenuItem>)
        ) : (
          <MenuItem disabled>
            <Skeleton animation="wave" width={100} />
          </MenuItem>
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

  const displayData =
    selectedSupplyData && selectedSupplyData.length > 0
      ? selectedSupplyData[0]
      : {
          ItemDescription: "",
          Category: "",
          CostPerUnit: "",
          QuantityInStock: "",
          ReorderLevel: "",
        };

  return (
    <Box sx={{ padding: 2 }}>
      <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
        <Box sx={{ minWidth: 200 }}>
          <SuppliesSelectComponent
            value={selectedSupply}
            onChange={handleSelectSupplyChange}
            data={supplies}
          />
        </Box>
        <Box sx={{ flexGrow: 1, minWidth: 300 }}>
          {selectedSupplyData && selectedSupplyData.length > 0 ? (
            <Card sx={{ width: "100%" }}>
              <CardContent>
                <Typography gutterBottom>
                  {displayData.ItemDescription}
                </Typography>
                <Typography>
                  <b>Category:</b> {displayData.Category}
                </Typography>
                <Typography>
                  <b>Cost per unit:</b> {displayData.CostPerUnit}
                </Typography>
                <Typography>
                  <b>Quantity in stock:</b> {displayData.QuantityInStock}
                </Typography>
                <Typography>
                  <b>Reorder level:</b> {displayData.ReorderLevel}
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Card sx={{ width: "100%" }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No supply selected
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Please select a supply from the dropdown to view details.
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </Stack>
    </Box>
  );
}

export default SuppliesComponent;
