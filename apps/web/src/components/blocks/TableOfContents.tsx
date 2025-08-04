"use client";

import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronDown, List, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

interface HeadingItem {
  id: string;
  text: string;
  level: number;
  element: HTMLElement;
}

interface TableOfContentsProps {
  contentSelector?: string;
  headingSelector?: string;
}

export function TableOfContents({ 
  contentSelector = '[itemprop="articleBody"]',
  headingSelector = 'h1, h2, h3, h4, h5, h6'
}: TableOfContentsProps) {
  const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed by default
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeHeading, setActiveHeading] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const tocRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const generateTableOfContents = () => {
      // Wait for content to be fully rendered
      setTimeout(() => {
        const contentElement = document.querySelector(contentSelector);
        console.log('🔍 Content element found:', contentElement);
        
        if (!contentElement) {
          console.log('❌ No content element found with selector:', contentSelector);
          setIsLoading(false);
          return;
        }
        
        const headingElements = contentElement.querySelectorAll(headingSelector);
        console.log('📝 Headings found:', headingElements.length, Array.from(headingElements));
        
        if (!headingElements || headingElements.length === 0) {
          console.log('❌ No headings found');
          setIsLoading(false);
          return;
        }

        const headingItems: HeadingItem[] = [];
        const usedIds = new Set<string>();
        
        headingElements.forEach((heading, index) => {
          const element = heading as HTMLElement;
          
          // Get the unique ID from data-id attribute (from UniqueID extension)
          let headingId = element.getAttribute('data-id');
          
          // Fallback: If no data-id, use existing logic for backward compatibility
          if (!headingId) {
            if (!element.id) {
              const text = element.textContent || '';
              let baseId = text.toLowerCase()
                .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
                .replace(/\s+/g, '-') // Replace spaces with hyphens
                .replace(/--+/g, '-') // Replace multiple hyphens with single
                .trim();
              
              // Handle empty or invalid base ID
              if (!baseId) {
                baseId = `heading-${index}`;
              }
              
              // Handle duplicate IDs by adding a counter
              let finalId = baseId;
              let counter = 1;
              while (usedIds.has(finalId) || document.getElementById(finalId)) {
                finalId = `${baseId}-${counter}`;
                counter++;
              }
              
              element.id = finalId;
              headingId = finalId;
            } else {
              headingId = element.id;
            }
          }
          
          // Ensure we have a unique ID
          if (headingId && !usedIds.has(headingId)) {
            usedIds.add(headingId);
            
            const level = parseInt(element.tagName.charAt(1));
            
            headingItems.push({
              id: headingId,
              text: element.textContent || '',
              level: level,
              element: element
            });
          }
        });

        console.log('✅ Processed headings:', headingItems);
        setHeadings(headingItems);
        setIsLoading(false);
        
        // Handle initial hash in URL
        handleInitialHash();
      }, 1000);
    };

    const handleInitialHash = () => {
      const hash = window.location.hash.substring(1); // Remove the # symbol
      if (hash) {
        console.log('🔗 Initial hash found:', hash);
        // Small delay to ensure content is rendered
        setTimeout(() => {
          scrollToHeading(hash);
        }, 500);
      }
    };

    generateTableOfContents();
  }, [contentSelector, headingSelector]);

  // Handle scroll to update active heading
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Offset for header
      
      let currentActiveHeading = '';
      
      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        // Try to find element by data-id first, then by id
        let element = document.querySelector(`[data-id="${heading.id}"]`) as HTMLElement;
        if (!element) {
          element = document.getElementById(heading.id) as HTMLElement;
        }
        
        if (element && element.offsetTop <= scrollPosition) {
          currentActiveHeading = heading.id;
          break;
        }
      }
      
      setActiveHeading(currentActiveHeading);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  // Handle browser back/forward navigation with hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        console.log('🔗 Hash changed:', hash);
        scrollToHeading(hash);
      }
    };

    // Listen for hash changes (browser back/forward)
    window.addEventListener('hashchange', handleHashChange);
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle outside click to close TOC
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Check if click is outside both desktop and mobile TOC
      const isOutsideDesktop = tocRef.current && !tocRef.current.contains(target);
      const isOutsideMobile = mobileRef.current && !mobileRef.current.contains(target);
      
      // Only close if TOC is expanded and click is outside
      if (!isCollapsed && isOutsideDesktop && isOutsideMobile) {
        setIsCollapsed(true);
      }
    };

    // Only add listener if TOC is expanded
    if (!isCollapsed) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCollapsed]);

  const scrollToHeading = (headingId: string) => {
    // Try to find element by data-id first, then by id
    let element = document.querySelector(`[data-id="${headingId}"]`) as HTMLElement;
    if (!element) {
      element = document.getElementById(headingId) as HTMLElement;
    }
    
    if (element) {
      const offset = 80; // Account for fixed header
      const elementPosition = element.offsetTop - offset;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
      
      // Set active heading to highlight in TOC
      setActiveHeading(headingId);
    }
  };

  const handleHeadingClick = (headingId: string) => {
    // Update URL hash
    window.history.pushState(null, '', `#${headingId}`);
    
    // Scroll to the heading
    scrollToHeading(headingId);
  };

  return (
    <>
      {/* Desktop floating TOC */}
      <motion.div
        ref={tocRef}
        animate={{ 
          width: isCollapsed ? 48 : 256
        }}
        transition={{ 
          duration: 0.4, 
          ease: [0.4, 0.0, 0.2, 1]
        }}
        className="hidden xl:block absolute top-0 z-50"
      >
        <Card className="p-2 overflow-hidden h-fit shadow-lg">
          <AnimatePresence mode="wait">
            {isCollapsed ? (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex justify-center"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => !isLoading && setIsCollapsed(!isCollapsed)}
                  disabled={isLoading}
                  className={`h-8 w-8 p-0 ${isLoading ? 'cursor-not-allowed' : 'hover:bg-primary/10'}`}
                  title={isLoading ? "Loading Table of Contents..." : "Expand Table of Contents"}
                >
                  <motion.div
                    animate={isLoading ? { rotate: 360 } : {}}
                    transition={isLoading ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
                    whileHover={!isLoading ? { scale: 1.1 } : {}}
                    whileTap={!isLoading ? { scale: 0.95 } : {}}
                    className={isLoading ? "text-muted-foreground" : ""}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </motion.div>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, scale: 0.95, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="min-w-[250px]"
              >
                <motion.div 
                  className="flex items-center justify-between mb-3 mx-3"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.2 }}
                >
                  <h3 className="font-semibold text-sm flex items-center gap-2 truncate">
                    <List className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Table of Contents</span>
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="h-6 w-6 p-0 hover:bg-primary/10 flex-shrink-0"
                    title="Collapse Table of Contents"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 180 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <ChevronDown className="h-3 w-3 rotate-90" />
                    </motion.div>
                  </Button>
                </motion.div>
                
                <motion.nav 
                  className="space-y-1 max-h-[70vh] overflow-hidden"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.25 }}
                >
                  <PerfectScrollbar
                    options={{
                      wheelSpeed: 0.5,
                      wheelPropagation: false,
                      suppressScrollX: true,
                      minScrollbarLength: 20,
                    }}
                    style={{ maxHeight: '70vh' }}
                  >
                    <div className="space-y-1 pr-2">
                      {headings.map((heading, index) => (
                        <motion.button
                          key={heading.id}
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ 
                            delay: 0.2 + index * 0.03,
                            duration: 0.2,
                            ease: "easeOut"
                          }}
                          whileHover={{ 
                            x: 4,
                            scale: 1.02,
                            transition: { duration: 0.2 }
                          }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleHeadingClick(heading.id)}
                          className={`
                            block w-full text-left px-2 py-1.5 rounded text-xs transition-colors duration-200
                            ${activeHeading === heading.id 
                              ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }
                          `}
                          style={{ 
                            paddingLeft: `${(heading.level - 1) * 10 + 8}px`,
                            marginLeft: heading.level > 1 ? '6px' : '0'
                          }}
                          title={heading.text}
                        >
                          <span className="truncate block">{heading.text}</span>
                        </motion.button>
                      ))}
                    </div>
                  </PerfectScrollbar>
                </motion.nav>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Mobile/Tablet TOC */}
      <div ref={mobileRef} className="xl:hidden mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <List className="h-4 w-4" />
              Table of Contents
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-6 w-6 p-0 hover:bg-primary/10"
              title={isCollapsed ? "Expand Table of Contents" : "Collapse Table of Contents"}
            >
              <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`} />
            </Button>
          </div>
          
          <AnimatePresence>
            {!isCollapsed && (
              <motion.nav
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <PerfectScrollbar
                  options={{
                    wheelSpeed: 0.5,
                    wheelPropagation: false,
                    suppressScrollX: true,
                    minScrollbarLength: 20,
                  }}
                  style={{ maxHeight: '50vh' }}
                >
                  <div className="space-y-2 pt-2 pr-2">
                    {headings.map((heading) => (
                      <button
                        key={heading.id}
                        onClick={() => handleHeadingClick(heading.id)}
                        className={`
                          block w-full text-left px-3 py-2 rounded text-sm transition-colors duration-200
                          ${activeHeading === heading.id 
                            ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary' 
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                          }
                        `}
                        style={{ 
                          paddingLeft: `${(heading.level - 1) * 12 + 12}px`
                        }}
                      >
                        {heading.text}
                      </button>
                    ))}
                  </div>
                </PerfectScrollbar>
              </motion.nav>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </>
  );
}
