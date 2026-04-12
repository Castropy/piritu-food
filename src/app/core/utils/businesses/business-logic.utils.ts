import { Business } from '../../../data/interfaces';

export class BusinessLogicUtils {
  /**
   * Determina si un negocio está dentro de su horario de operación.
   * Centraliza la lógica de comparación de horas para todo el sistema.
   */
  static isWithinSchedule(opening: string, closing: string): boolean {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Manejo de horarios que cruzan la medianoche (ej: 18:00 a 02:00)
    if (closing < opening) {
      return currentTime >= opening || currentTime <= closing;
    }
    
    return currentTime >= opening && currentTime <= closing;
  }

  /**
   * Calcula el estado maestro del negocio.
   * El sistema evalúa horario, cierre forzado y bloqueos administrativos.
   */
  static getBusinessStatus(business: Business | null): 'open' | 'force_closed' | 'schedule_closed' | 'blocked' {
    if (!business) return 'schedule_closed';
    if (business.is_blocked) return 'blocked';
    if (business.force_close) return 'force_closed';
    
    const isOpen = this.isWithinSchedule(business.opening_time, business.closing_time);
    return isOpen ? 'open' : 'schedule_closed';
  }
}