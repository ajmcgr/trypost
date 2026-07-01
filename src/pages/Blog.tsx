import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { blogPosts } from "@/data/blog";
import { ArrowRight } from "lucide-react";

const Blog = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header showSignup />
      <main className="max-w-5xl mx-auto px-6 py-16 w-full flex-1">
        <h1 className="font-reckless text-4xl md:text-5xl font-medium mb-4">Blog</h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl">
          Notes on social media scheduling, cross-posting and content operations.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {blogPosts.map((p) => (
            <Link
              key={p.slug}
              to={`/blog/${p.slug}`}
              className="group bg-card p-6 rounded-2xl border-2 border-border hover:border-primary transition-colors"
            >
              <div className="text-xs font-medium text-primary mb-2 uppercase tracking-wide">
                {p.category} · {p.readTime} · {p.date}
              </div>
              <h2 className="font-reckless text-2xl font-medium mb-2 group-hover:text-primary transition-colors">
                {p.title}
              </h2>
              <p className="text-muted-foreground mb-4">{p.excerpt}</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                Read post <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
