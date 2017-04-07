import i from 'icepick'

const initialState = {
/*********************************************
This reducer store paginated follower data for
every user.

  [userId] : {
    1: [followingUserId, followingUserId]
    2: [followingUserId, followingUserId]
  }

*********************************************/
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'USER_FOLLOWERS/GET_FOLLOWERS_PENDING':
      return i.assocIn(state, [action.meta.userId, action.meta.page, 'loading'], true)
    case 'USER_FOLLOWERS/GET_FOLLOWERS_REJECTED':
      return i.assocIn(state, [action.meta.userId, action.meta.page, 'loading'], false)
    case 'USER_FOLLOWERS/GET_FOLLOWERS_FULFILLED':
      return i.assocIn(state, [action.meta.userId, action.meta.page], {
        loading: false,
        data: action.payload.data
      })

    default:
      return state
  }
}
