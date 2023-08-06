import {Session} from "../resources/models"

import RequestService from "./RequestService"

class SessionService extends RequestService {
  constructor() {
    super("api/session")
  }

  getSession(userId: string) {
    return this.get<Session>({route: userId})
  }
}

export const sessionService = new SessionService()
