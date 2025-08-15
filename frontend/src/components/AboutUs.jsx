import React from 'react';
import styles from './AboutUs.module.css';
import lockscreenImage from '../img/Lockscreen.jpg';

const values = [
  { icon: '🤝', title: 'Community', desc: 'Bringing people together.' },
  { icon: '🙏', title: 'Cultural Respect', desc: 'Honouring Tamil heritage.' },
  { icon: '💡', title: 'Innovation', desc: 'Blending tradition & tech.' },
  { icon: '🔒', title: 'Integrity', desc: 'Reliable & transparent.' },
];

const steps = [
  { icon: '🔍', title: 'Browse Halls' },
  { icon: '📅', title: 'Check Availability' },
  { icon: '✅', title: 'Book Instantly' },
];

const testimonials = [
  {
    text: "The auditorium was top‑notch—AC, lighting & sound were excellent!",
    author: "Dilshan S., Google Reviews",
  },
  {
    text: "Modern and well‑maintained venue, perfect for cultural events.",
    author: "Pratheeswaran K., Google Reviews",
  },
];

const AboutUs = () => (
  <div className={styles.aboutPage}>
    {/* Hero Section */}
    <section
      className={styles.hero}
      style={{ backgroundImage: `url(${lockscreenImage})` }}
    >
      <div className={styles.overlay}>
        <h1>About Jaffna Thiruvalluvar Cultural Centre</h1>
        <p>Your Online Gateway to Cultural Celebrations in Jaffna</p>
      </div>
    </section>

    {/* Who We Are */}
    <section className={styles.section}>
      <h2>Who We Are</h2>
      <p>
        The Jaffna Thiruvalluvar Cultural Centre is a vibrant 11-floor multimedia hub
        that showcases Tamil culture through theatre, music, and education.
        Funded by a $12 million Indian grant and inaugurated in 2023, it now offers
        an online hall booking system to make cultural events more accessible.
      </p>
    </section>

    {/* Vision & Mission */}
    <section className={styles.visionMission}>
      <div className={styles.card}>
        <h3>Our Vision</h3>
        <p>
          The Jaffna Thiruvalluvar Cultural Centre is a vibrant 11-floor multimedia hub
        that showcases Tamil culture through theatre, music, and education.
        Funded by a $12 million Indian grant and inaugurated in 2023, it now offers
        an online hall booking system to make cultural events more accessible.
        </p>
      </div>
      <div className={styles.card}>
        <h3>Our Mission</h3>
        <p>
          To offer a seamless, user-friendly platform for booking exceptional venues
          that honour tradition, culture, and community spirit.
        </p>
      </div>
    </section>

    {/* Core Values */}
    <section className={styles.section}>
      <h2>Our Core Values</h2>
      <div className={styles.values}>
        {values.map((v) => (
          <div key={v.title} className={styles.valueCard}>
            <div className={styles.valueIcon}>{v.icon}</div>
            <div>
              <h4>{v.title}</h4>
              <p>{v.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Platform Features & Steps */}
    <section className={styles.section}>
      <h2>Why Book With Us</h2>
      <ul className={styles.features}>
        <li>✅ Real-time Hall Availability</li>
        <li>✅ Mobile-friendly Interface</li>
        <li>✅ Instant Booking Confirmation</li>
        <li>✅ Secure Online Payments</li>
        <li>✅ 24/7 Customer Support</li>
        <li>✅ State-of-the-art Auditoriums & Museum</li>
      </ul>

      <h3>How It Works</h3>
      <div className={styles.steps}>
        {steps.map((s) => (
          <div key={s.title} className={styles.stepCard}>
            <div className={styles.stepIcon}>{s.icon}</div>
            <h4>{s.title}</h4>
          </div>
        ))}
      </div>
    </section>

    {/* Legacy */}
    <section className={styles.section}>
      <h2>Our Legacy</h2>
      <p>
        Conceived in 2011 and completed in 2023, the centre stands as a symbol
        of cultural revival and Indo-Sri Lankan cooperation. Today, it continues
        that legacy by going digital.
      </p>
      <div className={styles.metrics}>
        <div><strong>100+</strong><br />Bookings Completed</div>
        <div><strong>1000+</strong><br />Happy Guests</div>
        <div><strong>2 Years</strong><br />of Cultural Impact</div>
      </div>
    </section>

    {/* Testimonials */}
    <section className={styles.section}>
      <h2>What Our Guests Say</h2>
      <div className={styles.testimonials}>
        {testimonials.map((t, i) => (
          <div key={i} className={styles.testimonialCard}>
            <p>“{t.text}”</p>
            <strong>{t.author}</strong>
          </div>
        ))}
      </div>
    </section>

    {/* Team Message */}
    <section className={styles.section}>
      <h2>Message from Our Team</h2>
      <p>
        "Our platform is built upon a vision to honour Tamil heritage through
        accessible, powerful technology. We continue to evolve while rooted in tradition."
      </p>
      <p><strong>— The EventAura Team</strong></p>
    </section>

    {/* Trust & Security */}
    <section className={styles.section}>
      <h2>Trust & Security</h2>
      <p>
        Your privacy and payment security matter to us. We use industry-standard
        SSL encryption and secure payment gateways to protect your data and bookings.
      </p>
    </section>

    {/* CTA */}
    <section className={styles.cta}>
      <h2>Looking to Book a Venue?</h2>
      <p>Experience the perfect blend of tradition and elegance for your special occasion</p>
      <button>Explore Our Halls</button>
    </section>
  </div>
);

export default AboutUs;
