import { Router } from 'express';
import { body } from 'express-validator';
import {
  submitBatchCall,
  cancelBatchCall,
  getBatchCallInfo,
} from '../controllers/batch-calling.controller';

const router = Router();

/**
 * POST /api/batch-calling/submit
 * Dispara un batch de llamadas
 */
router.post(
  '/submit',
  [
    body('call_name').isString().notEmpty().withMessage('call_name es requerido'),
    body('agent_id').isString().notEmpty().withMessage('agent_id es requerido'),
    body('agent_phone_number_id')
      .isString()
      .notEmpty()
      .withMessage('agent_phone_number_id es requerido'),
    body('recipients').isArray({ min: 1 }).withMessage('recipients debe ser un array con al menos un elemento'),
    body('recipients.*.phone_number')
      .isString()
      .notEmpty()
      .withMessage('Cada recipient debe tener un phone_number'),
    body('scheduled_time_unix').optional().isInt().withMessage('scheduled_time_unix debe ser un número entero'),
    body('phone_provider')
      .optional()
      .isIn(['twilio', 'sip_trunk'])
      .withMessage('phone_provider debe ser "twilio" o "sip_trunk"'),
  ],
  submitBatchCall
);

/**
 * POST /api/batch-calling/:batchId/cancel
 * Cancela un batch de llamadas
 */
router.post('/:batchId/cancel', cancelBatchCall);

/**
 * GET /api/batch-calling/:batchId
 * Obtiene información detallada de un batch
 */
router.get('/:batchId', getBatchCallInfo);

export default router;

