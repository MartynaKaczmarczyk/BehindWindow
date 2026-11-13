export interface RouteStop {
  name: string;
  latitude: number;
  longitude: number;
}

export const SIMULATION_ROUTE: readonly RouteStop[] = [
  { name: 'Gdańsk Główny', latitude: 54.3520, longitude: 18.6466 },
  { name: 'Pruszcz Gdański', latitude: 54.2602, longitude: 18.6368 },
  { name: 'Tczew', latitude: 54.0924, longitude: 18.7778 },
  { name: 'Malbork', latitude: 54.0359, longitude: 19.0266 },
  { name: 'Iława Główna', latitude: 53.7570, longitude: 19.5731 }
];