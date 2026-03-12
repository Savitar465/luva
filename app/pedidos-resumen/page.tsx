import { Suspense } from 'react';
import {PedidoResumenScreen} from "@/features/pedidos-resumen/components/PedidoResumenScreen";


export default function PedidosResumenPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-500">Cargando pantalla cliente...</div>}>
      <PedidoResumenScreen />
    </Suspense>
  );
}
