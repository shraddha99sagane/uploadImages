import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
	baseUrl:string = "http://localhost:3000";
  	constructor(private httpClient : HttpClient) { }

  	

    getImages (): Observable<any> {
	    return this.httpClient.get(this.baseUrl + '/api/getImages')
	      .pipe(
	        tap( images => {return images;}),
	        catchError(this.handleError('getImages', []))
	      );
  	}
    addImages (formData): Observable<any> {
    	console.log(formData);
	    return this.httpClient.post(this.baseUrl + '/api/upload', formData).pipe(
	      tap(images => {return images;}),
	      catchError(this.handleError('addImages'))
	    );
  	}


	private handleError<T> (operation = 'operation', result?: T) {
	    return (error: any): Observable<T> => {

	      // TODO: send the error to remote logging infrastructure
	      console.error(error); // log to console instead

	      // TODO: better job of transforming error for user consumption
	      console.log(`${operation} failed: ${error.message}`);

	      // Let the app keep running by returning an empty result.
	      return of(result as T);
    };
  }

}
