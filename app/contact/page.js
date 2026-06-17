/**
 * app/contact/page.js  →  route: /contact
 */

import Contact        from '@/components/Contact';
import PageTransition from '@/components/PageTransition';

export const metadata = {
  title:       'Contact | Ananya Raj',
  description: 'Get in touch with Ananya Raj for project enquiries, collaborations, or just to say hi.',
};

export default function ContactPage() {
  return (
    <PageTransition>
      <Contact />
    </PageTransition>
  );
}
