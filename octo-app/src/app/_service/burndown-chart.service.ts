import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ScrumBoard } from '../_model/ScrumBoard';

@Injectable()
export class BurndownChartService {

  zuulUrl: string = "http://localhost:8765/";

  constructor(private http: Http) { }

  getChartData(board:ScrumBoard): Promise<object[]> {
    return this.getStoriesByBoardId(board).then(storyProfiles => this.flattenChartData(storyProfiles, board));
  }
  
  getStoriesByBoardId(board:ScrumBoard): Promise<object[]> {
    const url = this.zuulUrl + "octo-story-history-service/getStoryProfilesByBoardId/" + board.id;
    return this.http.get(url).toPromise().then(response => response.json() || []).catch(this.handleError);
  }

  private flattenChartData(storyProfiles:any[], board:ScrumBoard):object[] {
    let chartData:object[] = new Array<object>();
    //initialize the data.
    while (chartData.length < board.duration) {
        chartData.push({x: chartData.length, y: 0});
    }
    const ONE_DAY:number = 86400000;
    const n:number = storyProfiles.length;
    const startDate:number = board.startDate;
    const startDay:number = Math.floor(board.startDate / ONE_DAY);
    //let currentPointTotal:number = 0;
    console.log("startDate: " + new Date(startDay * ONE_DAY).toUTCString());
    console.log("startDay: " + startDay);
    
    for (let i:number = 0; i < n; i++) {
      let storyProfile:any = storyProfiles[i];
      console.log("\tpoints: " + storyProfile.points);
      //initally assume story is unfinished:
      let done:number = 0; //0 or 1 for true/false
      let lastUpdateIndex = 0;
      let storyEvents:any[] = (storyProfile.storyEvents as any[]).sort((a, b) => (a.modifiedDate - b.modifiedDate));
      const m:number = storyEvents.length;
      for (let j:number = 0; j < m; j++) {
        let storyEvent:any = storyEvents[j];
        if (done != storyEvent.done) {
            //Value has changed since previous update
            //Prepare to update previous indexes UP TO THIS POINT
            let eventDay:number = Math.floor(storyEvent.modifiedDate / ONE_DAY);
            let updateIndex:number = eventDay - startDay;
            if (updateIndex == lastUpdateIndex) {
                //This should not happen. It is here to catch any oddities that might have been persisted in the DB.
                console.log("******* CHECK THIS EVENT *******");
            } else if (updateIndex > lastUpdateIndex) {
                while (lastUpdateIndex < updateIndex) {
                    chartData[lastUpdateIndex++]["y"] += storyProfile.points - (done * storyProfile.points);
                }
            }
            done = storyEvent.done;
        }
      }
      
      
      while (lastUpdateIndex < board.duration) {
        chartData[lastUpdateIndex++]["y"] += storyProfile.points - (done * storyProfile.points);
      }
      //DEBUG TODO: DELETE THIS
      let s:string = "";
      for (let index = 0; index < chartData.length; index++) {
          s += chartData[index]["y"] + ", ";
      }
      console.log("s: " + s);
    }
    console.log(chartData);
    return chartData;
  }
  //TODO parse data along the following: 
    /*
    from this:
    [
    {
        "id": 1,
        "boardId": 1,
        "points": 1,
        "storyEvents": [
            {
                "id": 10,
                "done": 0,
                "modifiedDate": 1509574175000
            },
            {
                "id": 11,
                "done": 1,
                "modifiedDate": 1509660575000
            }
        ]
    },
    {
        "id": 2,
        "boardId": 1,
        "points": 2,
        "storyEvents": [
            {
                "id": 12,
                "done": 0,
                "modifiedDate": 1509574175000
            },
            {
                "id": 13,
                "done": 1,
                "modifiedDate": 1509746975000
            }
        ]
    },
    {
        "id": 3,
        "boardId": 1,
        "points": 3,
        "storyEvents": [
            {
                "id": 14,
                "done": 0,
                "modifiedDate": 1509574175000
            },
            {
                "id": 15,
                "done": 1,
                "modifiedDate": 1509833375000
            }
        ]
    },
    {
        "id": 4,
        "boardId": 1,
        "points": 4,
        "storyEvents": [
            {
                "id": 16,
                "done": 0,
                "modifiedDate": 1509574175000
            },
            {
                "id": 17,
                "done": 1,
                "modifiedDate": 1509923375000
            }
        ]
    },
    //into this:
    data:[{x:0,y:66},
          {x:1,y:56},
          //{x:2,y:56},
          {x:3,y:51},
          {x:4,y:40},
          //{x:5,y:40},
          {x:6,y:35},
          //{x:7,y:35},
          //{x:8,y:35},
          {x:9,y:25},
          //{x:10,y:25},
          {x:11,y:10},
          //{x:12,y:10},
          {x:13,y:5},
          // {x:14,y:5},
          {x:18,y:30}]*/

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}