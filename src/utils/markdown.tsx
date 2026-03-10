import React from 'react';

/**
 * Simple markdown parser for basic formatting
 * Currently supports: 
 * - **bold** and *bold* text (treating both as bold for consistency)
 * - URLs (both with and without protocol) with smart display text
 * - Email addresses with mailto: links
 */

/**
 * Gets shortened URL display text that still feels like a URL
 */
function getUrlDisplayText(url: string): string {
  try {
    // Handle URLs without protocol
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    const urlObj = new URL(fullUrl);
    const domain = urlObj.hostname.replace('www.', '');
    
    // Show domain + some path for context, but keep it reasonable
    let displayText = domain;
    
    if (urlObj.pathname && urlObj.pathname !== '/') {
      // Add some path context but keep total length manageable
      const pathPart = urlObj.pathname.substring(0, 25); // Limit path length
      displayText = `${domain}${pathPart}`;
    }
    
    // Truncate if still too long and add ellipsis
    if (displayText.length > 35) {
      return `${displayText.substring(0, 35)}...`;
    }
    
    return `${displayText}...`;
  } catch (error) {
    // Fallback: truncate to a reasonable length
    if (url.length > 35) {
      return `${url.substring(0, 35)}...`;
    }
    return url;
  }
}
export function parseMarkdown(text: string, messageRole?: 'user' | 'assistant'): React.ReactNode {
  if (!text) return text;

  // Email pattern - must be checked before URL pattern to prevent partial matching
  const emailPattern = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g;
  
  // Enhanced URL regex pattern that matches various URL formats
  // Important: Exclude closing parenthesis from URL to preserve markdown-style link syntax
  // Also exclude @ to prevent matching email domains
  const urlPattern = /(\bhttps?:\/\/[^\s<>"{}|\\^`[\]()@]+|\bwww\.[^\s<>"{}|\\^`[\]()@]+|(?<![a-zA-Z0-9@])\b[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.(?:[a-zA-Z]{2,}|xn--[a-zA-Z0-9]+)(?:\/[^\s<>"{}|\\^`[\]()@]*)?)/gi;
  
  // First, split by emails to identify email and non-email parts
  const emailParts = text.split(emailPattern);
  const emails: string[] = [];
  let match;
  const emailRegex = new RegExp(emailPattern);
  while ((match = emailRegex.exec(text)) !== null) {
    emails.push(match[0]);
  }
  
  let emailIndex = 0;
  
  return emailParts.map((emailPart, emailPartIndex) => {
    // Check if there's an email between this part and the next
    const hasEmailAfter = emailPartIndex < emailParts.length - 1;
    
    // Process the non-email part for URLs and bold
    const processedPart = (() => {
      // Split by URLs to identify URL and non-URL parts
      const urlParts = emailPart.split(urlPattern);
      
      return urlParts.map((part, partIndex) => {
        // Check if this part is a URL
        if (part.match(urlPattern)) {
          // Clean trailing punctuation from URL
          const cleanedUrl = part.replace(/[.,;!?]+$/, '');
          // Ensure URL has protocol for href
          const href = cleanedUrl.startsWith('http') ? cleanedUrl : `https://${cleanedUrl}`;
          
          // Different colors based on message role
          const urlColor = messageRole === 'user' ? '#fff' : '#1e40af'; // White for user, blue for AI
          
          return (
            <a
              key={`${emailPartIndex}-url-${partIndex}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline break-words hover:opacity-80 transition-opacity"
              style={{ color: urlColor }}
              title={href} // Show full URL on hover
            >
              {getUrlDisplayText(cleanedUrl)}
            </a>
          );
        }
        
        // For non-URL parts, handle bold formatting
        const boldParts = part.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
        
        return boldParts.map((boldPart, boldIndex) => {
          // Check if this part is bold formatting (double or single asterisks)
          if (boldPart.match(/^\*\*[^*]+\*\*$/) || boldPart.match(/^\*[^*]+\*$/)) {
            // Remove the * or ** and make it bold
            const boldText = boldPart.replace(/^\*{1,2}|\*{1,2}$/g, '');
            return <strong key={`${emailPartIndex}-${partIndex}-${boldIndex}`}>{boldText}</strong>;
          }
          
          // Return regular text
          return boldPart || null;
        });
      });
    })();
    
    // Add email link if there's one after this part
    if (hasEmailAfter && emails[emailIndex]) {
      const email = emails[emailIndex];
      emailIndex++;
      
      // Different colors based on message role
      const emailColor = messageRole === 'user' ? '#fff' : '#1e40af'; // White for user, blue for AI
      
      return (
        <React.Fragment key={emailPartIndex}>
          {processedPart}
          <a
            href={`mailto:${email}`}
            className="underline break-words hover:opacity-80 transition-opacity"
            style={{ color: emailColor }}
            title={`Send email to ${email}`}
          >
            {email}
          </a>
        </React.Fragment>
      );
    }
    
    return <React.Fragment key={emailPartIndex}>{processedPart}</React.Fragment>;
  });
}