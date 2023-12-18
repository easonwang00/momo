// sendbird_helper.js
import SendBird from "sendbird"
import config from "../../config"

export const connectUser = async (appId, userUuid, nickname) => {
  const sbInstance = new SendBird({ appId })
  return new Promise((resolve, reject) => {
    sbInstance.connect(userUuid, (user, error) => {
      if (error) {
        reject(error)
        return
      }
      updateUserNickname(nickname, sbInstance)
        .then(() => resolve(sbInstance))
        .catch(reject)
    })
  })
}

export const updateUserNickname = async (nickname, sbInstance) => {
  return new Promise((resolve, reject) => {
    sbInstance.updateCurrentUserInfo(nickname, null, (response, error) => {
      if (error) {
        reject(error)
        return
      }
      resolve(response)
    })
  })
}

export const checkIfUserExists = (userId, sbInstance) => {
  return new Promise((resolve, reject) => {
    const userQuery = sbInstance.createUserListQuery()
    userQuery.userIdsFilter = [userId]
    userQuery.next((users, error) => {
      if (error) {
        reject(error)
        return
      }
      resolve(users.some(user => user.userId === userId))
    })
  })
}

export const createChannel = async (sbInstance, currentUserUuid, otherUserUuid) => {
  return new Promise((resolve, reject) => {
    const params = new sbInstance.GroupChannelParams()
    params.isDistinct = true
    params.addUserId(otherUserUuid)
    params.addUserId(currentUserUuid)
    sbInstance.GroupChannel.createChannel(params, (channel, error) => {
      if (error) {
        reject(error)
        return
      }
      resolve(channel)
    })
  })
}

export const fetchChatChannels = async sbInstance => {
  return new Promise(async (resolve, reject) => {
    let allChannels = []
    const channelListQuery = sbInstance.GroupChannel.createMyGroupChannelListQuery()
    channelListQuery.includeEmpty = true
    channelListQuery.order = "latest_last_message"

    try {
      while (channelListQuery.hasNext) {
        const channels = await channelListQuery.next()
        allChannels = [...allChannels, ...channels]
      }
      console.log(`Fetched ${allChannels.length} channels in total`)
      resolve(allChannels)
    } catch (error) {
      console.error("Error fetching all channels:", error)
      reject(error)
    }
  })
}

export const createUser = async (userUuid, nickname, sbInstance) => {
  return new Promise((resolve, reject) => {
    sbInstance.connect(userUuid, (user, error) => {
      if (error) {
        reject(error)
        return
      }
      updateUserNickname(nickname, sbInstance).then((resolve)).catch(reject)
    })
  })
}

export const createChannelWithUser = async (sbInstance, userUuid, otherUserUuid) => {
  if (!sbInstance) {
    console.error("SendBird instance not initialized.")
    return
  }

  try {
    const userExists = await checkIfUserExists(otherUserUuid, sbInstance)
    if (!userExists) {
      await createUser(otherUserUuid, otherUserUuid, sbInstance)
      sbInstance = await connectUser(config.sendbird_app_id, userUuid, userUuid)
    }

    const newChannel = await createChannel(sbInstance, userUuid, otherUserUuid)
    return newChannel
  } catch (error) {
    console.error("Error in createChannelWithUser:", error)
    throw error
  }
}
