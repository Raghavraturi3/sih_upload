// AI Voice Assistant & Mission Copilot Feature Entrypoint
// STRICT SECURITY ACCESS: Accessible ONLY for System Administrators (ADMIN)
import './aiVoiceAssistant.css';
import { AIAssistantWidget } from './components/AIAssistantWidget.js';

let assistantInstance = null;
let savedOptions = {};

/**
 * Initializes the AI Voice Assistant on the Admin Dashboard
 * @param {Object} options
 * @param {Function} options.routerCallback - Function to navigate dashboard routes (navigateTo)
 * @param {Object} options.telemetry - TelemetryEngine instance
 * @returns {AIAssistantWidget}
 */
export function initAIAssistant(options = {}) {
  savedOptions = { ...savedOptions, ...options };

  if (!assistantInstance) {
    assistantInstance = new AIAssistantWidget(savedOptions);
  }

  return assistantInstance;
}

/**
 * Updates AI Assistant visibility based on user authorization (ADMIN ONLY)
 * @param {Object} authService 
 */
export function updateAIAssistantVisibility(authService) {
  const isAdmin = authService && authService.isAuthenticated && authService.hasRole('ADMIN');

  if (!assistantInstance && isAdmin) {
    initAIAssistant(savedOptions);
  }

  if (assistantInstance) {
    assistantInstance.setVisible(isAdmin);
  }
}

/**
 * Open the AI Copilot panel (accessible only for ADMIN)
 */
export function openAIAssistant() {
  if (assistantInstance) {
    assistantInstance.setVisible(true);
    assistantInstance.open();
  }
}

export function getAIAssistant() {
  return assistantInstance;
}

export { AIAssistantWidget };
