import React from 'react';
import { AnnouncementBar, SiteHeader, UspStrip, SiteFooter } from '@/components/organisms';

export default function MainLayout({ children }) {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <UspStrip />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
