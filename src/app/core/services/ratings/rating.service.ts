import { Injectable } from '@angular/core';
import { BaseFirestoreService } from '../firestore/base-firestore.service';
import { Rating } from '../../../data/interfaces';
import { RatingMapper } from '../../../data/mappers/ratings/rating.mapper';
import { Observable } from 'rxjs';
import { where, orderBy } from '@angular/fire/firestore';

/**
 * RatingService: Gestiona el sistema de reputación y feedback de la plataforma.
 * 
 * Este servicio permite el registro de calificaciones entre usuarios y comercios,
 * facilitando la transparencia y la mejora continua del servicio. Hereda la 
 * lógica CRUD del servicio base y utiliza el RatingMapper para estandarizar 
 * las reseñas y sus marcas de tiempo.
 */
@Injectable({
  providedIn: 'root'
})
export class RatingService extends BaseFirestoreService<Rating> {

  constructor() {
    // Inicializa el servicio con la colección 'ratings' y su mapper dedicado
    super('ratings', RatingMapper);
  }

  /**
   * Registra una nueva calificación en el sistema.
   * 
   * Utiliza la infraestructura del servicio base para persistir el feedback, 
   * asegurando que se asigne una fecha de creación y que la estructura del 
   * puntaje sea validada por el mapper antes de la inserción.
   */
  public async addRating(rating: Rating): Promise<string> {
    return this.create({
      ...rating,
      created_at: new Date()
    });
  }

  /**
   * Recupera el historial de calificaciones asociadas a un objetivo específico.
   * 
   * Filtra por el 'target_id' (que puede ser un negocio o un cliente) y 
   * devuelve los resultados ordenados cronológicamente, permitiendo visualizar 
   * el feedback más reciente primero.
   */
  public getRatingsByTarget(targetId: string): Observable<Rating[]> {
    return this.getAll([
      where('target_id', '==', targetId),
      orderBy('created_at', 'desc')
    ]);
  }
}