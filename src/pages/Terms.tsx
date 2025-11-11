import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-reckless text-4xl md:text-5xl font-medium mb-8">Terms and Conditions</h1>
        <p className="text-muted-foreground mb-12">Please read these terms and conditions carefully before using Our Service.</p>
        
        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="font-reckless text-2xl font-medium mb-4">Interpretation and Definitions</h2>
            
            <h3 className="text-xl font-semibold mb-3 mt-6">Interpretation</h3>
            <p className="leading-relaxed text-foreground">
              The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">Definitions</h3>
            <p className="leading-relaxed text-foreground mb-3">For the purposes of these Terms and Conditions:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li><strong>Account</strong> means a unique account created for You to access our Service or parts of our Service.</li>
              <li><strong>Country</strong> refers to: The United States of America</li>
              <li><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Works App, Inc. 651 N Broad St, Suite 201, Middletown, DE 19709 US.</li>
              <li><strong>Content</strong> refers to content such as text, images, or other information that can be posted, uploaded, linked to or otherwise made available by You, regardless of the form of that content.</li>
              <li><strong>Device</strong> means any device that can access the Service such as a computer, a cellphone or a digital tablet.</li>
              <li><strong>Service</strong> refers to the Website.</li>
              <li><strong>Subscriptions</strong> refer to the services or access to the Service offered on a subscription basis by the Company to You.</li>
              <li><strong>Terms and Conditions</strong> (also referred as "Terms") mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service.</li>
              <li><strong>Website</strong> refers to Post, accessible from https://www.trypost.ai</li>
            </ul>
          </section>

          <section>
            <h2 className="font-reckless text-2xl font-medium mb-4">Acknowledgment</h2>
            <p className="leading-relaxed text-foreground">
              These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.
            </p>
            <p className="leading-relaxed text-foreground mt-4">
              Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.
            </p>
          </section>

          <section>
            <h2 className="font-reckless text-2xl font-medium mb-4">User Accounts</h2>
            <p className="leading-relaxed text-foreground">
              When You create an account with Us, You must provide Us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of Your account on Our Service.
            </p>
          </section>

          <section>
            <h2 className="font-reckless text-2xl font-medium mb-4">Subscriptions</h2>
            <p className="leading-relaxed text-foreground">
              Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis. Billing cycles are set on a monthly or annual basis, depending on the type of subscription plan you select.
            </p>
          </section>

          <section>
            <h2 className="font-reckless text-2xl font-medium mb-4">Termination</h2>
            <p className="leading-relaxed text-foreground">
              We may terminate or suspend Your Account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions.
            </p>
          </section>

          <section>
            <h2 className="font-reckless text-2xl font-medium mb-4">Limitation of Liability</h2>
            <p className="leading-relaxed text-foreground">
              To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever.
            </p>
          </section>

          <section>
            <h2 className="font-reckless text-2xl font-medium mb-4">Contact Us</h2>
            <p className="leading-relaxed text-foreground">
              If you have any questions about these Terms and Conditions, You can contact us at{" "}
              <a href="mailto:support@trypost.ai" className="text-primary hover:underline">
                support@trypost.ai
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
