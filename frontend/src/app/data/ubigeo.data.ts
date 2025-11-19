// ubigeo.data.ts (Archivo simulado de datos)

export interface UbigeoItem {
  code: string;
  name: string;
  children?: UbigeoItem[]; // Para Provincias y Distritos
}

export const UBIGEO_PERU: UbigeoItem[] = [
  // ... Otros Departamentos (01-14, 16-25) ...
  {
    code: '15',
    name: 'Lima',
    children: [
      {
        code: '1501',
        name: 'Lima', // Provincia de Lima
        children: [
          { code: '150101', name: 'Lima' }, // Distrito de Lima (Cercado)
          { code: '150102', name: 'Ancón' },
          { code: '150103', name: 'Ate' },
          { code: '150104', name: 'Barranco' },
          { code: '150105', name: 'Breña' },
          // ... 150106 a 150143 (Otros distritos de Lima Metropolitana) ...
          { code: '150143', name: 'Villa María del Triunfo' },
        ]
      },
      {
        code: '1502',
        name: 'Barranca', // Provincia de Barranca
        children: [
          { code: '150201', name: 'Barranca' },
          { code: '150202', name: 'Paramonga' },
          { code: '150203', name: 'Pativilca' },
          // ...
        ]
      },
      // ... Otras Provincias (1503 a 1510) ...
    ]
  },
  // ... Otros Departamentos ...
];