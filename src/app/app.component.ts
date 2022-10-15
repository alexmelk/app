import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { BehaviorSubject, interval } from 'rxjs';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    title = 'app';
    gamepads: Gamepad[] = [];

    set selectedId(id: string) {
        this.selectedId$.next(id);
    }
    get selectedId() {
        return this.selectedId$.value;
    }
    selectedId$ = new BehaviorSubject<string>('');

    btns$ = new BehaviorSubject<readonly GamepadButton[]>([]);
    axes$ = new BehaviorSubject<readonly number[]>([]);
    ngOnInit(): void {
        window.addEventListener('gamepadconnected', (e) => {
            this.gamepads.push(e.gamepad);
        });
        window.addEventListener('gamepaddisconnected', (e) => {
            _.remove(this.gamepads, (x) => x.id == e.gamepad.id);
        });

        const interval$ = interval(1);
        interval$.subscribe((x) => {
            this.btns$.next(this.getSelected(this.selectedId)?.buttons ?? []);
            this.axes$.next(this.getSelected(this.selectedId)?.axes ?? []);
        });

        this.selectedId$.subscribe((id) => {
            const gamepad = this.getSelected(id);
            navigator.vibrate([200, 200, 200]);
        });
    }
    getSelected(id?: string) {
        return navigator.getGamepads().find((x) => x?.id === id);
    }
}
