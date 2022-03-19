export default function getCollectionExpireDate(
  eventStartDate: Date, //in UTC
  eventDurationInDays: number
): Date {
  const ms = eventStartDate.getTime() + (eventDurationInDays * 24 * 60 * 60 * 1000)
  const eventEndDate = new Date();
  eventEndDate.setTime(ms)
  return eventEndDate
}
