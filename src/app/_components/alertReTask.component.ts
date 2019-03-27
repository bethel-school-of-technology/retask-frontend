import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AlertService } from '@app/_services';

@Component({
    selector: 'alert',
    templateUrl: 'alertReTask.component.html'
})

export class AlertRetaskComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    message: any;

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.subscription = this.alertService.getMessage().subscribe(message => { 
            this.message = message; 
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}