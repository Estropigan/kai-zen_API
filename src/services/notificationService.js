import admin from 'firebase-admin';

/**
 * Sends a push notification using Firebase Cloud Messaging (FCM).
 * @param {string} token - Device FCM token.
 * @param {string} title - Notification title.
 * @param {string} body - Notification body.
 */
export const sendNotification = async (token, title, body) => {
  try {
    const message = {
      token,
      notification: { title, body },
      android: { priority: "high" },
      apns: { payload: { aps: { sound: "default" } } },
    };

    await admin.messaging().send(message);
    console.log(`Notification sent: ${title}`);
  } catch (error) {
    console.error(`Error sending notification: ${error.message}`);
  }
};
