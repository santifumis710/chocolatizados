"use client";

import { useState, useEffect } from "react";
import {
  fetchDiscountCodes,
  createDiscountCode,
  updateDiscountCode,
  deleteDiscountCode,
} from "@/services/api";

interface DiscountCode {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  max_uses: number | null;
  uses_count: number;
  expires_at: string | null;
  is_active: boolean;
}

const emptyForm = {
  code: "",
  discount_type: "percentage" as "percentage" | "fixed",
  discount_value: "",
  max_uses: "",
  expires_at: "",
  is_active: true,
};

export function DiscountCodesTab() {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DiscountCode | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const load = async () => {
    try {
      const data = await fetchDiscountCodes();
      setCodes(data);
    } catch {
      alert("Error cargando códigos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (dc: DiscountCode) => {
    setEditing(dc);
    setForm({
      code: dc.code,
      discount_type: dc.discount_type,
      discount_value: String(dc.discount_value),
      max_uses: dc.max_uses != null ? String(dc.max_uses) : "",
      expires_at: dc.expires_at ? dc.expires_at.slice(0, 16) : "",
      is_active: dc.is_active,
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const value = parseFloat(form.discount_value);
    if (!form.code.trim()) { setFormError("El código es requerido"); return; }
    if (isNaN(value) || value <= 0) { setFormError("El valor debe ser mayor a 0"); return; }
    if (form.discount_type === "percentage" && value > 100) { setFormError("El porcentaje no puede superar 100"); return; }

    setSaving(true);
    const payload = {
      code: form.code.trim().toUpperCase(),
      discount_type: form.discount_type,
      discount_value: value,
      max_uses: form.max_uses ? parseInt(form.max_uses) : null,
      expires_at: form.expires_at || null,
      is_active: form.is_active,
    };

    try {
      if (editing) {
        await updateDiscountCode(editing.id, payload);
      } else {
        await createDiscountCode(payload);
      }
      setModalOpen(false);
      load();
    } catch (err: any) {
      setFormError(err.message || "Error guardando");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este código?")) return;
    try {
      await deleteDiscountCode(id);
      load();
    } catch {
      alert("Error eliminando código");
    }
  };

  const toggleActive = async (dc: DiscountCode) => {
    try {
      await updateDiscountCode(dc.id, { ...dc, is_active: !dc.is_active });
      load();
    } catch {
      alert("Error actualizando");
    }
  };

  if (loading) return <div className="p-4">Cargando...</div>;

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-primary text-white border-none rounded cursor-pointer font-bold"
        >
          + Nuevo código
        </button>
      </div>

      {codes.length === 0 ? (
        <p className="text-textLight text-center py-8">No hay códigos de descuento creados.</p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-border text-left">
              <th className="p-2">Código</th>
              <th className="p-2">Descuento</th>
              <th className="p-2">Usos</th>
              <th className="p-2">Vencimiento</th>
              <th className="p-2">Activo</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {codes.map((dc) => (
              <tr key={dc.id} className="border-b border-border">
                <td className="p-2 font-bold font-mono">{dc.code}</td>
                <td className="p-2">
                  {dc.discount_type === "percentage"
                    ? `${dc.discount_value}%`
                    : `$${dc.discount_value.toLocaleString("es-AR")}`}
                </td>
                <td className="p-2">
                  {dc.uses_count}{dc.max_uses != null ? ` / ${dc.max_uses}` : ""}
                </td>
                <td className="p-2">
                  {dc.expires_at
                    ? new Date(dc.expires_at).toLocaleDateString("es-AR")
                    : "Sin vencimiento"}
                </td>
                <td className="p-2">
                  <button
                    onClick={() => toggleActive(dc)}
                    title={dc.is_active ? "Desactivar" : "Activar"}
                    className="bg-transparent border-none cursor-pointer text-lg"
                  >
                    {dc.is_active ? "✅" : "⛔"}
                  </button>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => openEdit(dc)}
                    className="mr-2 cursor-pointer text-blue-600 bg-transparent border-none"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDelete(dc.id)}
                    className="cursor-pointer text-red-600 bg-transparent border-none"
                  >
                    🗑️ Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalOpen && (
        <>
          <div
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 bg-black/50 z-[1999]"
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg z-[2000] w-[90%] max-w-[440px] p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="m-0 text-lg text-primary">
                {editing ? "Editar código" : "Nuevo código de descuento"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="bg-transparent border-none text-2xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div>
                <label className="block mb-1 text-sm font-bold">Código *</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                  placeholder="Ej: PROMO15"
                  className="w-full p-3 border border-border rounded font-mono"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-bold">Tipo de descuento *</label>
                <select
                  value={form.discount_type}
                  onChange={(e) => setForm((f) => ({ ...f, discount_type: e.target.value as any }))}
                  className="w-full p-3 border border-border rounded"
                >
                  <option value="percentage">Porcentaje (%)</option>
                  <option value="fixed">Monto fijo ($)</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-bold">
                  Valor *{form.discount_type === "percentage" ? " (%)" : " ($)"}
                </label>
                <input
                  type="number"
                  min="0"
                  max={form.discount_type === "percentage" ? "100" : undefined}
                  step="0.01"
                  value={form.discount_value}
                  onChange={(e) => setForm((f) => ({ ...f, discount_value: e.target.value }))}
                  placeholder={form.discount_type === "percentage" ? "Ej: 15" : "Ej: 500"}
                  className="w-full p-3 border border-border rounded"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-bold">Límite de usos (vacío = ilimitado)</label>
                <input
                  type="number"
                  min="1"
                  value={form.max_uses}
                  onChange={(e) => setForm((f) => ({ ...f, max_uses: e.target.value }))}
                  placeholder="Ej: 50"
                  className="w-full p-3 border border-border rounded"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-bold">Fecha de vencimiento (vacío = sin vencimiento)</label>
                <input
                  type="datetime-local"
                  value={form.expires_at}
                  onChange={(e) => setForm((f) => ({ ...f, expires_at: e.target.value }))}
                  className="w-full p-3 border border-border rounded"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.is_active}
                  onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                  className="w-4 h-4"
                />
                <label htmlFor="is_active" className="text-sm font-bold cursor-pointer">Activo</label>
              </div>

              {formError && (
                <p className="text-error text-sm">{formError}</p>
              )}

              <div className="flex gap-3 mt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 p-3 bg-primary text-white border-none rounded font-bold cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Guardando..." : "Guardar"}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 p-3 bg-white text-text border border-border rounded cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
}
