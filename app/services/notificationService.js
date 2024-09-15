import firebaseApp from "./firebaseService";

const messaging = firebaseApp.messaging();

/**
 * @description Send a notification to a device
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {string} token - Device token
 * @param {object} data - Notification data object
 * @param {object} android - Android notification options
 * @param {object} apns - APNS notification options
 * @param {object} webpush - Webpush notification options
 * @returns {Promise} - Promise object represents the result of sending notification
 * @example
 * sendNotification({
 *  title: "Notification Title",
 *  body: "Notification Body",
 * });
 */
export const sendNotification = ({
  title,
  body,
  token,
  data,
  android,
  apns,
  webpush,
}) => {
  const message = {
    token: token,
    android: android || {
      priority: "high",
    },
    apns: apns || {
      headers: {
        "apns-priority": "5",
      },
    },
    webpush: webpush || {
      headers: {
        Urgency: "high",
      },
    },
  };

  if (title) message.notification = { title };
  if (body) message.notification.body = body;

  if (data) message.data = data;

  return messaging.send(message);
};
