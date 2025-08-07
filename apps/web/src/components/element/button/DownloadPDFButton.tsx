"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface DownloadPDFButtonProps {
  title: string;
  author: {
    firstName: string;
    lastName: string;
    username: string;
  };
  createdAt: string;
  url?: string;
}

export const DownloadPDFButton = ({
  title,
  author,
  createdAt,
  url
}: DownloadPDFButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generatePDF = async () => {
    try {
      setIsGenerating(true);

      // Get content from the DOM
      const articleBody = document.querySelector('.articleBody');
      if (!articleBody) {
        toast({
          title: "PDF generation failed",
          description: "Article content not found.",
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }
      const content = articleBody.innerHTML;

      const formattedDate = new Date(createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const printJsContent = `
        <div style="max-width: 800px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333;">
          <div style="text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #e5e5e5;">
            <h1 style="font-size: 2.5em; margin-bottom: 10px; color: #1a1a1a;">${title}</h1>
            <div style="color: #666; font-size: 1.1em;">
              <p style="margin: 5px 0;"><strong>Author:</strong> ${author.firstName} ${author.lastName} (@${author.username})</p>
              <p style="margin: 5px 0;"><strong>Published:</strong> ${formattedDate}</p>
              ${url ? `<p style=\"margin: 5px 0;\"><strong>Source:</strong> ${url}</p>` : ''}
            </div>
          </div>
          
          <div style="font-size: 1.1em; line-height: 1.8; margin-bottom: 40px;">
            ${content}
          </div>
          
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e5e5; color: #888; font-size: 0.9em;">
            <p>Generated from Infobite - https://infobite.online</p>
          </div>
        </div>
      `;

      const fullHtmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset=\"utf-8\">
          <title>${title} - Infobite</title>
          <style>
            @page { margin: 1in; }
            body { 
              margin: 0; 
              padding: 20px; 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              line-height: 1.6; 
              color: #333;
              font-size: 14px;
            }
            h1, h2, h3, h4, h5, h6 { page-break-after: avoid; }
            img { max-width: 100%; height: auto; }
            pre, code { 
              background: #f5f5f5; 
              padding: 10px; 
              border-radius: 4px; 
              font-family: 'Courier New', monospace; 
            }
            blockquote { 
              border-left: 4px solid #ddd;
              margin: 20px 0; 
              padding: 10px 20px; 
              background: #f9f9f9;
            }
            a { color: #0066cc; text-decoration: underline; }
            table { border-collapse: collapse; width: 100%; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          ${printJsContent}
        </body>
        </html>
      `;

      if (typeof window !== 'undefined') {
        fallbackPrint(fullHtmlContent);
      }

    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toast({
        title: "PDF generation failed",
        description: "Unable to generate PDF. Please try again.",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  const fallbackPrint = (htmlContent: string) => {
    try {
      // Create a hidden iframe for printing instead of opening a new window
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.top = '-10000px';
      iframe.style.left = '-10000px';
      iframe.style.width = '1px';
      iframe.style.height = '1px';
      iframe.style.visibility = 'hidden';

      document.body.appendChild(iframe);

      // Cleanup function to safely remove iframe
      const cleanupIframe = () => {
        try {
          if (iframe && iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
          }
        } catch (e) {
          console.log('Iframe cleanup: already removed');
        }
        setIsGenerating(false);
      };

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();

        // Copy stylesheets and style tags from the main document into the iframe
        const mainHead = document.head;
        const iframeHead = iframeDoc.head;
        // Copy <link rel="stylesheet"> tags
        mainHead.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
          try {
            iframeHead.appendChild(link.cloneNode(true));
          } catch {}
        });
        // Copy <style> tags
        mainHead.querySelectorAll('style').forEach(style => {
          try {
            iframeHead.appendChild(style.cloneNode(true));
          } catch {}
        });

        // Wait for content to load, then print
        iframe.onload = () => {
          setTimeout(() => {
            try {
              iframe.contentWindow?.print();

              // Clean up after printing with delay
              setTimeout(cleanupIframe, 1000);
            } catch (printError) {
              console.error('Print error:', printError);
              cleanupIframe();
            }
          }, 100);
        };

        // Fallback cleanup if onload doesn't fire
        setTimeout(cleanupIframe, 5000);

        toast({
          title: "PDF ready!",
          description: "Print dialog opened. You can save as PDF from there.",
        });
      } else {
        cleanupIframe();
        throw new Error('Unable to create print document');
      }
    } catch (fallbackError) {
      console.error('Print failed:', fallbackError);
      toast({
        title: "PDF generation failed",
        description: "Please try using your browser's print function (Ctrl+P) on this page.",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={generatePDF}
      disabled={isGenerating}
      className="flex items-center gap-2 hover:bg-accent transition-colors"
      title="Download as PDF"
    >
      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div
            key="generating"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <FileText className="h-4 w-4 animate-pulse" />
          </motion.div>
        ) : (
          <motion.div
            key="download"
            initial={{ scale: 0, rotate: 90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -90 }}
            transition={{ duration: 0.2 }}
          >
            <Download className="h-4 w-4" />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="text-sm">
        {isGenerating ? "Generating..." : "PDF"}
      </span>
    </Button>
  );
};
