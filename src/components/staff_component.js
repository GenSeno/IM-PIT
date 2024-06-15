import { ArrowDownwardRounded } from "@mui/icons-material";
import {
  Skeleton,
  Typography,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from "@mui/material";

export function StaffsWithPositionsComponent(props) {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ArrowDownwardRounded />}>
        <Typography variant="body1" fontWeight={500}>
          Verified
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {props.staffs != null ? (
          props.staffs
            .filter((e) => e.PositionHeld)
            .map((e) => (
              <Stack component="div" key={e.StaffID}>
                <Accordion>
                  <AccordionSummary expandIcon={<ArrowDownwardRounded />}>
                    <Typography variant="body1" fontWeight={500}>
                      {e.FirstName} (S{e.StaffID})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" color="text.secondary">
                      <b>Address:</b> {e.FullAddress}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      <b>NiN:</b> {e.NiN}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      <b>Position:</b> {e.PositionHeld}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      <b>Sex:</b>{" "}
                      {e.Sex === "M" || e.Sex === "m" ? "Male" : "Female"}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      <b>Telephone Number:</b> {e.TelephoneNumber}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      <b>Date of Birth:</b> {e.DateOfBirth}
                    </Typography>

                    {/* WORK EXPERIENCE CONTAINER */}
                    <Accordion>
                      <AccordionSummary expandIcon={<ArrowDownwardRounded />}>
                        <Typography variant="body2">Work Experience</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body1" color="text.secondary">
                          <b>Organization:</b>{" "}
                          {e.WorkExperience.OrganizationName}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          <b>Position:</b> {e.WorkExperience.Position}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          <b>Start Date:</b> {e.WorkExperience.StartDate}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          <b>End Date:</b> {e.WorkExperience.EndDate}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                    {/* WORK EXPERIENCE CONTAINER */}

                    {/* QUALIFICATION CONTAINER */}
                    <Accordion>
                      <AccordionSummary expandIcon={<ArrowDownwardRounded />}>
                        <Typography variant="body2">Qualification</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body1" color="text.secondary">
                          <b>Organization:</b> {e.Qualification.InstitutionName}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          <b>Qualification Date:</b>{" "}
                          {e.Qualification.QualificationDate}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          <b>Qualification Type:</b>{" "}
                          {e.Qualification.QualificationType}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                    {/* QUALIFICATION CONTAINER */}
                  </AccordionDetails>
                </Accordion>
              </Stack>
            ))
        ) : (
          <Box sx={{ p: 2, width: "100%" }}>
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

export function StaffsWithNoPositionsComponent(props) {
  const staffWithoutPositions =
    props.staffs != null ? props.staffs.filter((e) => !e.PositionHeld) : [];

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ArrowDownwardRounded />}>
        <Typography variant="body1" fontWeight={500}>
          Not verified
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {props.staffs != null ? (
          staffWithoutPositions.length > 0 ? (
            staffWithoutPositions.map((e) => (
              <Stack component="div" key={e.StaffID}>
                <Accordion>
                  <AccordionSummary expandIcon={<ArrowDownwardRounded />}>
                    <Typography variant="body1" fontWeight={500}>
                      {e.FirstName} (S{e.StaffID})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" color="text.secondary">
                      <b>Address:</b> {e.FullAddress}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      <b>NiN:</b> {e.NiN}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      <b>Position:</b> Not available
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      <b>Sex:</b>{" "}
                      {e.Sex === "M" || e.Sex === "m" ? "Male" : "Female"}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      <b>Telephone Number:</b> {e.TelephoneNumber}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      <b>Date of Birth:</b> {e.DateOfBirth}
                    </Typography>

                    {/* WORK EXPERIENCE CONTAINER */}
                    <Accordion>
                      <AccordionSummary expandIcon={<ArrowDownwardRounded />}>
                        <Typography variant="body2">Work Experience</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body1" color="text.secondary">
                          <b>Organization:</b>{" "}
                          {e.WorkExperience.OrganizationName}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          <b>Position:</b> {e.WorkExperience.Position}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          <b>Start Date:</b> {e.WorkExperience.StartDate}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          <b>End Date:</b> {e.WorkExperience.EndDate}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                    {/* WORK EXPERIENCE CONTAINER */}

                    {/* QUALIFICATION CONTAINER */}
                    <Accordion>
                      <AccordionSummary expandIcon={<ArrowDownwardRounded />}>
                        <Typography variant="body2">Qualification</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body1" color="text.secondary">
                          <b>Organization:</b> {e.Qualification.InstitutionName}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          <b>Qualification Date:</b>{" "}
                          {e.Qualification.QualificationDate}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          <b>Qualification Type:</b>{" "}
                          {e.Qualification.QualificationType}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                    {/* QUALIFICATION CONTAINER */}
                  </AccordionDetails>
                </Accordion>
              </Stack>
            ))
          ) : (
            <Typography variant="body1" color="text.secondary">
              No staffs with no position.
            </Typography>
          )
        ) : (
          <Box sx={{ p: 2, width: "100%" }}>
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
