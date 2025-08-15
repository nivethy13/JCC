import React from 'react';
import { 
  Container,
  Typography,
  Box,
  Divider,
  Button,
  Grid,
  Card,
  CardContent,
  Link
} from '@mui/material';

import lockscreenImage from '../img/Lockscreen.jpg';

const AboutPage = () => {
  // Color scheme from the template
  const colors = {
    primary: '#7d2e37ff',  // Deep green
    secondary: '#b55735ff', // Amber
    textPrimary: '#263238', // Dark blue-gray
    textSecondary: '#455A64', // Light blue-gray
    background: '#F5F5F5', // Light gray
    accent: '#D32F2F'     // Deep red
  };

  return (
    <Container maxWidth="md" sx={{
      py: 6,
      px: { xs: 3, md: 4 },
      color: colors.textPrimary
    }}>
      {/* Header Section */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 6 ,
        p : 4,
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${lockscreenImage})`,
        height: '35vh',       
      }}>
        <Typography variant="h3" sx={{
          fontWeight: 700,
          mb: 2,
          p: 4,
          color: colors.primary,
          fontSize: { xs: '2rem', md: '2.5rem' }
        }}>
          About Jaffna Cultural Centre
        </Typography>
        <Typography variant="h6" sx={{
          mb: 4,
          p:3.5,
          fontWeight: 600,
          color: colors.secondary,
          fontSize: { xs: '1.1rem', md: '1.25rem' }
        }}>
          Preserving Culture Through Celebrations
        </Typography>
        <Divider sx={{ 
          mt: 4,
          mb:2,
          borderWidth: 2,
          borderColor: colors.accent,
          width: '350px',
          mx: 'auto'
        }} />
      </Box>

      {/* Who We Are Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{
          fontWeight: 700,
          mb: 3,
          color: colors.primary,
          fontSize: { xs: '1.5rem', md: '1.75rem' }
        }}>
          Who We Are
        </Typography>
        <Typography paragraph sx={{
          lineHeight: 1.7,
          mb: 3,
          fontSize: '1.1rem',
          color: colors.textPrimary
        }}>
          The Jaffna Cultural Centre stands as a beacon of Tamil heritage and tradition in our community. For decades, we have been dedicated to preserving and celebrating our rich cultural legacy through various events and celebrations.
        </Typography>
        <Typography paragraph sx={{
          lineHeight: 1.7,
          mb: 3,
          fontSize: '1.1rem',
          color: colors.textPrimary
        }}>
          Our mission is to provide a magnificent venue for traditional programs, weddings, cultural festivals, and community gatherings. We believe in creating spaces where memories are made and traditions are honored.
        </Typography>
        <Typography paragraph sx={{
          lineHeight: 1.7,
          fontSize: '1.1rem',
          color: colors.textPrimary
        }}>
          From intimate family celebrations to grand cultural festivals, our halls have witnessed countless moments of joy, unity, and cultural pride.
        </Typography>
      </Box>

      {/* Vision Section */}
      <CardContent sx={{ 
        mb: 6,
        p: 4,
        backgroundColor: colors.background,
        borderRadius: 2,
        width : '40%'
      }}>
        <Typography variant="h4" sx={{
          fontWeight: 700,
          mb: 3,
          color: colors.primary,
          fontSize: { xs: '1.5rem', md: '1.75rem' }
        }}>
          Our Vision
        </Typography>
        <Typography paragraph sx={{
          lineHeight: 1.7,
          fontSize: '1.1rem',
          color: colors.textPrimary
        }}>
          To be the premier cultural destination that bridges generations, preserving Tamil heritage while embracing modern celebrations and community unity.
        </Typography>
      </CardContent>

      {/* Mission Section */}
      <CardContent sx={{ 
        mb: 6,
        p: 4,
        backgroundColor: colors.background,
        borderRadius: 2,
        width : '40%'
      }}>
        <Typography variant="h4" sx={{
          fontWeight: 700,
          mb: 3,
          color: colors.primary,
          fontSize: { xs: '1.5rem', md: '1.75rem' }
        }}>
          Our Mission
        </Typography>
        <Typography paragraph sx={{
          lineHeight: 1.7,
          fontSize: '1.1rem',
          color: colors.textPrimary
        }}>
          To provide exceptional venues and services that honor cultural traditions while creating unforgettable experiences for every celebration and gathering.
        </Typography>
      </CardContent>

      {/* Our Legacy */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700,
          mb: 3,
          color: colors.primary,
          textAlign: 'center',
          fontSize: { xs: '1.5rem', md: '1.75rem' }}}>
          Our Legacy
        </Typography>
        <Typography variant="body1" paragraph sx={{
          lineHeight: 1.7,
          mb: 3,
          fontSize: '1.1rem',
          color: colors.textPrimary
        }}>
          Established in 2023, the Jaffna Cultural Centre began as a humble community hall with a grand vision. Founded by local cultural enthusiasts, our centre has grown to become the heart of Tamil cultural celebrations in the region.
        </Typography>
      </Box>

       <Divider sx={{ my: 6 }} />

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 6 ,p: 4,}}>
        {[
          { value: '500+', label: 'Events Hosted' },
          { value: '100+', label: 'Happy Guests' },
          { value: '2', label: 'Years of Excellence' }
        ].map((stat, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card sx={{ 
              height: '90%',
              backgroundColor: colors.primary,
              color: 'white',
              textAlign: 'center',
              py: 3,
              boxShadow: 3
            }}>
              <CardContent>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="h6">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 6 }} />

      {/* CTA Section */}
      <Box sx={{ 
        textAlign: 'center',
        backgroundColor: colors.secondary,
        p: 4,
        borderRadius: 2,
        mb: 6 
      }}>

        <Typography variant="h4" sx={{ 
          fontWeight: 700, 
          mb: 2,
          color: 'white',
          fontSize: { xs: '1.5rem', md: '1.75rem' }
        }}>
          Looking to Book a Venue?
        </Typography>
        <Typography paragraph sx={{ 
          maxWidth: '600px', 
          mx: 'auto', 
          mb: 3,
          color: 'white'
        }}>
          Experience the perfect blend of tradition and elegance for your special occasion.
        </Typography>
        <Button 
          variant="contained"
          size="large"
          href="/booking"
          sx={{ 
            px: 4, 
            py: 1.5,
            fontWeight: 600,
            fontSize: '1rem',
            backgroundColor: 'white',
            color: colors.secondary,
            '&:hover': {
              backgroundColor: '#FFF8E1'
            }
          }}
        >
          Explore Our Halls
        </Button>
      </Box>

      {/* Footer */}
      <Box sx={{ 
        textAlign: 'center', 
        mt: 6,
        borderTop: `1px solid ${colors.textSecondary}`,
        pt: 4
      }}>
        <Typography variant="h6" sx={{ 
          fontWeight: 600,
          mb: 1,
          color: colors.primary
        }}>
          EventAura
        </Typography>
        <Typography variant="body1" sx={{ 
          mb: 2,
          color: colors.textSecondary
        }}>
          Your premier destination for cultural celebrations and memorable events in the heart of Jaffna.
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 2 }}>
          {['Home', 'About', 'Gallery', 'Contact'].map((item) => (
            <Link 
              key={item}
              href={`/${item.toLowerCase()}`}
              sx={{
                color: colors.primary,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                  color: colors.accent
                }
              }}
            >
              {item}
            </Link>
          ))}
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ color: colors.textSecondary }}>
            123 Cultural Street, Jaffna
          </Typography>
          <Typography variant="body2" sx={{ color: colors.textSecondary }}>
            +94 21 123 4567
          </Typography>
          <Typography variant="body2" sx={{ color: colors.textSecondary }}>
            info@eventaura.it
          </Typography>
        </Box>
        
        <Typography variant="body2" sx={{ 
          color: colors.textSecondary,
          fontSize: '0.875rem'
        }}>
          © 2023 Eventaura. All rights reserved.
        </Typography>
      </Box>
    </Container>
  );
};

export default AboutPage;

// import React from 'react';
// import '../css/AboutPage.css';

// const AboutPage = () => {
//   return (
//     <div className="about-container">
//       {/* Header Section */}
//       <header className="about-header">
//         <h1 className="about-title">About Jaffna Cultural Centre</h1>
//         <p className="about-subtitle">Preserving Culture Through Celebrations</p>
//         <hr className="header-divider" />
//       </header>

//       {/* Who We Are Section */}
//       <section className="section">
//         <h2 className="section-title">Who We Are</h2>
//         <p className="section-content">
//           The Jaffna Cultural Centre stands as a beacon of Tamil heritage and tradition in our community. For decades, we have been dedicated to preserving and celebrating our rich cultural legacy through various events and celebrations.
//         </p>
//         <p className="section-content">
//           Our mission is to provide a magnificent venue for traditional programs, weddings, cultural festivals, and community gatherings. We believe in creating spaces where memories are made and traditions are honored.
//         </p>
//         <p className="section-content">
//           From intimate family celebrations to grand cultural festivals, our halls have witnessed countless moments of joy, unity, and cultural pride.
//         </p>
//       </section>

//       {/* Vision Section */}
//       <section className="section">
//         <h3 className="section-title">Our Vision</h3>
//         <p className="section-content">
//           To be the premier cultural destination that bridges generations, preserving Tamil heritage while embracing modern celebrations and community unity.
//         </p>
//       </section>

//       {/* Mission Section */}
//       <section className="section">
//         <h3 className="section-title">Our Mission</h3>
//         <p className="section-content">
//           To provide exceptional venues and services that honor cultural traditions while creating unforgettable experiences for every celebration and gathering.
//         </p>
//       </section>

//       {/* Legacy Section */}
//       <section className="section">
//         <h2 className="section-title">Our Legacy</h2>
//         <p className="section-content">
//           Established in 1985, the Jaffna Cultural Centre began as a humble community hall with a grand vision. Founded by local cultural enthusiasts, our centre has grown to become the heart of Tamil cultural celebrations in the region.
//         </p>
        
//         {/* Stats */}
//         <div className="stats-container">
//           <div className="stat-item">
//             <div className="stat-value">30:00+</div>
//             <div className="stat-label">Events Hosted</div>
//           </div>
//           <div className="stat-item">
//             <div className="stat-value">30.000+</div>
//             <div className="stat-label">Happy Guests</div>
//           </div>
//           <div className="stat-item">
//             <div className="stat-value">9:00+</div>
//             <div className="stat-label">Years of Excellence</div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="cta-section">
//         <h2 className="cta-title">Looking to Book a Venue?</h2>
//         <p className="section-content">
//           Experience the perfect blend of tradition and elegance for your special occasion.
//         </p>
//         <a href="/booking" className="cta-button">Explore Our Halls</a>
//       </section>

//       {/* Footer */}
//       <footer className="footer">
//         <h4 className="footer-title">EventAura</h4>
//         <p>Your premier destination for cultural celebrations and memorable events in the heart of Jaffna.</p>
        
//         <div className="footer-links">
//           <a href="/" className="footer-link">Home</a>
//           <a href="/about" className="footer-link">About</a>
//           <a href="/gallery" className="footer-link">Gallery</a>
//           <a href="/contact" className="footer-link">Contact</a>
//         </div>
        
//         <div className="contact-info">
//           <p>123 Cultural Street, Jaffna</p>
//           <p>+94 21 123 4567</p>
//           <p>info@eventaura.it</p>
//         </div>
        
//         <p className="copyright">© 2023 Eventaura. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default AboutPage;