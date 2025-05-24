'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './page.module.css';

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState('hero');
  const isTransitioning = useRef(false);
  const lastScrollTime = useRef(0);
  const sections = ['hero', 'stunting', 'prevention', 'features'];

  // Smoother scroll to section function
  const scrollToSection = useCallback((sectionId: string) => {
    if (isTransitioning.current) return;
    
    isTransitioning.current = true;
    setActiveSection(sectionId);
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
    
    // Reset transition flag after scroll completes
    setTimeout(() => {
      isTransitioning.current = false;
    }, 1000);
  }, []);

  // Handle scroll to update active section based on viewport
  useEffect(() => {
    const handleScroll = () => {
      if (isTransitioning.current) return;
      
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Find which section is most visible
      let currentSection = 'hero';
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (!element) continue;
        
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrollY;
        
        // Check if we've scrolled past the middle of this section
        if (scrollY >= elementTop - windowHeight / 2) {
          currentSection = section;
        }
      }
      
      setActiveSection(currentSection);
    };

    // Throttle scroll events for better performance
    let scrollTimeout: NodeJS.Timeout;
    const throttledScroll = () => {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => {
        handleScroll();
        scrollTimeout = null as any;
      }, 50);
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [sections]);

  // Smoother wheel event handling
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      
      // Debounce wheel events for smoother experience
      if (now - lastScrollTime.current < 800) {
        e.preventDefault();
        return;
      }
      
      if (isTransitioning.current) {
        e.preventDefault();
        return;
      }

      const delta = e.deltaY;
      const currentIndex = sections.indexOf(activeSection);
      let nextIndex;

      // Higher threshold for more deliberate scrolling
      if (Math.abs(delta) < 30) return;

      if (delta > 0) {
        nextIndex = Math.min(currentIndex + 1, sections.length - 1);
      } else {
        nextIndex = Math.max(currentIndex - 1, 0);
      }

      const nextSectionId = sections[nextIndex];

      if (nextSectionId !== activeSection) {
        e.preventDefault();
        lastScrollTime.current = now;
        scrollToSection(nextSectionId);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [activeSection, scrollToSection, sections]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning.current) return;
      
      const currentIndex = sections.indexOf(activeSection);
      let nextIndex;
      
      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault();
          nextIndex = Math.min(currentIndex + 1, sections.length - 1);
          break;
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          nextIndex = Math.max(currentIndex - 1, 0);
          break;
        case 'Home':
          e.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          nextIndex = sections.length - 1;
          break;
        default:
          return;
      }
      
      const nextSectionId = sections[nextIndex];
      if (nextSectionId !== activeSection) {
        scrollToSection(nextSectionId);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeSection, scrollToSection, sections]);

  // Cleaner image animation on scroll
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          
          // Add animation class immediately for smoother effect
          requestAnimationFrame(() => {
            target.classList.add(styles.imageVisible);
          });
          
          // Stop observing once animated
          imageObserver.unobserve(target);
        }
      });
    }, observerOptions);

    // Observe all animatable elements
    const imageElements = document.querySelectorAll(
      `.${styles.heroImage}, .${styles.stuntingImage}, .${styles.featureImageCircle}, .${styles.warningSignLeft}, .${styles.warningSignRight}`
    );
    
    imageElements.forEach(el => imageObserver.observe(el));

    // Cleanup
    return () => {
      imageElements.forEach(el => imageObserver.unobserve(el));
    };
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Image src="/logo.png" alt="PeTA Logo" width={50} height={50} />
        </div>
        <div className={styles.nav}>
          <button className={styles.signUpBtn}>SIGN UP</button>
          <button className={styles.loginBtn}>LOGIN</button>
        </div>
      </header>
      
      {/* Navigation Dots */}
      <div className={styles.sectionNav}>
        {sections.map((section) => (
          <div 
            key={section}
            className={`${styles.navDot} ${activeSection === section ? styles.active : ''}`} 
            onClick={() => scrollToSection(section)}
            aria-label={`Go to ${section} section`}
          />
        ))}
      </div>

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.heroSection} id="hero">
          <div className={styles.heroWave}></div>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>
              Pantau Pertumbuhan<br />Anak Dengan <span>PeTA</span>
            </h1>
            <p className={styles.description}>
              Melalui fitur pemantauan gizi dan rekomendasi resep harian, PeTA membantu
              orang tua dalam menyediakan asupan nutrisi terbaik bagi anak untuk standar
              kesehatan, sehingga pertumbuhan si kecil dapat berjalan optimal dan terhindar
              dari risiko stunting.
            </p>
            <button className={styles.ctaButton}>
              Pantau Sekarang!
            </button>
          </div>
          <div className={styles.heroImage}>
            <Image 
              src="/hero-kids.png" 
              alt="Happy kids illustration" 
              width={1200} 
              height={1200}
              priority
            />
          </div>
        </section>

        {/* Stunting Section */}
        <section className={styles.stuntingSection} id="stunting">
          <div className={styles.stuntingWave}></div>
          <div className={styles.stuntingContent}>
            <div className={styles.stuntingImage}>
              <div className={styles.stuntingImageCircle}>
                <Image 
                  src="/eating-child.png" 
                  alt="Child eating illustration" 
                  width={600} 
                  height={600}
                />
              </div>
            </div>
            <div className={styles.stuntingInfo}>
              <h2>Stunting?</h2>
              <p>
                Stunting adalah gangguan pertumbuhan akibat kekurangan gizi kronis sejak dalam
                kandungan hingga awal kehidupan anak, yang baru terlihat jelas setelah usia dua tahun.
                Kondisi ini tidak hanya menyebabkan hambatan pertumbuhan fisik, tetapi juga mengganggu
                perkembangan otak, menurunkan kecerdasan, dan berdampak jangka panjang pada
                produktivitas di masa dewasa. Menurut data pada 1.000 Hari Pertama Kehidupan, ini
                merupakan ancaman serius bagi kualitas generasi mendatang.
              </p>
            </div>
          </div>
        </section>

        {/* Prevention Section */}
        <section className={styles.preventionSection} id="prevention">
          <div className={styles.preventionWave}></div>
          <div className={styles.warningSignLeft}></div>
          <div className={styles.warningSignRight}></div>
          <div className={styles.preventionWrapper}>
            <h2>Pencegahan Kami</h2>
            <p>
              PeTA (Pemantau Tumbuh Anak) adalah aplikasi web yang membantu orang tua memantau
              pertumbuhan dan asupan gizi anak untuk mencegah stunting. PeTA menyediakan
              rekomendasi menu sesuai usia dan kebutuhan nutrisi anak, serta memberi notifikasi jika
              asupan harian belum tercukupi. Dengan fitur ini, PeTA mendukung tumbuh kembang anak
              secara optimal melalui pemantauan dan edukasi gizi terbaik.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.featuresSection} id="features">
          <div className={styles.featuresWave}></div>
          <h2>Fitur Kami!</h2>
          <div className={styles.featureCards}>
            <div className={styles.featureCard}>
              <div className={styles.featureImageCircle}>
                <Image 
                  src="/tracker-icon.png" 
                  alt="Tracker Gizi" 
                  width={280} 
                  height={150}
                />
              </div>
              <div className={styles.featureContent}>
                <h3>Tracker Gizi</h3>
                <p>
                  Hitung asupan harian anak secara detil dan mudah dengan
                  Tracker ini membantu memantau keseimbangan nutrisi anak
                  berdasarkan kebutuhan pribadinya.
                </p>
              </div>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureImageCircle}>
                <Image 
                  src="/recipe-icon.png" 
                  alt="Kumpulan Resep" 
                  width={150} 
                  height={150}
                />
              </div>
              <div className={styles.featureContent}>
                <h3>Kumpulan Resep</h3>
                <p>
                  Kumpulan beraneka menu lengkap dan terpadu menaksir jumlah
                  yang dibutuhkan untuk mendukung pertumbuhan anak.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>© 2025 PeTA - Pantau Pertumbuhan Anak</p>
      </footer>
    </div>
  );
}