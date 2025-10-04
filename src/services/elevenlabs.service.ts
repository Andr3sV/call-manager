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
      const response = await this.client.post<BatchCallResponse>(
        `/v1/convai/batch-calling/${batchId}/cancel`
      );
      return response.data;
    } catch (error) {
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
      
      const message = errorData?.detail || errorData?.message || defaultMessage;
      const fullMessage = `${defaultMessage}: ${message} (Status: ${status || 'unknown'})`;
      
      return new Error(fullMessage);
    }
    
    if (error instanceof Error) {
      return new Error(`${defaultMessage}: ${error.message}`);
    }
    
    return new Error(defaultMessage);
  }
}

