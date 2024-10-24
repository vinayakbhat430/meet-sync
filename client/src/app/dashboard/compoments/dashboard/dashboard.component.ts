import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { ApiServiceService } from '../../../services/api-service.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Dashboard } from '../../../interfaces';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.less'
})
export class DashboardComponent implements OnInit,OnDestroy {

  apiService = inject(ApiServiceService);
  
  private readonly ngUnsubscribe$ = new Subject<void>();

  messageService = inject(NzMessageService);

  dashboard: WritableSignal<Dashboard|undefined> = signal(undefined)

  dashboard$:Observable<Dashboard> = this.apiService.getDashboard().pipe(takeUntil(this.ngUnsubscribe$))

  connectLink:WritableSignal<string> = signal('')

  ngOnInit(): void {
    this.dashboard$.subscribe(d=>{
      this.dashboard.set(d);
      this.connectLink.set(`${window.location.origin}/create-meeting/${d.email}`)
    })
  }

  ngOnDestroy(): void {
      this.ngUnsubscribe$.next();
      this.ngUnsubscribe$.complete();
  }

  copyLink(){
    navigator.clipboard.writeText(this.connectLink());
    this.messageService.info("Copied Link successfully!")
  }

}
