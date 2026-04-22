export function formatTanggal(tgl) {
  const [year, month, day] = tgl.split("-");
  return `${day}-${month}-${year}`;
}

export function setDefaultTanggal() {
  const today = new Date();
  const firstDay = new Date();
  // sevenDaysAgo.setDate(today.getDate() - 30);
  firstDay.setDate(1);

  // Format ke YYYY-MM-DD (format input type="date")
  const format = (date) => date.toISOString().split("T")[0];

  return {
    mulai: format(firstDay),
    akhir: format(today),
  };
}
