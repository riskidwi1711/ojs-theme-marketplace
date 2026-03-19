import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function DocsPage() {
  const sections = [
    { title: "Getting Started", items: ["Installation Guide", "System Requirements", "Quick Start"] },
    { title: "Customization", items: ["Changing Colors", "Logo Upload", "Menu Configuration", "Footer Settings"] },
    { title: "Advanced", items: ["Child Themes", "Template Overrides", "API Integration"] },
    { title: "Support", items: ["Troubleshooting", "FAQs", "Contact Support"] },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container-page py-16">
        <h1 className="text-4xl font-bold mb-4 text-[#1a1a2e]">Documentation</h1>
        <p className="text-gray-600 mb-12 max-w-2xl">Everything you need to know about setting up and customizing your OJS themes and plugins.</p>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="font-bold text-lg mb-4 text-[#1a1a2e]">{section.title}</h2>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-600 hover:text-[var(--color-primary)] transition-colors text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
