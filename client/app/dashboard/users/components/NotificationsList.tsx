const notifications = [
  { id: 1, message: "New visitor registered.", type: "info", date: "2026-01-09 10:15" },
  { id: 2, message: "Guard shift updated.", type: "success", date: "2026-01-08 18:30" },
  { id: 3, message: "Unauthorized access attempt detected.", type: "warning", date: "2026-01-07 22:05" },
  { id: 4, message: "System maintenance scheduled.", type: "info", date: "2026-01-06 09:00" },
];

export  function NotificationsList() {
  return (
    <ul>
      {notifications.map((n) => (
        <li key={n.id}>
          <div className="p-4 border-b border-slate-200 flex justify-between items-center gap-30">
          {n.message}  
          <em>({n.date})</em>

          </div>
        </li>
      ))}
    </ul>
  );
}