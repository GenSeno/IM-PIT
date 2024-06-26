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
      <Accordion sx={{ marginBottom: '20px', boxShadow: 'none' }}>
      <AccordionSummary
        expandIcon={<ArrowDownwardRounded />}
        sx={{
          background: '#A4D8D8',
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
          borderRadius: '4px',
        }}
      >
        <Typography variant="body1" fontWeight={500} color="#000">
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
      <Accordion sx={{ marginBottom: '20px', boxShadow: 'none' }}>
      <AccordionSummary
        expandIcon={<ArrowDownwardRounded />}
        sx={{
          background: '#A4D8D8',
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
          borderRadius: '4px',
        }}
      >
        <Typography variant="body1" fontWeight={500} color="#000">
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
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #e0f7fa 25%, #80deea 100%)',
                boxShadow: 3,
              }}
            >
              <Typography variant="h6" fontWeight={500}>
                Staff Details
              </Typography>
              <Divider sx={{ my: 2 }} />
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
              {staff.PositionHeld != null && (
                <Typography variant="body1" fontSize={14} color="text.secondary">
                  <b>Position:</b> {staff.PositionHeld}
                </Typography>
              )}
              <Typography variant="body1" fontSize={14} color="text.secondary">
                <b>NiN:</b> {staff.NiN}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #e0f7fa 25%, #80deea 100%)',
                boxShadow: 3,
              }}
            >
              <Typography variant="h6" fontWeight={500}>
                Work Experience
              </Typography>
              <Divider sx={{ my: 2 }} />
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
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #e0f7fa 25%, #80deea 100%)',
                boxShadow: 3,
              }}
            >
              <Typography variant="h6" fontWeight={500}>
                Qualification
              </Typography>
              <Divider sx={{ my: 2 }} />
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
        </Grid>
      </AccordionDetails>
    </Accordion>
    );
  }
