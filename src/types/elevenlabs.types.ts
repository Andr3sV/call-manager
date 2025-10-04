// Tipos para los requests y responses de ElevenLabs API

export interface ConversationInitiationClientData {
  dynamic_variables?: Record<string, any>;
  [key: string]: any; // Permite otras propiedades adicionales
}

export interface Recipient {
  phone_number: string;
  id?: string;
  conversation_initiation_client_data?: ConversationInitiationClientData;
}

export interface SubmitBatchCallRequest {
  call_name: string;
  agent_id: string;
  agent_phone_number_id: string;
  recipients: Recipient[];
  scheduled_time_unix?: number | null;
  phone_provider?: 'twilio' | 'sip_trunk' | null;
  include_dynamic_variables?: boolean; // Si es false, no se enviarán dynamic_variables
}

export interface BatchCallResponse {
  id: string;
  phone_number_id: string;
  name: string;
  agent_id: string;
  created_at_unix: number;
  scheduled_time_unix: number;
  total_calls_dispatched: number;
  total_calls_scheduled: number;
  last_updated_at_unix: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  agent_name: string;
  phone_provider: 'twilio' | 'sip_trunk' | null;
}

export interface RecipientDetail {
  id: string;
  phone_number: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  created_at_unix: number;
  updated_at_unix: number;
  conversation_id?: string;
  conversation_initiation_client_data?: any;
}

export interface BatchCallDetailResponse extends BatchCallResponse {
  recipients: RecipientDetail[];
}

export interface ElevenLabsError {
  detail?: string;
  message?: string;
}

