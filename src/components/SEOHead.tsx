import React from 'react';

interface SEOHeadProps {
  structuredData?: object;
  additionalMeta?: React.ReactNode;
}

export default function SEOHead({ structuredData, additionalMeta }: SEOHeadProps) {
  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
      {additionalMeta}
    </>
  );
}

interface StructuredDataProps {
  data: object;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}
