// exporta la interfaz UbigeoItem que representa un ítem del UBIGEO
export interface UbigeoItem {
    code: string;
    name: string;
    children?: UbigeoItem[]; 
}