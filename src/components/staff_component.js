import { useState } from 'react';
import { ArrowDownwardRounded } from '@mui/icons-material';
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Skeleton,
  Divider,
  Grid,
} from '@mui/material';

export function StaffsWithPositionsComponent({ staffs }) {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ArrowDownwardRounded />}>
        <Typography variant="body1" fontWeight={500}>
          Verified
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {staffs && staffs.length > 0 ? (
          staffs
            .filter((staff) => staff.PositionHeld)
            .map((staff) => (
              <StaffAccordion key={staff.StaffID} staff={staff} />
            ))
        ) : (
          <Box sx={{ p: 2, width: '100%' }}>
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

export function StaffsWithNoPositionsComponent({ staffs }) {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ArrowDownwardRounded />}>
        <Typography variant="body1" fontWeight={500}>
          Not verified
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {staffs && staffs.length > 0 ? (
          staffs
            .filter((staff) => !staff.PositionHeld)
            .map((staff) => (
              <StaffAccordion key={staff.StaffID} staff={staff} />
            ))
        ) : (
          <Box sx={{ p: 2, width: '100%' }}>
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

function StaffAccordion({ staff }) {
  const [expanded, setExpanded] = useState(false);

  const toggleAccordion = () => {
    setExpanded(!expanded);
  };

  return (
    <Accordion expanded={expanded} onChange={toggleAccordion}>
      <AccordionSummary expandIcon={<ArrowDownwardRounded />}>
        <Typography variant="body1" fontWeight={500}>
          {staff.FirstName} (S{staff.StaffID})
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {/* Staff Details */}
        <Box sx={{ width: '100%' }}>
          <Typography variant="h6" fontWeight={500}>
            Staff Details
          </Typography>
          <Divider />
          <Typography variant="body1" fontSize={14} color="text.secondary">
            <b>Address:</b> {staff.FullAddress}
          </Typography>
          <Typography variant="body1" fontSize={14} color="text.secondary">
            <b>Telephone Number:</b> {staff.TelephoneNumber}
          </Typography>
          <Typography variant="body1" fontSize={14} color="text.secondary">
            <b>Date of Birth:</b> {staff.DateOfBirth}
          </Typography>
          <Typography variant="body1" fontSize={14} color="text.secondary">
            <b>Sex:</b> {staff.Sex === 'M' || staff.Sex === 'm' ? 'Male' : 'Female'}
          </Typography>
          {staff.PositionHeld != null ?
            <Typography variant="body1" fontSize={14} color="text.secondary">
              <b>Position:</b> {staff.PositionHeld}
            </Typography> : <></>}

          <Typography variant="body1" fontSize={14} color="text.secondary">
            <b>NiN:</b> {staff.NiN}
          </Typography>
        </Box>
        {/* Work Experience and Qualification */}
        <Box sx={{ width: '100%', marginTop: 2 }}>
          <Grid container spacing={2} >
            {/* Work Experience */}
            <Grid item xs={6} >
              <Box sx={{ width: '100%', border: 2, borderColor: 'divider', height: '100%' }}>
                <Typography variant="h6" fontWeight={500}>
                  Work Experience
                </Typography>
                <Divider />
                <Typography variant="body1" fontSize={14} color="text.secondary">
                  <b>Organization:</b> {staff.WorkExperience.OrganizationName}
                </Typography>
                <Typography variant="body1" fontSize={14} color="text.secondary">
                  <b>Position:</b> {staff.WorkExperience.Position}
                </Typography>
                <Typography variant="body1" fontSize={14} color="text.secondary">
                  <b>Start Date:</b> {staff.WorkExperience.StartDate}
                </Typography>
                <Typography variant="body1" fontSize={14} color="text.secondary">
                  <b>End Date:</b> {staff.WorkExperience.EndDate}
                </Typography>
              </Box>
            </Grid>
            {/* Qualification */}
            <Grid item xs={6}>
              <Box sx={{ width: '100%', border: 2, borderColor: 'divider', height: '100%' }}>
                <Typography variant="h6" fontWeight={500}>
                  Qualification
                </Typography>
                <Divider />
                <Typography variant="body1" fontSize={14} color="text.secondary">
                  <b>Organization:</b> {staff.Qualification.InstitutionName}
                </Typography>
                <Typography variant="body1" fontSize={14} color="text.secondary">
                  <b>Qualification Date:</b> {staff.Qualification.QualificationDate}
                </Typography>
                <Typography variant="body1" fontSize={14} color="text.secondary">
                  <b>Qualification Type:</b> {staff.Qualification.QualificationType}
                </Typography>
              </Box>
            </Grid>
            {/* Empty Row */}
            <Grid item xs={12}>
              <Box sx={{ height: 16 }} />
            </Grid>
          </Grid>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
