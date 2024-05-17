import dayjs from 'dayjs'
import RelativeTime from 'dayjs/plugin/relativeTime.js'
import 'dayjs/locale/zh-tw.js'
import { cooldownMapping } from '../variables.js'
dayjs.extend(RelativeTime)
dayjs.locale('zh-tw') // use locale globally

class Space {
  constructor(id, issueId, type, name) {
    this.id = id
    this.issueId = issueId
    this.type = type
    this.name = name
  }

  set dueDate(time) {
    this._dueDate = time
  }
  get dueDate() {
    // return this._dueDate.format('MM-DD HH:mm')
    return this._dueDate
  }

  isDueBeforeNextIssue() {
    return this.dueDate.isBefore(this.nextIssueTime)
  }

  set lastIssueTime(time) {
    this._lastIssueTime = time
  }

  get lastIssueTime() {
    return this._lastIssueTime
  }

  get nextIssueTime() {
    return this._lastIssueTime.add(cooldownMapping[this.type], 'hours')
  }

  get remainTime() {
    let diffInDay = this.nextIssueTime.diff(dayjs(), 'day')
    let diffInHour = this.nextIssueTime.diff(dayjs(), 'hour') % 24
    let diffInMinute = this.nextIssueTime.diff(dayjs(), 'minute') % 60
    let diffInSecond = this.nextIssueTime.diff(dayjs(), 'second') % 60

    let result = ''
    if (diffInDay > 0) {
      result += `${diffInDay}天`
    }
    if (diffInHour > 0) {
      result += `${diffInHour}小時`
    }
    if (diffInMinute > 0) {
      result += `${diffInMinute}分`
    }
    if (diffInSecond > 0) {
      result += `${diffInSecond}秒`
    }
    return result
  }

  getDataForFirebase() {
    return {
      id: this.id,
      issueId: this.issueId,
      type: this.type,
      name: this.name,
      lastIssueTime: this.lastIssueTime.toISOString(),
      dueDate: this.dueDate.toISOString(),
      nextIssueTime: this.nextIssueTime.toISOString(),
    }
  }
}

export default Space
