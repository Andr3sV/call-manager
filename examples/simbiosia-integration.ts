/**
 * Ejemplos de integración desde Simbiosia
 * 
 * Este archivo muestra cómo Simbiosia puede consumir
 * el servicio Call Manager usando TypeScript/JavaScript
 */

import axios, { AxiosInstance } from 'axios';

// Configuración del cliente
const callManagerClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3099/api/batch-calling',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// Ejemplo 1: Disparar batch de llamadas
// ============================================
async function dispararLlamadasInmediatas() {
  try {
    const response = await callManagerClient.post('/submit', {
      call_name: 'Campaña Marketing Octubre',
      agent_id: 'tu_agent_id',
      agent_phone_number_id: 'tu_phone_number_id',
      recipients: [
        {
          phone_number: '+1234567890',
          conversation_initiation_client_data: {
            dynamic_variables: {
              nombre: 'Juan Pérez',
              empresa: 'Acme Corp',
              producto: 'Premium Plan',
              precio: '$299',
            },
          },
        },
        {
          phone_number: '+0987654321',
          conversation_initiation_client_data: {
            dynamic_variables: {
              nombre: 'María García',
              empresa: 'Tech Inc',
              producto: 'Basic Plan',
              precio: '$99',
            },
          },
        },
      ],
      scheduled_time_unix: null, // null = inmediato
      phone_provider: 'twilio',
    });

    console.log('Batch creado exitosamente:', response.data);
    console.log('Batch ID:', response.data.data.id);
    console.log('Total llamadas programadas:', response.data.data.total_calls_scheduled);

    return response.data.data;
  } catch (error: any) {
    console.error('Error al disparar llamadas:', error.response?.data || error.message);
    throw error;
  }
}

