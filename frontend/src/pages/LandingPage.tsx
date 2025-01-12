import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { LibraryBooks, CalendarMonth, School } from '@mui/icons-material';
import MainLayout from '../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const navigate = useNavigate();

    const handleClickRegister = () => {
        navigate('/register')
    }

  return (
    <MainLayout>
      <Box sx={{ mt: 8, mb: 8 }}>
        <Typography variant="h1" sx={{ fontSize: '3.5rem', fontWeight: 700, textAlign: 'center', mb: 1 }}>
          Seu guia completo na{' '}
          <Typography component="span" variant="h1" color="primary" display="inline" sx={{ fontSize: 'inherit' }}>
            Engenharia da Computação
          </Typography>
        </Typography>
        
        <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 500, textAlign: 'center', color: '#666', mb: 4 }}>
          Organize seus materiais, consulte a grade curricular e encontre tudo que precisa para sua jornada acadêmica em um só lugar.
        </Typography>

        <Grid container justifyContent="center" sx={{ mb: 8 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ 
              py: 2, 
              px: 4, 
              borderRadius: '50px',
              fontSize: '1.1rem' 
            }}
            onClick={handleClickRegister}
          >
            Começar agora
          </Button>
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
              <LibraryBooks color="primary" sx={{ fontSize: 40, mb: 2 }} />
              <CardContent>
                <Typography variant="h5" component="h3" gutterBottom align="center" sx={{ fontWeight: 600 }}>
                  Materiais Organizados
                </Typography>
                <Typography variant="body1" color="text.secondary" align="center">
                  Acesse e compartilhe materiais de estudo organizados por disciplina.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
              <CalendarMonth color="primary" sx={{ fontSize: 40, mb: 2 }} />
              <CardContent>
                <Typography variant="h5" component="h3" gutterBottom align="center" sx={{ fontWeight: 600 }}>
                  Grade Curricular
                </Typography>
                <Typography variant="body1" color="text.secondary" align="center">
                  Visualize a grade curricular completa e planeje seu percurso acadêmico.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
              <School color="primary" sx={{ fontSize: 40, mb: 2 }} />
              <CardContent>
                <Typography variant="h5" component="h3" gutterBottom align="center" sx={{ fontWeight: 600 }}>
                  Guia Completo
                </Typography>
                <Typography variant="body1" color="text.secondary" align="center">
                  Encontre informações e dicas importantes sobre cada disciplina do curso.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
}

