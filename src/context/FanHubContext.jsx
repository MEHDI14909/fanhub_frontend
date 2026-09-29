import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../services/api.js'

const FanHubContext = createContext(null)

const categories = [
  'Explore',
  'Anime',
  'Gaming',
  'Movies and TV',
  'K-Pop',
  'Comics and Manga',
  'Cosplay',
  'Events Calendar',
  'Merch Showcase'
]

const slug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-$/, '')
}

const getSavedUser = () => {
  const savedUser = localStorage.getItem('fh_user')

  if (!savedUser) {
    return null
  }

  try {
    return JSON.parse(savedUser)
  } catch (error) {
    return null
  }
}

const formatContent = (item) => {
  let categoryName = item.category
  let categoryId = item.category

  if (item.category && typeof item.category === 'object') {
    categoryName = item.category.name
    categoryId = item.category._id
  }

  return {
    ...item,
    id: item._id || item.id,
    category: categoryName,
    categoryId: categoryId
  }
}

function FanHubProvider({ children }) {
  const [items, setItems] = useState([])
  const [bookmarkRecords, setBookmarkRecords] = useState([])
  const [user, setUser] = useState(getSavedUser())
  const [notice, setNotice] = useState('')
  const [notifications, setNotifications] = useState([])
  const [editItem, setEditItem] = useState(null)
  const [contentLoading, setContentLoading] = useState(true)
  const [contentError, setContentError] = useState('')

  const bookmarks = []

  bookmarkRecords.forEach((bookmark) => {
    if (bookmark.itemType === 'article' || bookmark.itemType === 'video') {
      bookmarks.push(String(bookmark.itemId))
    }
  })

  const getNotificationKey = () => {
    if (!user?.id) {
      return ''
    }

    return `fh_notifications_${user.id}`
  }

  const addNotification = (message) => {
    const key = getNotificationKey()

    if (!key || !message) {
      return
    }

    const newNotification = {
      id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
      message: message,
      read: false,
      createdAt: new Date().toISOString()
    }

    setNotifications((current) => {
      const next = [newNotification, ...current].slice(0, 50)
      localStorage.setItem(key, JSON.stringify(next))
      return next
    })
  }

  const markAllNotificationsRead = () => {
    const key = getNotificationKey()

    if (!key) {
      return
    }

    setNotifications((current) => {
      const next = current.map((item) => ({ ...item, read: true }))
      localStorage.setItem(key, JSON.stringify(next))
      return next
    })
  }

  const clearNotifications = () => {
    const key = getNotificationKey()

    if (key) {
      localStorage.removeItem(key)
    }

    setNotifications([])
  }

  const flash = (message, saveAsNotification = false) => {
    setNotice(message)

    if (saveAsNotification) {
      addNotification(message)
    }

    setTimeout(() => {
      setNotice('')
    }, 3000)
  }

  const loadContent = async () => {
    try {
      setContentLoading(true)
      setContentError('')

      const result = await api.getContent()
      const newItems = []

      if (Array.isArray(result)) {
        result.forEach((item) => {
          newItems.push(formatContent(item))
        })
      }

      setItems(newItems)
    } catch (error) {
      setContentError(error.message)
    } finally {
      setContentLoading(false)
    }
  }

  const loadBookmarks = async () => {
    const token = localStorage.getItem('fh_token')

    if (!token) {
      setBookmarkRecords([])
      return
    }

    try {
      const result = await api.getBookmarks()

      if (Array.isArray(result)) {
        setBookmarkRecords(result)
      } else {
        setBookmarkRecords([])
      }
    } catch (error) {
      setBookmarkRecords([])
    }
  }

  const loadProfile = async () => {
    const token = localStorage.getItem('fh_token')

    if (!token) {
      return
    }

    try {
      const profile = await api.getProfile()
      setUser(profile)
    } catch (error) {
      localStorage.removeItem('fh_token')
      localStorage.removeItem('fh_user')
      setUser(null)
    }
  }

  useEffect(() => {
    loadContent()
    loadProfile()
  }, [])

  useEffect(() => {
    if (user) {
      localStorage.setItem('fh_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('fh_user')
    }

    loadBookmarks()

    if (user?.id) {
      const key = `fh_notifications_${user.id}`
      const saved = localStorage.getItem(key)

      try {
        const parsed = saved ? JSON.parse(saved) : []
        setNotifications(Array.isArray(parsed) ? parsed : [])
      } catch (error) {
        setNotifications([])
      }
    } else {
      setNotifications([])
    }
  }, [user])

  const isBookmarked = (itemType, itemId) => {
    let found = false

    bookmarkRecords.forEach((bookmark) => {
      if (
        bookmark.itemType === itemType &&
        String(bookmark.itemId) === String(itemId)
      ) {
        found = true
      }
    })

    return found
  }

  const toggleItemBookmark = async (itemType, itemId) => {
    const token = localStorage.getItem('fh_token')

    if (!token) {
      flash('Please login to save bookmarks')
      return
    }

    let oldBookmark = null

    bookmarkRecords.forEach((bookmark) => {
      if (
        bookmark.itemType === itemType &&
        String(bookmark.itemId) === String(itemId)
      ) {
        oldBookmark = bookmark
      }
    })

    try {
      if (oldBookmark) {
        await api.deleteBookmark(oldBookmark._id)

        const newBookmarks = bookmarkRecords.filter((bookmark) => {
          return bookmark._id !== oldBookmark._id
        })

        setBookmarkRecords(newBookmarks)
        flash('Bookmark removed', true)
        return
      }

      const result = await api.addBookmark({
        itemType: itemType,
        itemId: itemId
      })

      setBookmarkRecords([result.bookmark, ...bookmarkRecords])
      flash('Bookmark saved', true)
    } catch (error) {
      flash(error.message)
    }
  }

  const toggleBookmark = async (id) => {
    let selectedItem = null

    items.forEach((item) => {
      if (String(item.id) === String(id)) {
        selectedItem = item
      }
    })

    if (!selectedItem) {
      flash('Content not found')
      return
    }

    if (selectedItem.type !== 'article' && selectedItem.type !== 'video') {
      flash('This content type cannot be bookmarked')
      return
    }

    await toggleItemBookmark(selectedItem.type, selectedItem.id)
  }

  const registerAccount = async (data) => {
    const result = await api.register(data)
    return result.user
  }

  const loginAccount = async (data) => {
    const result = await api.login(data)

    if (result.token) {
      localStorage.setItem('fh_token', result.token)
    }

    setUser(result.user)
    return result.user
  }

  const saveContent = async (record) => {
    const id = record.id || record._id
    let result

    if (id) {
      result = await api.updateContent(id, record)
    } else {
      result = await api.createContent(record)
    }

    const savedItem = formatContent(result.content)

    if (id) {
      const newItems = items.map((item) => {
        if (String(item.id) === String(id)) {
          return savedItem
        }

        return item
      })

      setItems(newItems)
    } else {
      setItems([savedItem, ...items])
    }

    return savedItem
  }

  const removeContent = async (id) => {
    await api.deleteContent(id)

    const newItems = items.filter((item) => {
      return String(item.id) !== String(id)
    })

    setItems(newItems)
  }

  return (
    <FanHubContext.Provider
      value={{
        items,
        setItems,
        loadContent,
        bookmarks,
        bookmarkRecords,
        loadBookmarks,
        isBookmarked,
        toggleBookmark,
        toggleItemBookmark,
        user,
        setUser,
        notice,
        flash,
        notifications,
        unreadNotifications: notifications.filter((item) => !item.read).length,
        addNotification,
        markAllNotificationsRead,
        clearNotifications,
        editItem,
        setEditItem,
        registerAccount,
        loginAccount,
        saveContent,
        removeContent,
        contentLoading,
        contentError
      }}
    >
      {children}
    </FanHubContext.Provider>
  )
}

const useFanHub = () => {
  return useContext(FanHubContext)
}

export { FanHubProvider, categories, slug, useFanHub }
