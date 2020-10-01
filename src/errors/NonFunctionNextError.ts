import { RescueError } from './RescueError'

export class NonFunctionNextError extends RescueError {
  constructor() {
    super(
      'The last parameter received by express-rescue is not a function. Are you sure you passed its return as a middleware?'
    )
  }
}
