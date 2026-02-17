import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {MyAuthService} from '../../services/auth-services/my-auth.service';

export interface Reaction {
  id: number;
  reviewId: number;
  userId: number;
  isLiked: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ReactionService {
  private baseUrl = 'http://localhost:7000/Reactions'

  constructor(private http: HttpClient,private authService:MyAuthService) {}

  reactToReview(reviewId: number, userId: number, isLike: boolean): Observable<any> {
    return this.http.post(`${this.baseUrl}/ReactToReview/react`, null, {
      params: {
        reviewId,
        userId,
        isLike,
      },
    });
  }

  removeReaction(reviewId: number, userId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/RemoveReaction/remove`, {
      params: {
        reviewId,
        userId,
      },
      responseType: 'text' as 'json'
    });
  }

  getReactionCounts(reviewId: number): Observable<{ likes: number; dislikes: number }> {
    return this.http.get<{ likes: number; dislikes: number }>(
      `${this.baseUrl}/GetReactionCounts/count`,
      { params: { reviewId } }
    );
  }

}
