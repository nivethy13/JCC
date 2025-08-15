export const aboutStyles = {
  heroSection: {
    position: 'relative',
    height: '60vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    textAlign: 'center',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 1,
    }
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '800px',
    padding: '0 20px'
  },
  statItem: {
    textAlign: 'center',
    padding: '20px'
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: 'primary.main'
  },
  statLabel: {
    fontSize: '1rem',
    textTransform: 'uppercase'
  },
  section: {
    padding: '60px 0'
  },
  ctaSection: {
    padding: '40px',
    borderRadius: '8px',
    textAlign: 'center'
  }
};