import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-reckless text-4xl md:text-5xl font-medium mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-12">Last updated: January 1, 2025</p>
        
        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="font-reckless text-2xl font-medium mb-4">Who we are</h2>
            <p className="leading-relaxed text-foreground">
              We are Works App, Inc., doing business as Post. Our website address is: https://www.trypost.ai
            </p>
          </section>

          <section>
            <h2 className="font-reckless text-2xl font-medium mb-4">Comments</h2>
            <p className="leading-relaxed text-foreground">
              When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor's IP address and browser user agent string to help spam detection.
            </p>
          </section>

          <section>
            <h2 className="font-reckless text-2xl font-medium mb-4">Media</h2>
            <p className="leading-relaxed text-foreground">
              If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website.
            </p>
          </section>

          <section>
            <h2 className="font-reckless text-2xl font-medium mb-4">Cookies</h2>
            <p className="leading-relaxed text-foreground mb-4">
              If you leave a comment on our site you may opt-in to saving your name, email address and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies will last for one year.
            </p>
            <p className="leading-relaxed text-foreground mb-4">
              If you visit our login page, we will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser.
            </p>
            <p className="leading-relaxed text-foreground">
              When you log in, we will also set up several cookies to save your login information and your screen display choices. Login cookies last for two days, and screen options cookies last for a year. If you select "Remember Me", your login will persist for two weeks. If you log out of your account, the login cookies will be removed.
            </p>
          </section>

          <section>
            <h2 className="font-reckless text-2xl font-medium mb-4">Embedded content from other websites</h2>
            <p className="leading-relaxed text-foreground">
              Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.
            </p>
          </section>

          <section>
            <h2 className="font-reckless text-2xl font-medium mb-4">Who we share your data with</h2>
            <p className="leading-relaxed text-foreground">
              If you request a password reset, your IP address will be included in the reset email.
            </p>
          </section>

          <section>
            <h2 className="font-reckless text-2xl font-medium mb-4">How long we retain your data</h2>
            <p className="leading-relaxed text-foreground">
              If you leave a comment, the comment and its metadata are retained indefinitely. This is so we can recognize and approve any follow-up comments automatically instead of holding them in a moderation queue.
            </p>
          </section>

          <section>
            <h2 className="font-reckless text-2xl font-medium mb-4">What rights you have over your data</h2>
            <p className="leading-relaxed text-foreground">
              If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes.
            </p>
          </section>

          <section>
            <h2 className="font-reckless text-2xl font-medium mb-4">Contact information</h2>
            <p className="leading-relaxed text-foreground">
              For any privacy-related questions, please contact us at{" "}
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

export default Privacy;
