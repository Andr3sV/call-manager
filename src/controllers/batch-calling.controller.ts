import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ElevenLabsService } from '../services/elevenlabs.service';
import { SubmitBatchCallRequest } from '../types/elevenlabs.types';

const elevenLabsService = new ElevenLabsService();

/**
 * Controlador para disparar un batch de llamadas
 */
export const submitBatchCall = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
      return;
    }

    let data: SubmitBatchCallRequest = req.body;

    // Si include_dynamic_variables es false, eliminar todas las dynamic_variables
    if (req.body.include_dynamic_variables === false) {
      data = {
        ...data,
        recipients: data.recipients.map(recipient => ({
          phone_number: recipient.phone_number,
          id: recipient.id,
          // Omitir conversation_initiation_client_data con dynamic_variables
        })),
      };
    }

    // Llamar al servicio de ElevenLabs
    const result = await elevenLabsService.submitBatchCall(data);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error en submitBatchCall:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
};

/**
 * Controlador para cancelar un batch de llamadas
 */
export const cancelBatchCall = async (req: Request, res: Response): Promise<void> => {
  try {
    const { batchId } = req.params;

    if (!batchId) {
      res.status(400).json({
        success: false,
        error: 'El parámetro batchId es requerido',
      });
      return;
    }

    console.log(`🔄 Solicitud de cancelación para batch: ${batchId}`);

    // Llamar al servicio de ElevenLabs
    const result = await elevenLabsService.cancelBatchCall(batchId);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Batch cancelado exitosamente',
    });
  } catch (error) {
    console.error('❌ Error en cancelBatchCall:', error);
    
    // Determinar el código de estado apropiado
    let statusCode = 500;
    let errorMessage = 'Error desconocido';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Si el error menciona un status 400 o 404, usar códigos más apropiados
      if (errorMessage.includes('Status: 400')) {
        statusCode = 400;
      } else if (errorMessage.includes('Status: 404')) {
        statusCode = 404;
      }
    }
    
    res.status(statusCode).json({
      success: false,
      error: errorMessage,
    });
  }
};

/**
 * Controlador para obtener información de un batch de llamadas
 */
export const getBatchCallInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { batchId } = req.params;

    if (!batchId) {
      res.status(400).json({
        success: false,
        error: 'El parámetro batchId es requerido',
      });
      return;
    }

    // Llamar al servicio de ElevenLabs
    const result = await elevenLabsService.getBatchCallInfo(batchId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error en getBatchCallInfo:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
};

