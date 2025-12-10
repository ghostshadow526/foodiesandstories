
export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in-up">
      <div className="max-w-4xl mx-auto prose prose-lg">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the ICESTORIES website (the "Service") operated by ICESTORIES ("us", "we", or "our").</p>
        
        <p>Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.</p>
        
        <p>By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.</p>
        
        <h2 className="font-headline">Accounts</h2>
        <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
        <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.</p>
        
        <h2 className="font-headline">Intellectual Property</h2>
        <p>The Service and its original content, features and functionality are and will remain the exclusive property of ICESTORIES and its licensors. The Service is protected by copyright, trademark, and other laws of both Nigeria and foreign countries.</p>
        
        <h2 className="font-headline">Links To Other Web Sites</h2>
        <p>Our Service may contain links to third-party web sites or services that are not owned or controlled by ICESTORIES.</p>
        <p>ICESTORIES has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that ICESTORIES shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.</p>
        
        <h2 className="font-headline">Termination</h2>
        <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
        
        <h2 className="font-headline">Governing Law</h2>
        <p>These Terms shall be governed and construed in accordance with the laws of Nigeria, without regard to its conflict of law provisions.</p>
        
        <h2 className="font-headline">Changes</h2>
        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
        
        <h2 className="font-headline">Contact Us</h2>
        <p>If you have any questions about these Terms, please contact us.</p>
      </div>
    </div>
  );
}
