'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to landing page
    router.push('/landing-page');
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#f0f9f0' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ color: '#4CAF50' }}>PeTA</h1>
        <p>Redirecting to landing page...</p>
      </div>
    </div>
  );
}