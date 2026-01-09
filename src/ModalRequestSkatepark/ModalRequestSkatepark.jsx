import { useState, useEffect } from "react";

export default function ModalRequestSkatepark({ isOpen, onClose }) {
  const [form, setForm] = useState({ fullName: "", phone: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function validate() {
    const err = {};
    if (!form.fullName.trim()) err.fullName = "Укажите имя";
    if (!form.phone.trim()) err.phone = "Укажите телефон";
    if (!form.message.trim()) err.message = "Опишите заявку";
    return err;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    const err = validate();
    if (Object.keys(err).length) return setErrors(err);

    setSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE || ""}/api/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccess(true);
      setForm({ fullName: "", phone: "", message: "" });
    } catch (err) {
      console.error(err);
      alert("Ошибка отправки. Проверьте консоль сервера и сеть.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl p-6 shadow-lg">
        <button className="absolute right-4 top-4" onClick={onClose}>✕</button>
        <h3 className="text-lg font-semibold mb-2">Оставьте заявку</h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block">
            <span>Имя</span>
            <input name="fullName" value={form.fullName} onChange={handleChange} className={`mt-1 block w-full rounded border p-2 ${errors.fullName ? 'border-red-400' : 'border-gray-200'}`} />
            {errors.fullName && <div className="text-red-500 text-sm">{errors.fullName}</div>}
          </label>

          <label className="block">
            <span>Телефон</span>
            <input name="phone" value={form.phone} onChange={handleChange} className={`mt-1 block w-full rounded border p-2 ${errors.phone ? 'border-red-400' : 'border-gray-200'}`} />
            {errors.phone && <div className="text-red-500 text-sm">{errors.phone}</div>}
          </label>

          <label className="block">
            <span>Заявка / Пожелания</span>
            <textarea name="message" value={form.message} onChange={handleChange} rows={4} className={`mt-1 block w-full rounded border p-2 ${errors.message ? 'border-red-400' : 'border-gray-200'}`} />
            {errors.message && <div className="text-red-500 text-sm">{errors.message}</div>}
          </label>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Отмена</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-indigo-600 text-white rounded">
              {submitting ? "Отправка..." : "Отправить"}
            </button>
          </div>

          {success && <div className="text-green-600 text-sm mt-2">Заявка отправлена — скоро свяжемся.</div>}
        </form>
      </div>
    </div>
  );
}
