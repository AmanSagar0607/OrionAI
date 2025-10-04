import { ReactNode } from 'react';
import PublicLayout from '@/components/layout/public-layout';

export default function PublicPagesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <PublicLayout>{children}</PublicLayout>;
}
