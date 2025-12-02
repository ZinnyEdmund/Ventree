import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  BaseResponse,
  NotificationResponse,
  UpdateNotificationResponse,
  NotificationQueryParams,
  UpdateNotificationDto,
} from "../types/general";
import { baseQueryWithLogout } from "./baseQueryLogout";

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: baseQueryWithLogout,
  tagTypes: ["Notifications"],
  endpoints: (builder) => ({
    fetchNotifications: builder.query<NotificationResponse, NotificationQueryParams>({
      query: ({ shopId, limit = 20, offset = 0, unreadOnly = false }) => ({
        url: `/v1/notifications`,
        method: "GET",
        params: { shopId, limit, offset, unreadOnly },
      }),
      providesTags: ["Notifications"],
    }),

    getUnreadCount: builder.query<BaseResponse<{ count: number }>, string>({
      query: (shopId) => ({
        url: `/v1/notifications/unread-count`,
        method: "GET",
        params: { shopId },
      }),
      providesTags: ["Notifications"],
    }),

    markNotificationAsRead: builder.mutation<
      UpdateNotificationResponse,
      { shopId: string; notificationId: string } & UpdateNotificationDto
    >({
      query: ({ shopId, notificationId, ...data }) => ({
        url: `/v1/notifications`,
        method: "PATCH", 
        params: { shopId, notificationId },
        body: data,
      }),
      // we update redux directly so don't need to refetch
    }),

    markAllAsRead: builder.mutation<
      BaseResponse<{ updated: number }>,
      { shopId: string }
    >({
      query: ({ shopId }) => ({
        url: `/v1/notifications/mark-all-read`,
        method: "PATCH",
        params: { shopId },
      }),
      invalidatesTags: ["Notifications"],
    }),

    deleteNotification: builder.mutation<
      { success: boolean; message: string },
      { shopId: string; notificationId: string }
    >({
      query: ({ shopId, notificationId }) => ({
        url: `/v1/notifications`,
        method: "DELETE",
        params: { shopId, notificationId },
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const { 
  useFetchNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} = notificationsApi;