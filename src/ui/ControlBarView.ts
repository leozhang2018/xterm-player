import { createElement, addDisposableDomListener } from './DomHelper'
import { State, IComponent } from './Types'
import { IDisposable } from '../Types'
import { formatTime } from '../Utils'
import Icons from './Icons'


export class ControlBarView implements IComponent {
  public readonly element: HTMLElement

  private _playbackButton: HTMLElement
  private _timeDisplay: HTMLElement

  private _state: State = 'Paused'
  private _currentTime: number = 0
  private _duration: number = 0

  constructor() {
    this.element = createElement('div', { class: 'control-bar' },
      this._playbackButton = createElement('span', { class: 'playback-button' }),
      this._timeDisplay = createElement('div', { class: 'time-display' })
    )
    this._updatePlaybackButton()
    this._updateTimeDisplay()
  }

  public get state(): State { return this._state }
  public set state(v: State) {
    if (this._state !== v) {
      this._state = v
      this._updatePlaybackButton()
    }
  }
  public get currentTime(): number { return this._currentTime }
  public set currentTime(value: number) {
    if (value !== this._currentTime) {
      this._currentTime = value
      this._updateTimeDisplay()
    }
  }
  public set duration(value: number) {
    if (value !== this._duration) {
      this._duration = value
      this._updateTimeDisplay()
    }
  }

  public onPlaybackButtonClick(listener: (ev: any) => void): IDisposable {
    return addDisposableDomListener(this._playbackButton, 'click', listener)
  }

  private _updatePlaybackButton() {
    switch (this.state) {
      case 'Running':
        this._playbackButton.innerHTML = Icons.Pause
        break
      case 'Paused':
        this._playbackButton.innerHTML = Icons.Play
        break
      case 'Stopped':
        this._playbackButton.innerHTML = Icons.Replay
        break
    }
  }
  private _updateTimeDisplay() {
    this._timeDisplay.innerText = formatTime(this._currentTime) + '/' + formatTime(this._duration)
  }
}
