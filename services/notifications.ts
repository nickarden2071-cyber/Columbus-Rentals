
export type NotificationType = 'BOOKING_CREATED' | 'BOOKING_ENDING_SOON';

export async function sendNotification(type: NotificationType, payload: any) {
  // Placeholder for email/SMS integration (e.g., SendGrid, Twilio)
  console.log(`[NOTIFICATION] Type: ${type}`);
  console.log(`[NOTIFICATION] Payload:`, JSON.stringify(payload, null, 2));
  
  // In a real app, you would await emailService.send(...)
  return true;
}
