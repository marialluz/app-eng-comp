import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: 'primary.main', color: 'white' }}>
      <Typography variant="body2" align="center">
        © {new Date().getFullYear()} CompFlow. Todos os direitos reservados.
      </Typography>
    </Box>
  );
};

export default Footer;
