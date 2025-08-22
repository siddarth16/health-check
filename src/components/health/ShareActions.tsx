"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Printer, Check } from "lucide-react";

export function ShareActions() {
  const [copied, setCopied] = useState(false);

  const handleCopyURL = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex gap-2 print:hidden">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyURL}
        className="flex items-center gap-2"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copy URL
          </>
        )}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrint}
        className="flex items-center gap-2"
      >
        <Printer className="h-4 w-4" />
        Print
      </Button>
    </div>
  );
}