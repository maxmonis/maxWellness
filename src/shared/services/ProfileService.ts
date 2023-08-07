import {Profile} from "../resources/models"

import RequestService from "./RequestService"

class ProfileService extends RequestService {
  constructor() {
    super("api/profile")
  }

  /**
   * Updates a user's profile in the database
   */
  updateProfile(profile: Profile) {
    return this.put({body: profile})
  }
}

export const profileService = new ProfileService()
