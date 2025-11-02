'use client';

import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

import { openApiSpec } from '@/lib/openapi';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SwaggerUI spec={openApiSpec} />
    </div>
  );
}
