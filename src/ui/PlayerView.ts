import { createElement, addDisposableDomListener } from './DomHelper'
import { ControlBarView } from './ControlBarView'
import { ProgressBarView } from './ProgressBarView'
import { IDisposable } from '../Types'
import { State, IComponent } from './Types'
import Icons from './Icons'

export class PlayerView implements IComponent {
  public readonly element: HTMLElement
  public readonly videoWrapper: HTMLElement
  public readonly progressBar: ProgressBarView = new ProgressBarView()
  public readonly controlBar: ControlBarView = new ControlBarView()

  private _bottom: HTMLElement
  private _bigButton: HTMLElement
  private _spinner: HTMLElement

  private _state: State = 'Paused'

  constructor() {
    this.element = createElement('div', { class: 'xterm-player', attrs: { tabindex: '0' } },
      this.videoWrapper = createElement('div', { class: 'video-wrapper' }),
      this._bigButton = createElement('div', { class: 'overlay center big-button ' }),
      this._spinner = createElement('div', { class: 'overlay center sk-flow' },
        createElement('div', { class: 'sk-flow-dot' }),
        createElement('div', { class: 'sk-flow-dot' }),
        createElement('div', { class: 'sk-flow-dot' }),
      ),
      this._bottom = createElement('div', { class: 'bottom' },
        this.progressBar.element,
        this.controlBar.element
      )
    )
    this._updateBigButton()
    addDisposableDomListener(this.element, 'mouseenter', () => {
      if (this.state === 'Running') {
        this._showBottom(true)
      }
    })
    addDisposableDomListener(this.element, 'mouseleave', () => {
      if (this.state === 'Running') {
        this._showBottom(false)
      }
    })
  }

  public get state(): State { return this._state }
  public set state(v: State) {
    if (this._state !== v) {
      this._state = v
      this.controlBar.state = v
      this._updateBigButton()
      if (this._state !== 'Running') {
        this._showBottom(true)
      }
    }
  }

  public onBigButtonClick(cb: (ev: any) => void): IDisposable {
    return addDisposableDomListener(this._bigButton, 'click', cb)
  }
  public onKeyDown(cb: (ev: any) => void): IDisposable {
    return addDisposableDomListener(this.element, 'keydown', cb, true)
  }

  private _showBottom(value: boolean) {
    this._bottom.style.opacity = value ? '1' : '0'
  }
  private _updateBigButton(): void {
    switch (this.state) {
      case 'Paused':
        this._bigButton.style.display = 'block'
        this._bigButton.innerHTML = Icons.Pause
        this._spinner.style.display = 'none'
        break
      case 'Stopped':
        this._bigButton.style.display = 'block'
        this._bigButton.innerHTML = Icons.Replay
        this._spinner.style.display = 'none'
        break
      case 'Running':
        this._bigButton.style.display = 'none'
        this._spinner.style.display = 'none'
        break
      case 'Loading':
        this._bigButton.style.display = 'none'
        this._spinner.style.display = 'flex'
      default:
        break
    }
  }
}