// ============================================
// Ejemplo 2: Disparar llamadas programadas
// ============================================
async function dispararLlamadasProgramadas() {
  try {
    // Programar para dentro de 2 horas
    const dosSHorasEnSegundos = Math.floor(Date.now() / 1000) + (2 * 60 * 60);

    const response = await callManagerClient.post('/submit', {
      call_name: 'Recordatorios Programados',
      agent_id: 'tu_agent_id',
      agent_phone_number_id: 'tu_phone_number_id',
      recipients: [
        {
          phone_number: '+1234567890',
          conversation_initiation_client_data: {
            dynamic_variables: {
              nombre: 'Carlos',
              recordatorio: 'Cita médica mañana a las 10am',
            },
          },
        },
      ],
      scheduled_time_unix: dosSHorasEnSegundos,
      phone_provider: 'twilio',
    });

    console.log('Llamadas programadas para:', new Date(dosSHorasEnSegundos * 1000));
    return response.data.data;
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
}

// ============================================
// Ejemplo 3: Consultar estado del batch
// ============================================
async function consultarEstadoBatch(batchId: string) {
  try {
    const response = await callManagerClient.get(`/${batchId}`);

    const batch = response.data.data;
    console.log('Estado del batch:', batch.status);
    console.log('Llamadas despachadas:', batch.total_calls_dispatched);
    console.log('Llamadas programadas:', batch.total_calls_scheduled);

    // Verificar estado de cada destinatario
    batch.recipients.forEach((recipient: any) => {
      console.log(`- ${recipient.phone_number}: ${recipient.status}`);
      if (recipient.conversation_id) {
        console.log(`  Conversation ID: ${recipient.conversation_id}`);
      }
    });

    return batch;
  } catch (error: any) {
    console.error('Error al consultar batch:', error.response?.data || error.message);
    throw error;
  }
}

// ============================================
// Ejemplo 4: Cancelar batch de llamadas
// ============================================
async function cancelarBatch(batchId: string) {
  try {
    const response = await callManagerClient.post(`/${batchId}/cancel`);

    console.log('Batch cancelado exitosamente');
    console.log('Nuevo estado:', response.data.data.status); // debería ser "cancelled"

    return response.data.data;
  } catch (error: any) {
    console.error('Error al cancelar batch:', error.response?.data || error.message);
    throw error;
  }
}

// ============================================
// Ejemplo 5: Flujo completo con monitoreo
// ============================================
async function flujoCompletoConMonitoreo() {
  try {
    // 1. Disparar llamadas
    console.log('1. Disparando batch de llamadas...');
    const batch = await dispararLlamadasInmediatas();
    const batchId = batch.id;
    console.log(`✓ Batch creado: ${batchId}\n`);

    // 2. Monitorear estado cada 10 segundos
    console.log('2. Monitoreando estado del batch...');
    const monitorInterval = setInterval(async () => {
      try {
        const estado = await consultarEstadoBatch(batchId);
        
        if (estado.status === 'completed' || 
            estado.status === 'failed' || 
            estado.status === 'cancelled') {
          clearInterval(monitorInterval);
          console.log(`\n✓ Batch finalizado con estado: ${estado.status}`);
        }
      } catch (error) {
        clearInterval(monitorInterval);
      }
    }, 10000); // cada 10 segundos

    // 3. Cancelar después de 30 segundos si es necesario
    // setTimeout(async () => {
    //   clearInterval(monitorInterval);
    //   console.log('\n3. Cancelando batch...');
    //   await cancelarBatch(batchId);
    // }, 30000);

  } catch (error) {
    console.error('Error en flujo completo:', error);
  }
}

// ============================================
// Ejemplo 6: Batch desde datos de base de datos
// ============================================
async function dispararDesdeBaseDatos(contactos: any[]) {
  try {
    // Transformar datos de la base de datos al formato requerido
    const recipients = contactos.map(contacto => ({
      phone_number: contacto.telefono,
      conversation_initiation_client_data: {
        dynamic_variables: {
          nombre: contacto.nombre,
          apellido: contacto.apellido,
          empresa: contacto.empresa,
          // Agregar cualquier otro campo personalizado
          ...contacto.camposPersonalizados,
        },
      },
    }));

    const response = await callManagerClient.post('/submit', {
      call_name: `Campaña - ${new Date().toLocaleDateString()}`,
      agent_id: process.env.ELEVENLABS_AGENT_ID,
      agent_phone_number_id: process.env.ELEVENLABS_PHONE_ID,
      recipients,
      scheduled_time_unix: null,
      phone_provider: 'twilio',
    });

    return response.data.data;
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
}

// ============================================
// Ejemplo 7: Manejo de errores robusto
// ============================================
async function dispararConManejoDeErrores() {
  try {
    const response = await callManagerClient.post('/submit', {
      call_name: 'Test con validación',
      agent_id: 'agent_123',
      agent_phone_number_id: 'phone_456',
      recipients: [
        {
          phone_number: '+1234567890',
        },
      ],
    });

    return { success: true, data: response.data.data };
  } catch (error: any) {
    // Errores de validación (400)
    if (error.response?.status === 400) {
      const validationErrors = error.response.data.errors;
      console.error('Errores de validación:');
      validationErrors.forEach((err: any) => {
        console.error(`- ${err.param}: ${err.msg}`);
      });
      return { success: false, error: 'validation_error', details: validationErrors };
    }

    // Errores del servidor (500)
    if (error.response?.status === 500) {
      console.error('Error del servidor:', error.response.data.error);
      return { success: false, error: 'server_error', message: error.response.data.error };
    }

    // Errores de red
    if (error.code === 'ECONNREFUSED') {
      console.error('No se pudo conectar al servicio Call Manager');
      return { success: false, error: 'connection_error' };
    }

    // Timeout
    if (error.code === 'ECONNABORTED') {
      console.error('La solicitud excedió el tiempo de espera');
      return { success: false, error: 'timeout_error' };
    }

    // Otros errores
    console.error('Error desconocido:', error.message);
    return { success: false, error: 'unknown_error', message: error.message };
  }
}

// ============================================
// Exportar funciones para uso en Simbiosia
// ============================================
export {
  dispararLlamadasInmediatas,
  dispararLlamadasProgramadas,
  consultarEstadoBatch,
  cancelarBatch,
  flujoCompletoConMonitoreo,
  dispararDesdeBaseDatos,
  dispararConManejoDeErrores,
};

// ============================================
// Uso desde Simbiosia (ejemplo)
// ============================================
/*

// En tu controlador o servicio de Simbiosia:

import { 
  dispararLlamadasInmediatas, 
  consultarEstadoBatch 
} from './call-manager-integration';

// En un endpoint o función de Simbiosia:
async function enviarCampanaDeLlamadas(req, res) {
  try {
    const batch = await dispararLlamadasInmediatas();
    
    // Guardar el batchId en tu base de datos de Simbiosia
    await saveBatchToDatabase({
      batchId: batch.id,
      campaignName: batch.name,
      totalCalls: batch.total_calls_scheduled,
      status: batch.status,
    });
    
    res.json({ success: true, batchId: batch.id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

*/

