import * as React from 'react';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import Slide from '@mui/material/Slide';
import MuiSnackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props}  />;
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function CustomSnackbar(props) {

    const breakpoints = {
        xs: '(max-width:600px)',
        sm: '(min-width:601px) and (max-width:960px)',
        md: '(min-width:961px) and (max-width:1239px)',
        lg: '(min-width:1240px)',
      };
    
      const isMobile = useMediaQuery(breakpoints.xs);
      const isSmallScreen = useMediaQuery(breakpoints.sm);
      const isMediumScreen = useMediaQuery(breakpoints.md);
      const isLargeScreen = useMediaQuery(breakpoints.lg);
    
      const getWidthBasedOnScreenSize = () => {
        if (isMobile) return 'auto'; // Customize as needed
        if (isSmallScreen) return '70%';
        if (isMediumScreen) return '50%';
        if (isLargeScreen) return '30%';
      };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
        <MuiSnackbar 
            anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            open={props.open} 
            autoHideDuration={props.time || 2000}
            onClose={props.onClose}
            TransitionComponent={Transition}
            sx={{width: getWidthBasedOnScreenSize(), zIndex: 10001}}
            >
        <Alert onClose={props.onClose} severity={props.severity} sx={{ width: '100%' }}>
          {props.message}
        </Alert>
      </MuiSnackbar>
    </Stack>
  );
}
