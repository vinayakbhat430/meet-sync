import { Component, inject, OnDestroy, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { Events } from '../../interfaces';
import { ConfigService } from '../../services/config.service';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiServiceService } from '../../services/api-service.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, FormsModule,SharedModule],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.less'
})
export class CreateEventComponent implements OnInit, OnDestroy {

  configService= inject(ConfigService);

  apiService = inject(ApiServiceService);

  messageService = inject(NzMessageService);

  currentUserEmail: WritableSignal<string> = signal('')

  slots:Signal<number[]>  =signal(Array.from({ length: 10 }, (_, i) => i + 1))

  
  private readonly ngUnsubscribe$ = new Subject<void>()

  eventForm:FormGroup;
  constructor(private fb:FormBuilder){
    this.eventForm = this.fb.group({
      title:[''],
      description:[''],
      duration:[1],
      isPrivate:[false]
    })
  }

  ngOnInit(): void {
    this.configService.user.subscribe(user=>{
      this.currentUserEmail.set(user.email)
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  createEvent(){
    const formData = this.eventForm.getRawValue() as EventModel
    const postPayload:Events = {...formData , duration: formData.duration * 30, bookings:[],email:this.currentUserEmail()}
    this.apiService.postEvents(postPayload).subscribe(d =>{
      this.messageService.success('Created Event Successfully');
    })

  }

}

interface EventModel {
  title:string,
  description:string,
  duration:number,
  isPrivate:boolean
}
