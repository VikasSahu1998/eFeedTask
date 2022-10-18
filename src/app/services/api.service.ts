import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }
  postEmp(data: any) {
    return this.http.post<any>("http://localhost:3000/emplist/", data);
  }

  getEmp() {
    return this.http.get<any>("http://localhost:3000/emplist/");
  }

  putEmp(data: any, id: number) {
    return this.http.put<any>("http://localhost:3000/emplist/" + id, data);
  }

  deleteEmp(id: number) {
    return this.http.delete<any>("http://localhost:3000/emplist/" + id);
  }

  getWeather(location : any) {
    return this.http.get("https://api.openweathermap.org/data/2.5/weather?q={city},uk&APPID=9987ef6329f8e8747a6c3c9417ec4e52" + location);
  }
}
