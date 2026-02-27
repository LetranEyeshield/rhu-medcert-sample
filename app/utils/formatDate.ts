// utils/formatDate.ts
// export const formatDate = (date?: string | Date) => {
//   if (!date) return "-";
//   return new Date(date).toLocaleDateString("en-US", {
//     month: "long",
//     day: "numeric",
//     year: "numeric",
//   });
// };

// utils/formatDate.ts
export const formatDate = (date?: string | Date) => {
  if (!date) return "-";

  const d = typeof date === "string" ? new Date(date + "T00:00:00") : date;

  if (isNaN(d.getTime())) return "-";

  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};