import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  useTheme,
} from "@mui/material";

function Dashboard() {
  return (
    <Box p={4}>
      <Typography variant="h4" mb={4} fontWeight="bold">
        Tableau de bord
      </Typography>
    </Box>
  );
}

export default Dashboard;