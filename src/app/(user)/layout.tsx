import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FixedBar from '@/components/layout/FixedBar';
import LineFloat from '@/components/layout/LineFloat';
import BackToTop from '@/components/layout/BackToTop';
import ChatWidget from '@/components/chat/ChatWidget';
import PeiAnimations from '@/components/layout/PeiAnimations';
import CampaignBar from '@/components/layout/CampaignBar';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CampaignBar />
      <Header />
      <main className="flex-1 pb-14">{children}</main>
      <Footer />
      <FixedBar />
      <LineFloat />
      <BackToTop />
      <ChatWidget />
      <PeiAnimations />
    </>
  );
}
