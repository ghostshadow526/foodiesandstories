
export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in-up">
      <div className="max-w-4xl mx-auto prose prose-lg">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <p>ICESTORIES ("us", "we", or "our") operates the ICESTORIES website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.</p>
        
        <h2 className="font-headline">Information Collection And Use</h2>
        <p>We collect several different types of information for various purposes to provide and improve our Service to you. This may include, but is not limited to, your email address, name, phone number, and address.</p>
        
        <h2 className="font-headline">Use of Data</h2>
        <p>ICESTORIES uses the collected data for various purposes:</p>
        <ul>
            <li>To provide and maintain the Service</li>
            <li>To notify you about changes to our Service</li>
            <li>To provide customer care and support</li>
            <li>To provide analysis or valuable information so that we can improve the Service</li>
            <li>To monitor the usage of the Service</li>
            <li>To detect, prevent and address technical issues</li>
        </ul>

        <h2 className="font-headline">Log Data</h2>
        <p>We may also collect information that your browser sends whenever you visit our Service or when you access the Service by or through a mobile device ("Log Data").</p>

        <h2 className="font-headline">Cookies</h2>
        <p>We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
        
        <h2 className="font-headline">Service Providers</h2>
        <p>We may employ third party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>
        
        <h2 className="font-headline">Security</h2>
        <p>The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
        
        <h2 className="font-headline">Changes To This Privacy Policy</h2>
        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
        
        <h2 className="font-headline">Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us.</p>
      </div>
    </div>
  );
}
