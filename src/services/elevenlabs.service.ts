import axios, { AxiosInstance, AxiosError } from 'axios';
import { config } from '../config/env';
import {
  SubmitBatchCallRequest,
  BatchCallResponse,
  BatchCallDetailResponse,
  ElevenLabsError,
} from '../types/elevenlabs.types';

export class ElevenLabsService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.elevenlabs.baseUrl,
      headers: {
        'xi-api-key': config.elevenlabs.apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 segundos
    });
  }

  /**
   * Dispara un batch de llamadas
   * @param data Datos para crear el batch de llamadas
   * @returns Información del batch creado
   */
  async submitBatchCall(data: SubmitBatchCallRequest): Promise<BatchCallResponse> {
    try {
      // Log del request que se envía a ElevenLabs
      console.log('📤 Enviando a ElevenLabs:', JSON.stringify(data, null, 2));
      
      const response = await this.client.post<BatchCallResponse>(
        '/v1/convai/batch-calling/submit',
        data
      );
      
      // Log de la respuesta de ElevenLabs
      console.log('📥 Respuesta de ElevenLabs:', JSON.stringify(response.data, null, 2));
      
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Error al disparar batch de llamadas');
    }
  }

  /**
   * Cancela un batch de llamadas
   * @param batchId ID del batch a cancelar
   * @returns Información del batch cancelado
   */
  async cancelBatchCall(batchId: string): Promise<BatchCallResponse> {
    try {
      console.log(`📤 Intentando cancelar batch: ${batchId}`);
      
      const response = await this.client.post<BatchCallResponse>(
        `/v1/convai/batch-calling/${batchId}/cancel`
      );
      
      console.log(`📥 Batch cancelado exitosamente:`, response.data);
      return response.data;
    } catch (error) {
      // Log detallado del error antes de manejarlo
      if (axios.isAxiosError(error)) {
        console.error(`❌ Error al cancelar batch ${batchId}:`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
        });
      }
      
      throw this.handleError(error, 'Error al cancelar batch de llamadas');
    }
  }

  /**
   * Obtiene información detallada de un batch de llamadas
   * @param batchId ID del batch a consultar
   * @returns Información detallada del batch incluyendo todos los recipients
   */
  async getBatchCallInfo(batchId: string): Promise<BatchCallDetailResponse> {
    try {
      const response = await this.client.get<BatchCallDetailResponse>(
        `/v1/convai/batch-calling/${batchId}`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Error al obtener información del batch');
    }
  }

  /**
   * Maneja errores de las llamadas a la API
   */
  private handleError(error: unknown, defaultMessage: string): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ElevenLabsError>;
      const status = axiosError.response?.status;
      const errorData = axiosError.response?.data;
      
      // Intentar obtener el mensaje de error de diferentes formas
      let message = defaultMessage;
      
      if (errorData) {
        if (typeof errorData === 'string') {
          message = errorData;
        } else if (errorData.detail) {
          message = errorData.detail;
        } else if (errorData.message) {
          message = errorData.message;
        } else {
          // Si errorData es un objeto, intentar convertirlo a JSON
          try {
            message = JSON.stringify(errorData);
          } catch {
            message = 'Error desconocido de ElevenLabs';
          }
        }
      }
      
      // Log detallado para debugging
      console.error('Error de ElevenLabs:', {
        status,
        message,
        fullError: errorData,
        url: axiosError.config?.url,
      });
      
      const fullMessage = `${defaultMessage}: ${message} (Status: ${status || 'unknown'})`;
      
      return new Error(fullMessage);
    }
    
    if (error instanceof Error) {
      console.error('Error genérico:', error.message);
      return new Error(`${defaultMessage}: ${error.message}`);
    }
    
    console.error('Error desconocido:', error);
    return new Error(defaultMessage);
  }
}

