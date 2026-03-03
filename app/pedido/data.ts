import {ConeIcon, ContainerIcon, CupIcon} from './icons';

/**
 * Mapea productos de la DB a sus respectivos iconos
 * basándose en el nombre del producto
 */
export function getIconForPresentation(nombre: string) {
    const nombreLower = nombre.toLowerCase();

    if (nombreLower.includes('cono')) {
        return ConeIcon;
    }
    if (nombreLower.includes('vaso') || nombreLower.includes('copa')) {
        return CupIcon;
    }
    // Por defecto usa ContainerIcon para presentaciones en peso (kg)
    return ContainerIcon;
}
