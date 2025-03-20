import React from 'react';
import JobForm from '../components/JobForm';
import JobGrid from '../components/JobGrid';
import { Button, Container, Typography } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import JobTable from '../components/JobTable';
import CsvHandler from '../components/CsvHandler';

const Home = () => (
  <Container maxWidth="lg" sx={{ my: 4 }}>
    <Button variant="outlined" color="error" onClick={() => signOut(auth)} sx={{ mb: 2 }}>
      Logout
    </Button>

    <JobForm />

    <CsvHandler />
    <Typography variant="h6" sx={{ mt: 6, mb: 2 }}>Your Job Applications:</Typography>
    <JobTable />
  </Container>
);

export default Home;
