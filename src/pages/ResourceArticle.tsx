import { Link, useParams, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { resources } from "@/data/resources";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const ResourceArticle = () => {
  const { slug } = useParams();
  const article = resources.find((r) => r.slug === slug);

  if (!article) return <Navigate to="/resources" replace />;

  const paragraphs = article.content.trim().split("\n");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header showSignup />
      <main className="max-w-3xl mx-auto px-6 py-16 w-full flex-1">
        <Link to="/resources" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" /> All resources
        </Link>

        <div className="text-xs font-medium text-primary mb-3 uppercase tracking-wide">
          {article.category} · {article.readTime}
        </div>
        <h1 className="font-reckless text-4xl md:text-5xl font-medium mb-6">{article.title}</h1>
        <p className="text-xl text-muted-foreground mb-10">{article.excerpt}</p>

        <article className="prose prose-lg max-w-none">
          {paragraphs.map((line, i) => {
            const trimmed = line.trim();
            if (!trimmed) return null;
            if (trimmed.startsWith("## ")) {
              return <h2 key={i} className="font-reckless text-2xl font-medium mt-10 mb-4">{trimmed.slice(3)}</h2>;
            }
            if (trimmed.startsWith("- ")) {
              return <li key={i} className="ml-6 list-disc text-foreground/90 mb-1">{renderInline(trimmed.slice(2))}</li>;
            }
            if (/^\d+\.\s/.test(trimmed)) {
              return <li key={i} className="ml-6 list-decimal text-foreground/90 mb-1">{renderInline(trimmed.replace(/^\d+\.\s/, ""))}</li>;
            }
            return <p key={i} className="text-foreground/90 leading-relaxed mb-4">{renderInline(trimmed)}</p>;
          })}
        </article>

        <div className="mt-16 p-8 bg-card border-2 border-border rounded-3xl text-center">
          <p className="text-lg mb-4">Ready to put this into practice?</p>
          <Link to="/signup">
            <Button size="lg">Try Post Free</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

function renderInline(text: string) {
  // Render **bold** segments
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>
  );
}

export default ResourceArticle;
