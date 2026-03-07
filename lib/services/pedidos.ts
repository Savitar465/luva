import {Database} from "@/lib/supabase/types";
import {supabase} from "@/lib/supabase/client";

type Pedido = Database['public']['Tables']['pedidos']['Row'];
export async function getPedidos() {
    const {data, error} = await supabase.from('pedidos').select('*');

    if (error) {
        console.error(`Error fetching pedidos`, error);
        throw error;
    }
    return data as Pedido[];
}

export async function createPedido(
    pedido: Database['public']['Tables']['pedidos']['Insert']
){
    const {data, error} = await supabase.from('pedidos')
        .insert(pedido)
        .select().single();
    if (error) {
        console.error(`Error creating pedido`, error);
        throw error;
    }
    return data as Pedido;
}