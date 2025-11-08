import { supabase } from '../contexts/SupabaseContext';

export function setupRealtimeNotifications() {
  // Safe permission
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission().catch(() => {});
  }

  const tables = [
    { table: 'school_jobs', url: '/school-jobs' },
    { table: 'home_tuition_jobs', url: '/home-tuition' }
  ];

  tables.forEach(({ table, url }) => {
    try {
      supabase
        .channel(`rt-${table}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: table
          },
          (payload) => {
            try {
              const row = payload.new || {};

              const title =
                table === "school_jobs"
                  ? `New School Job: ${row.title || "New Posting"}`
                  : `New Home Tuition: ${row.title || "New Posting"}`;

              const body = [
                row.location,
                row.subjects || row.subject,
                row.student_class,
                row.salary_range,
                row.hourly_rate ? `₹${row.hourly_rate}/hr` : null,
              ]
                .filter(Boolean)
                .join(" • ");

              // ✅ Safe notification wrapper
              if ("Notification" in window && Notification.permission === "granted") {
                navigator.serviceWorker.ready.then((reg) => {
                  reg.showNotification(title, {
                    body: body || "Tap to view",
                    icon: "/icon-192.png",
                    data: { url },
                  });
                });
              } else {
                // ✅ Fallback toast dispatch
                window.dispatchEvent(
                  new CustomEvent("app:new-listing", {
                    detail: { title, body, url },
                  })
                );
              }
            } catch (err) {
              console.warn("Realtime handler error:", err);
            }
          }
        )
        .subscribe();
    } catch (err) {
      console.warn("Realtime subscribe error:", err);
    }
  });
}
