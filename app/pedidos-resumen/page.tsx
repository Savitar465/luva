import { redirect } from 'next/navigation';
import { PedidoResumenScreen } from '@/features/pedidos-resumen/components/PedidoResumenScreen';

interface PedidosResumenPageProps {
  searchParams?: Promise<{
    vendor?: string;
  }>;
}

export default async function PedidosResumenPage({ searchParams }: Readonly<PedidosResumenPageProps>) {
  const resolvedSearchParams = await searchParams;
  const vendorPin = resolvedSearchParams?.vendor?.trim().toUpperCase();

  if (!vendorPin) {
    redirect('/pedidos-resumen/seleccionar');
  }

  return <PedidoResumenScreen vendorPin={vendorPin} />;
}
