import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { resources } from "@/data/resources";
import { ArrowRight } from "lucide-react";

const Resources = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header showSignup />
      <main className="max-w-5xl mx-auto px-6 py-16 w-full flex-1">
        <h1 className="font-reckless text-4xl md:text-5xl font-medium mb-4">Resources</h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl">
          Guides, frameworks and playbooks for posting and scheduling on social media.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {resources.map((r) => (
            <Link
              key={r.slug}
              to={`/resources/${r.slug}`}
              className="group bg-card p-6 rounded-2xl border-2 border-border hover:border-primary transition-colors"
            >
              <div className="text-xs font-medium text-primary mb-2 uppercase tracking-wide">
                {r.category} · {r.readTime}
              </div>
              <h2 className="font-reckless text-2xl font-medium mb-2 group-hover:text-primary transition-colors">
                {r.title}
              </h2>
              <p className="text-muted-foreground mb-4">{r.excerpt}</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                Read article <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Resources;
