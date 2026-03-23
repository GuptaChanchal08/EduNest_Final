import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    unreadCount: 0,
  },
  reducers: {
    setNotifications(state, action) {
      state.notifications = action.payload
      state.unreadCount = action.payload.filter(n => !n.isRead).length
    },
    addNotification(state, action) {
      state.notifications.unshift(action.payload)
      if (!action.payload.isRead) state.unreadCount += 1
    },
    markAllRead(state) {
      state.notifications = state.notifications.map(n => ({ ...n, isRead: true }))
      state.unreadCount = 0
    },
    decrementUnread(state) {
      if (state.unreadCount > 0) state.unreadCount -= 1
    },
  },
})

export const { setNotifications, addNotification, markAllRead, decrementUnread } = notificationSlice.actions
export default notificationSlice.reducer
