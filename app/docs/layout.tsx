import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ski-Lifts Widget Documentation",
  description: "Complete documentation for integrating the Ski-Lifts chat widget into your website.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div 
      style={{ 
        backgroundColor: '#000000', 
        color: '#ffffff', 
        minHeight: '100vh',
        animation: 'fadeIn 0.5s ease-in'
      }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `
      }} />
      {children}
    </div>
  );
} 