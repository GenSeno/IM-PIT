import { Select, Stack, MenuItem, Skeleton, FormHelperText, FormControl } from "@mui/material";

export function WardSelectComponent(props) {
    return (
        <FormControl direction="column" flexWrap="wrap" variant="outlined" size="small">
            <FormHelperText>Select a ward to display</FormHelperText>
            <Select value={props.value} onChange={props.onChange} >
                {props.data != null ? (
                    props.data.map((e) => (
                        <MenuItem key={e.WardName} value={e.WardName} >{e.WardName}</MenuItem>
                    ))
                ) : (
                    <Skeleton animation="wave" />
                )}
            </Select>
        </FormControl>
    )
}

export function SuppliesSelectComponent(props) {
    return (
        <FormControl direction="column" flexWrap="wrap" variant="outlined" size="small">
            <FormHelperText>Select a supply to display</FormHelperText>
            <Select value={props.value} onChange={props.onChange} >
                {props.data != null ? (
                    props.data.map((e) => (
                        <MenuItem key={e.ItemName} value={e.ItemName} >{e.ItemName}</MenuItem>
                    ))
                ) : (
                    <Skeleton animation="wave" />
                )}
            </Select>
        </FormControl>
    )
}