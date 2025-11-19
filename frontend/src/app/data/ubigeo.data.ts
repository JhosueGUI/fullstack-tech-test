
//Exportación de datos de ubigeo para Perú
export interface UbigeoItem {
  code: string;
  name: string;
  children?: UbigeoItem[];
}

export const UBIGEO_PERU: UbigeoItem[] = [
  {
    code: '15',
    name: 'Lima',
    children: [
      {
        code: '1501',
        name: 'Lima',
        children: [
          { code: '150101', name: 'Lima' },
          { code: '150102', name: 'Ancón' },
          { code: '150103', name: 'Ate' },
          { code: '150104', name: 'Barranco' },
          { code: '150105', name: 'Breña' },
          { code: '150143', name: 'Villa María del Triunfo' },
        ]
      },
      {
        code: '1502',
        name: 'Barranca',
        children: [
          { code: '150201', name: 'Barranca' },
          { code: '150202', name: 'Paramonga' },
          { code: '150203', name: 'Pativilca' },
          // ...
        ]
      },
    ]
  },
];