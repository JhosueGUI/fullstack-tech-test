// frontend/src/app/models/client.model.ts

// Tipo para la petición (datos que se envían al backend)
export interface ClientRegisterRequest {
  token: string;
  document_type: 'DNI' | 'Carnet de extranjería'; 
  document_number: string;
  names: string;
  last_names: string;
  birth_date: string; // Formato ISO: YYYY-MM-DD
  phone_number?: string; // Opcional
}

// Tipo para la respuesta exitosa del backend
export interface ClientRegisterResponse {
  statusCode: 201;
  message: string;
  clientId: number;
  emailSent: boolean;
}

// Tipo para la respuesta de error de validación de Hapi (400)
export interface ValidationErrorResponse {
  statusCode: 400;
  message: string;
  details: any[]; 
}