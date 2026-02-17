import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface Review {
  id: number;
  description: string;
  rating: number;
  isDeleted: boolean;
  user: {
    id: number;
    firstName: string;
    lastName: string;
  };
  isEditing?: boolean;
  tempDescription?: string;
  tempRating?: number;
  likeCount?: number;
  dislikeCount?: number;
  userReaction?: 'like' | 'dislike' | null;

}

export interface ReviewRatingCountsResponse {
  excellent: number;
  good: number;
  average: number;
  poor: number;
  terrible: number;
}

export interface ReviewGetResponse {
  id: number;
  description: string;
  rating: number;
  user: any;
  isDeleted: boolean;
}

export interface ReviewGetBySortResponse {
  id: number;
  description: string;
  rating: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
  };
  likes: number;
  dislikes: number;
  isEditing?: boolean;
  tempDescription?: string;
  tempRating?: number;
  likeCount?: number;
  dislikeCount?: number;
  userReaction?: 'like' | 'dislike' | null;

}

export interface ReviewPostRequest {
  description: string;
  rating: number;
  userId: number;
  localeId: number;
}

export interface ReviewUpdateRequest {
  id: number;
  description: string;
  rating: number;
  userId: number;
}

export interface ReviewDeleteRequest {
  reviewId: number;
  userId: number;
}

export interface ReviewAverageResponse {
  averageRating: number;
}

export interface ReviewPagedRequest {
  pageNumber: number;
  pageSize: number;
  localeId: number;
}

export interface MyPagedList<T> {
  dataItems: T[];
  pageIndex: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

@Injectable({ providedIn: 'root' })

export class ReviewEndpointsService {
  private readonly api = 'http://localhost:7000/';

  constructor(private http: HttpClient) {}

  getPaged(request: ReviewPagedRequest): Observable<MyPagedList<ReviewGetResponse>> {
    let params = new HttpParams()
      .set('pageNumber', request.pageNumber)
      .set('pageSize', request.pageSize)
      .set('localeId', request.localeId);
    return this.http.get<MyPagedList<ReviewGetResponse>>(`${this.api}ReviewGet`, { params });
  }

  postReview(body: ReviewPostRequest): Observable<any> {
    return this.http.post(`${this.api}ReviewPost`, body);
  }

  updateReview(body: ReviewUpdateRequest): Observable<any> {
    return this.http.put(`${this.api}ReviewUpdate`, body);
  }

  deleteReview(body: ReviewDeleteRequest): Observable<any> {
    return this.http.request('delete', `${this.api}ReviewDelete`, { body });
  }

  getAverage(localeId: number): Observable<ReviewAverageResponse> {
    const params = new HttpParams().set('localeId', localeId);
    return this.http.get<ReviewAverageResponse>(`${this.api}ReviewAverage`, { params });
  }

  getRatingCounts(localeId: number): Observable<ReviewRatingCountsResponse> {
    const params = new HttpParams().set('localeId', localeId);
    return this.http.get<ReviewRatingCountsResponse>(`${this.api}ReviewRatingCounts`, { params });
  }

  getSorted(request: ReviewPagedRequest & { sortBy: string }): Observable<MyPagedList<ReviewGetBySortResponse>> {
    let params = new HttpParams()
      .set('pageNumber', request.pageNumber)
      .set('pageSize', request.pageSize)
      .set('localeId', request.localeId)
      .set('sortBy', request.sortBy);

    return this.http.get<MyPagedList<ReviewGetBySortResponse>>(`${this.api}ReviewGetBySort`, { params });
  }


}
