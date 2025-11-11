import Header from "@/components/Header";
import Footer from "@/components/Footer";
import alexMacgregor from "@/assets/alex-macgregor.png";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="prose prose-lg max-w-none space-y-6 text-foreground p-8 rounded-lg" style={{ border: '1px solid #e3e4e5' }}>
          <h1 className="font-reckless text-4xl md:text-5xl font-medium mb-8 text-center">Our story</h1>
          
          <p className="text-lg leading-relaxed text-center">
            We started this to empower creators and brands around the world with the most advanced social media scheduling technology that just works.
          </p>

          <p className="font-semibold text-xl mt-8">Hello there!</p>

          <p className="leading-relaxed">
            Social media management tools were revolutionary once, but somewhere along the way they traded focus for feature bloat.
          </p>

          <p className="leading-relaxed">
            That frustration became the spark for Post. We're building a lean, AI-first social media scheduling platform that prizes speed, accuracy, and transparency over shiny add-ons.
          </p>

          <p className="leading-relaxed">
            Imagine describing your content strategy the way you'd brief a colleague—and seeing your posts scheduled across all platforms in seconds, not hours. Then imagine paying a fair, cancel-anytime rate for that clarity instead of an annual contract padded with modules you'll never open.
          </p>

          <p className="leading-relaxed">
            Our small team writes code in the daylight and verifies data at night, propelled by a simple goal: help you share your content without the busywork. We'd rather invest in product improvements than celebrity keynotes; rather answer a customer email than craft another upsell deck.
          </p>

          <p className="leading-relaxed">
            Above all, we believe the best software feels invisible—it melts into your daily rhythm so you can focus on creating content, not clicking buttons.
          </p>

          <p className="leading-relaxed">
            If that vision resonates, stay close. We'll be sharing progress openly and shipping fast. Together we can build the tool our industry has been waiting for.
          </p>

          <p className="leading-relaxed mt-8">
            Thanks for reading, and for giving Post a try. You can always contact me directly if you have any questions at{" "}
            <a href="mailto:support@trypost.ai" className="text-primary hover:underline">
              support@trypost.ai
            </a>
            . I look forward to hearing from you.
          </p>

          <div className="mt-8">
            <img 
              src={alexMacgregor} 
              alt="Alex MacGregor" 
              className="w-32 h-32 mb-4"
            />
            <p className="text-lg font-medium">— Alex MacGregor</p>
            <p className="text-muted-foreground">Founder, Post</p>
            <a 
              href="https://www.linkedin.com/in/alexmacgregor2/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-block mt-2"
            >
              Connect with me on LinkedIn
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
